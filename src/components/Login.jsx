import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginApi } from "../services/allApi";
import "./login.css"; // Import the CSS file

function Login() {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userData.email || !userData.password) {
      toast.error("Please enter all fields");
      return;
    }

    try {
      const result = await loginApi(userData);
      if (result.status === 200) {
        // Storing the token and user data in localStorage
        localStorage.setItem("loggedUser", JSON.stringify(result.data));
        localStorage.setItem("access", result.data.access);
        localStorage.setItem("username", result.data.full_name);
        localStorage.setItem("userId", result.data.id);
        localStorage.setItem("role", result.data.role);
        localStorage.setItem("department", result.data.department);
        localStorage.setItem("course", result.data.course);
        localStorage.setItem("subject", result.data.subject);

        setUserData({ email: "", password: "" });
        toast.success("Login successful");
        navigate("/home");
      } else if (result.status === 401) {
        toast.error("Invalid email or password");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="lg-Box">
      <div className="log-content">
        <div className="lg-head">
          <p>WELCOME BACK</p>
          <p>Welcome back! Please enter your details.</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="i-box">
            <label htmlFor="email" className="t">
              Email
            </label>
            <input
              name="email"
              value={userData.email}
              onChange={handleChange}
              type="email"
              id="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="i-box">
            <label htmlFor="password" className="t">
              Password
            </label>
            <input
              name="password"
              value={userData.password}
              onChange={handleChange}
              type="password"
              id="password"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="fp">
            <div className="remme">
              <input type="checkbox" />
              <p>Remember me</p>
            </div>
            <p>Forgot Password</p>
          </div>

          <button type="submit" className="signBtn">
            Sign in
          </button>
        </form>

        <button className="google">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
            alt="Google logo"
          />
          Sign in with Google
        </button>
        <p className="spf">
          Don't have an account? <Link to="/signup">Click here to signup</Link>
        </p>
      </div>

      <div className="lgImg">
        <img
          src="https://img.freepik.com/premium-photo/student-black-man-books-study-home-desk-thinking-reading-studying-college-person-learning-focused-information-page-education-knowledge-working-law-research_590464-177778.jpg"
          alt="Student studying"
        />
      </div>
    </div>
  );
}

export default Login;
