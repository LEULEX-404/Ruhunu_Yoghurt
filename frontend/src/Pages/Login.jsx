import { useState } from "react";
import { login } from "../api/auth.js";
import RegisterPage from "../Components/Register.js";
import '../Css/Login.css';

export default function LoginPage() {

    const[form, setForm] = useState({
        email: "",
        password: ""
    });

    const [showRegister, setShowRegister] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
    try {
        const { data } = await login(form);
        localStorage.setItem("token", data.token);

        if (data.user.role === "HR Manager") {
            window.location.href = "/hrDashboard";
        } else if (data.user.role === "Delivery Manager") {
            window.location.href = "/deliveryDashboard";
        }else {
            alert("Unauthorized role");
        }
        
    }catch (error) {
        alert(error.response.data.message || "Login failed");
    }
    };

    return (
        <div className="login-container">
      <div className="login-card">
        <div className="avatar">
          <span>🙍‍♂️</span>
        </div>
        <h2>Welcome Back</h2>
        <p>Sign in to your account to continue</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <div className="options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="Register.jsx">Forgot password?</a>
          </div>
          <button className="button"type="submit">Sign In</button>
        </form>
        <p className="signup">
          Don't have an account? {" "}
          <button className="link-button" type ="button" onClick={() => setShowRegister(true)}>
            Sign Up
          </button>
        </p>
      </div>

      {showRegister && (
         <div className="modal-overlay">
         <div className="modal-content">
           <button
             className="modal-close"
             onClick={() => setShowRegister(false)}
           >
             ✖
           </button>
           <RegisterPage />
         </div>
       </div>
     )}
    </div>
    );
}