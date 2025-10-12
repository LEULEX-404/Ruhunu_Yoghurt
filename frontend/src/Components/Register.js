import { useState } from 'react';
import { register } from '../api/auth.js';
import { Toaster, toast } from "sonner";
import '../Css/Register.css';
import image from '../images/login.jpg';

export default function RegisterPage() {

  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    password: ''
  });

  const [confirm, setConfirm] = useState('');

  // Toggle visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // === Validation Function ===
  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!form.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Enter a valid email address");
      return false;
    }
    if (!form.address.trim()) {
      toast.error("Address is required");
      return false;
    }
    if (!form.phone.trim()) {
      toast.error("Phone number is required");
      return false;
    }
    if (!/^[0-9]{10}$/.test(form.phone)) {
      toast.error("Enter a valid 10-digit phone number");
      return false;
    }
    if (!form.password.trim()) {
      toast.error("Password is required");
      return false;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    if (form.password !== confirm) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await register(form);
      toast.success("Registration successful. Please log in.");
      setForm({ name: '', email: '', address: '', phone: '', password: '' });
      setConfirm('');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <Toaster position="top-center" richColors />
      <div className="register-card">


        <div className="register-image">
          <img src={image} alt="Welcome" />
        </div>


        <form className="register-form" onSubmit={handleSubmit}>
          <h2 className="form-title">Create Account</h2>

          <input className="form-input" placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />

          <input className="form-input" placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />

          <input className="form-input" placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })} />

          <input className="form-input" placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} />


          <div className="password-wrapper">
            <input
              className="form-input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <i
              className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} eye-icon`}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>


          <div className="password-wrapper">
            <input
              className="form-input"
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            <i
              className={`fas ${showConfirm ? "fa-eye-slash" : "fa-eye"} eye-icon`}
              onClick={() => setShowConfirm(!showConfirm)}
            ></i>
          </div>

          <button className="form-button" type="submit">Register</button>
        </form>

      </div>
    </div>
  );
}
