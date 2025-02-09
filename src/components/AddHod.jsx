import React, { useEffect, useState } from "react";
import "./addhod.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { departmentApi, registerApi, verifyOtpApi } from "../services/allApi";

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
  const [department, setDepartment] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const AllDept = async () => {
      try {
        const response = await departmentApi();
        if (response.status === 200) {
          setDepartment(response.data);
        } else {
          toast.error('Failed to get departments');
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        toast.error('An unexpected error occurred. Please try again.');
      }
    };
    AllDept();
  }, []);

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
        toast.success("Registration initiated. Please verify OTP.");
        navigate("/Otp", { state: { email: userData.email, onOtpVerify: handleOtpVerification } });
      } else {
        toast.error("Registration initiation failed! Please try again.");
      }
    } catch (error) {
      console.error("Error during registration initiation:", error.response?.data || error.message);

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

  const handleOtpVerification = async (otp) => {
    setIsLoading(true);
    try {
      const response = await verifyOtpApi({ email: userData.email, otp });

      if (response.status === 200) {
        toast.success("OTP verified successfully. Registration completed.");
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
        navigate("/");
      } else {
        toast.error("OTP verification failed! Please try again.");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error.response?.data || error.message);

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
                <input type="text" id="full_name" name="full_name" placeholder="Enter full name" value={userData.full_name} onChange={handleChange} className="input-field" />
              </div>

              <div className="input-group">
                <label htmlFor="dob">Date of Birth</label>
                <input type="date" id="dob" name="dob" value={userData.dob} onChange={handleChange} className="input-field" />
              </div>

              <div className="input-group">
                <label htmlFor="gender">Gender</label>
                <select id="gender" name="gender" value={userData.gender} onChange={handleChange} className="select-field">
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" placeholder="Enter phone number" value={userData.phone} onChange={handleChange} className="input-field" />
              </div>

              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" placeholder="Enter email address" value={userData.email} onChange={handleChange} className="input-field" autoComplete="email" />
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" placeholder="Create password" value={userData.password} onChange={handleChange} className="input-field" autoComplete="new-password" />
              </div>

              <div className="input-group">
                <label htmlFor="department">Department</label>
                <select id="department" name="department" value={userData.department} onChange={handleChange} className="select-field">
                  {department.map((dept) => (
                    <option key={dept.id} value={dept.id}>{dept.department_name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => navigate("/")}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={isLoading}>{isLoading ? "Processing..." : "Register HOD"}</button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AddHod;
