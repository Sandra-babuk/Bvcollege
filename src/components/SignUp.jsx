import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import './signup.css'; // Import the CSS file

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please enter both email and password!",
      });
      return;
    }

    // Validate credentials
    if (email === "bvcollege2024@gmail.com" && password === "admin2024") {
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome back!",
        confirmButtonText: "Proceed",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/admin-home");
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid email or password.",
      });
    }
  };

  return (
    <div className="signup-Box">
      <div className="signup-content">
        <div className="signup-head">
          <p>WELCOME ADMIN</p>
          <p>Please enter your login details.</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="signup-input-box">
            <label htmlFor="email" className="signup-label">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="signup-input-box">
            <label htmlFor="password" className="signup-label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="signup-button">Login</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
