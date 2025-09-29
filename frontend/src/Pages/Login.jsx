import { useState } from "react";
import { login } from "../api/auth.js";
import { Toaster, toast } from "sonner";
import RegisterPage from "../Components/Register.js";
import image from "../images/login.jpg";
import "../Css/Login.css";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showRegister, setShowRegister] = useState(false);
  const [showChoice, setShowChoice] = useState(false);
  const [user, setUser] = useState(null);

  // eye toggle
  const [showPassword, setShowPassword] = useState(false);

  // === Validation Function ===
  const validateForm = () => {
    if (!form.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Enter a valid email address");
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
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await login(form);
      console.log("Login response:", response);

      const { data } = response;
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (
        data.user.role === "HR Manager" ||
        data.user.role === "Delivery Manager" ||
        data.user.role === "Order Manager" ||
        data.user.role === "Product Manager" ||
        data.user.role === "Stock Manager" ||
        data.user.role === "Driver"
      ) {
        setShowChoice(true);
        setUser(data.user);
        toast.success(
          `Logged in as ${data.user.role}. Please choose your dashboard.`
        );
      } else if (data.user.role === "Staff") {
        toast.success("Welcome Staff! Redirecting to Attendance...");
        setTimeout(() => {
          window.location.href = "/attendence";
        }, 1500);
      } else if (data.user.role === "customer") {
        toast.success("Welcome back! Redirecting to your profile...");
        setTimeout(() => {
          window.location.href = "/products";
        }, 1500);
      } else {
        toast.error("❌ Unauthorized role. Please contact admin.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Login failed!");
    }
  };

  return (
    <div className="login-container">
      <Toaster position="top-center" richColors />
      <div className="login-wrapper">
        {/* Left side image */}
        <div className="login-image">
          <img src={image} alt="Login Illustration" />
        </div>

        {/* Right side form */}
        <div className="login-card">
          <div className="avatar">
            <span>🙍‍♂️</span>
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to your account to continue</p>
          <form onSubmit={handleSubmit}>
            <input className="form-input"
              type="text"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />


            <div className="password-wrapper">
              <input className="form-input"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
              <i
                className={`fas ${
                  showPassword ? "fa-eye-slash" : "fa-eye"
                } eye-icon`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            <div className="options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#">Forgot password?</a>
            </div>
            <button className="button" type="submit">
              Sign In
            </button>
          </form>
          <p className="signup">
            Don't have an account?{" "}
            <button
              className="link-button"
              type="button"
              onClick={() => setShowRegister(true)}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>

      {/* Register Modal */}
      {showRegister && (
        <div className="register-modal-overlay">
          <div className="register-modal-content">
            <button
              className="register-modal-close"
              onClick={() => setShowRegister(false)}
            >
              ✖
            </button>
            <RegisterPage />
          </div>
        </div>
      )}

      {/* Choice Modal */}
=======
import '../Css/Login.css';

export default function LoginPage() {

    const[form, setForm] = useState({
        email: "",
        password: ""
    });

    const [showRegister, setShowRegister] = useState(false);
    const [showChoice, setShowChoice] = useState(false);
    const [user, setUser] = useState(null);


    const handleSubmit = async (e) => {
        e.preventDefault();
    try {
        const response = await login(form);
        console.log("Login response:", response);

        const { data } = response;
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user))

        if (data.user.role === "HR Manager" || data.user.role === "Delivery Manager"|| data.user.role === "Order Manager" || data.user.role === "Product Manager" || data.user.role === "Stock Manager" || data.user.role === "Driver") {
            setShowChoice(true);
            setUser(data.user);
            toast.success(`Logged in as ${data.user.role}. Please choose your dashboard.`);
        }
        else if (data.user.role === "Staff") {
          toast.success("Welcome Staff! Redirecting to Attendance...");
          setTimeout(() => {
            window.location.href = "/attendence";
          }, 1500);
        } 
        else if (data.user.role === "customer") {
          toast.success("Welcome back! Redirecting to your profile...");
        setTimeout(() => {
          window.location.href = "/userProfile";
        }, 1500);
        }
        else {
          toast.error("❌ Unauthorized role. Please contact admin.");
        }
        
    }catch (error) {
      toast.error(error.response?.data?.message || "❌ Login failed!");
    }
    };

    return (
        <div className="login-container">
           <Toaster position="top-right" richColors />
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

      {/* ✅ Manager Choice Modal */}

      {showChoice && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Hello {user?.name}, Where do you want to go?</h2>
            <div className="choice-buttons">
              <button
                className="button"
                onClick={() =>
                  user.role === "HR Manager"
                    ? (window.location.href = "/hrDashboard")
                    : user.role === "Delivery Manager"
                    ? (window.location.href = "/deliveryDashboard")
                    : user.role === "Product Manager"

                    ? (window.location.href = "/admin/")
                    : user.role === "Order Manager"
                    ? (window.location.href = "/orderDashboard")
                    : user.role === "Stock Manager"
                    ? (window.location.href = "/stockDashboard")

                    ? (window.location.href = "/productDashboard")
                    : user.role === "Order Manager"
                    ? (window.location.href = "/orderDashboard")
                    : user.role === "Stock Manager"
                    ? (window.location.href = "/smdashboard")

                    : user.role === "Driver"
                    ? (window.location.href = "/driverPortal")
                    : alert("Login Error")
                }
              >
                Go to Dashboard
              </button>
              <button
                className="button"
                onClick={() => (window.location.href = "/attendence")}
              >
                Go to Attendance
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


    </div>
    );
}
