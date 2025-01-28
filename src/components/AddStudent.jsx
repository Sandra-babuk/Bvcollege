import React, { useState } from 'react';
import { registerApi } from '../services/allApi';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './addStudent.css'; // Ensure to create and update this CSS file

function AddStudent() {
  const [userData, setUserData] = useState({
    full_name: '',
    dob: '',
    gender: '',
    email: '',
    phone: '',
    password: '',
    course: '',
    department: '',
    batch: '',
    role: 'student', // Add role here to send with registration data
  });

  const [isLoading, setIsLoading] = useState(false); // To manage the loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true

    const { full_name, dob, gender, email, phone, password, course, department, batch, role } = userData;

    // Check if any field is empty
    if (!full_name || !dob || !gender || !email || !phone || !password || !course || !department || !batch) {
      toast.warning('Please fill out all fields');
      setIsLoading(false); // Reset loading state
      return;
    }

    try {
      const response = await registerApi({
        full_name,
        dob,
        gender,
        email,
        phone,
        password,
        course,
        department,
        batch,
        role,
      });

      console.log('User Data:', userData); // Debug log to check data being sent

      if (response.status === 200) {
        toast.success('OTP sent successfully');
        setUserData({
          full_name: '',
          dob: '',
          gender: '',
          email: '',
          phone: '',
          password: '',
          course: '', 
          department: '', 
          batch: '', 
          role: 'student',
        });
        navigate('/Otp', { state: { email } });
      } else {
        toast.error('Registration failed! Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false); // Reset loading state after the request
    }
  };

  return (
    <div className="add-user-container">
      <div className="form-wrapper">
        <h1 className="form-title">Add Student Details</h1>
        <form onSubmit={handleRegistration}>
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
            <label htmlFor="batch">Batch</label>
            <select
              id="batch"
              name="batch"
              value={userData.batch}
              onChange={handleChange}
            >
              <option value="">Select Batch</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
            </select>
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
          <div className="form-group">
            <label htmlFor="department">Department</label>
            <select
              id="department"
              name="department"
              value={userData.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              <option value="Chemical Engineering">Chemical Engineering</option>
              <option value="Computer Engineering">Computer Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Electronic Engineering">Electronic Engineering</option>
              <option value="EC Engineering">EC Engineering</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="course">Course</label>
            <select
              id="course"
              name="course"
              value={userData.course}
              onChange={handleChange}
            >
              <option value="">Select Course</option>
              <option value="B.Tech">B.Tech</option>
              <option value="M.Tech">M.Tech</option>
            </select>
          </div>
          <div className="form-buttons">
            <button type="button" className="cancel" onClick={() => navigate('/')}>
              Cancel
            </button>
            <button type="submit" className="create" disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AddStudent;
