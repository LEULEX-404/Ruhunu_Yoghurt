import { useState } from "react";
import { login } from "../api/auth.js";
import { Toaster, toast } from "sonner";
import RegisterPage from "../Components/Register.js";
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