import React, { useState, useEffect } from "react";
import "./addhod.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { registerApi, departmentApi } from "../services/allApi";

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

  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await departmentApi();
        if (response.status === 200) {
          setDepartments(response.data);
        } else {
          toast.error("Failed to fetch departments");
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        toast.error("An error occurred while fetching departments");
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { full_name, dob, gender, email, phone, password, department } = userData;
    if (!full_name || !dob || !gender || !email || !phone || !password || !department) {
      toast.warning("Please fill out all fields");
      setIsLoading(false);
      return;
    }

    try {
      const response = await registerApi({ ...userData, department: Number(department) });
      if (response.status === 200) {
        toast.success("OTP sent successfully");
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
      if (error.response?.data) {
        Object.keys(error.response.data).forEach((field) => {
          toast.error(`${field}: ${error.response.data[field].join(",")}`);
        });
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registration-page">
      <div className="registration-container">
        <div className="registration-card">
          <header className="registration-header">
            <h1>HOD Registration</h1>
            <p>Enter HOD details to create a new account</p>
          </header>

          <form onSubmit={handleRegistration} className="registration-form">
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="full_name">Full Name</label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  placeholder="Enter full name"
                  value={userData.full_name}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label htmlFor="dob">Date of Birth</label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={userData.dob}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={userData.gender}
                  onChange={handleChange}
                  className="select-field"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter phone number"
                  value={userData.phone}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter email address"
                  value={userData.email}
                  onChange={handleChange}
                  className="input-field"
                  autoComplete="email"
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create password"
                  value={userData.password}
                  onChange={handleChange}
                  className="input-field"
                  autoComplete="new-password"
                />
              </div>

              <div className="input-group">
                <label htmlFor="department">Department</label>
                <select
                  id="department"
                  name="department"
                  value={userData.department}
                  onChange={handleChange}
                  className="select-field"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.department_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => navigate("/")}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={isLoading}>
                {isLoading ? "Processing..." : "Register HOD"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AddHod;
