import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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
    <div
      className="row w-100 d-flex justify-content-center align-items-center"
      style={{ height: "80vh" }}
    >
      <div className="row w-75 mt-5" style={{ height: "470px" }}>
        <div className="col-md-6 shadow d-flex justify-content-center align-items-center flex-column p-5">
          <div
            className="p-3 d-flex justify-content-center align-items-center"
            style={{
              height: "70px",
              width: "70px",
              border: "3px solid red",
              borderRadius: "50px",
            }}
          >
            <i className="fa-solid fa-lock fa-2x text-primary"></i>
          </div>
          <h2 className="text-center text-primary d-flex">Welcome Admin</h2>
          <form
            className="border rounded p-3 w-100 shadow mt-3"
            onSubmit={handleLogin}
          >
            <div className="mb-4 mt-3">
              <input
                type="text"
                placeholder="Enter email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Enter password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <button className="btn btn-primary" type="submit">
                Login
              </button>
            </div>
          </form>
        </div>
        <div
          className="col-md-6 shadow p-0 d-flex justify-content-center align-items-center flex-column text-light"
          style={{
            backgroundImage:
              "url('https://us.123rf.com/450wm/mashmuh/mashmuh2012/mashmuh201200408/160498085-online-registration-or-sing-up-concept-young-woman-logs-into-the-site-young-woman-posting-resume.jpg?ver=6')",
            backgroundSize: "cover",
          }}
        >
          <div className="d-flex justify-content-center align-items-center flex-column"></div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;