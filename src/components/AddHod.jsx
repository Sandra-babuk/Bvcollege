import React, { useState } from "react";
import "./addhod.css";
import { registerApi } from "../services/allApi";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function AddHod() {
  const [userData, setUserData] = useState({
    full_name: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    password: "",
    department: "",
    role: "hod",
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { full_name, dob, gender, email, phone, password, department } = userData;

    // Validation: Check for empty fields
    if (!full_name || !dob || !gender || !email || !phone || !password || !department) {
      toast.warning("Please fill out all fields");
      setIsLoading(false);
      return;
    }

    try {
      const response = await registerApi({
        ...userData,
        department: Number(department),
      });

      if (response.status === 200) {
        toast.success("Registration successful");
        setUserData({
          full_name: "",
          dob: "",
          gender: "",
          email: "",
          phone: "",
          password: "",
          department: "",
          role: "hod",
        });
        navigate("/Otp", { state: { email: userData.email } });
      } else {
        toast.error("Registration failed! Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error.response?.data || error.message);

      // Display field-specific error messages
      if (error.response?.data) {
        const errors = error.response.data;
        Object.keys(errors).forEach((field) => {
          toast.error(`${field}: ${errors[field].join(", ")}`);
        });
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-user-container">
      <div className="main">
        <div className="form-container">
          <h1>Add HOD Details</h1>
          <form onSubmit={handleRegistration}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="full_name">Full Name</label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    placeholder="Enter your full name"
                    value={userData.full_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="dob">Date of Birth</label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={userData.dob}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={userData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={userData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={userData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter Password"
                    value={userData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </div>
            <div className="form-group mt-3">
              <label htmlFor="department">Department</label>
              <select
                id="department"
                name="department"
                value={userData.department}
                onChange={handleChange}
              >
                <option value="">Select Department</option>
                <option value="1">B.Tech</option>
                <option value="2">M.Tech</option>
              </select>
            </div>
            <div className="form-buttons mt-4">
              <button
                type="button"
                className="cancel"
                onClick={() => navigate("/")}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button type="submit" className="create" disabled={isLoading}>
                {isLoading ? "Registering..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default AddHod;
