import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { editStdApi } from '../services/allApi'; // Ensure the path is correct

const EditStudent = () => {
  const location = useLocation();
  const student = location.state?.student; // Get the student data from navigation state
  const { password, ...initialUserData } = student || {}; // Exclude password from the data
  const [userData, setUserData] = useState({ ...initialUserData });
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Handle form submission
  const handleEdit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access'); // Retrieve token from localStorage

    if (!token) {
      console.error('No token found in localStorage');
      Swal.fire({
        icon: 'error',
        title: 'Authorization Error',
        text: 'You are not authorized. Please log in again.',
      });
      return;
    }

    try {
      const response = await editStdApi(student.id, userData, token);
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Student Updated',
          text: 'The student details have been updated successfully.',
        }).then(() => {
          navigate('/view-students'); // Redirect to the "View Students" page
        });
      } else {
        throw new Error('Failed to update student details.');
      }
    } catch (error) {
      console.error('Error updating student:', error.response?.data || error.message);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.response?.data?.message || 'An unexpected error occurred. Please try again later.',
      });
    }
  };

  return (
    <div className="edit-student-container">
      <div className="main">
        <div className="form-container">
          <h1>Edit Student Details</h1>
          <form onSubmit={handleEdit}>
            <div className="form-group">
              <label htmlFor="full_name">Full Name</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                placeholder="Enter full name"
                value={userData.full_name || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="dob">Date of Birth</label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={userData.dob || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={userData.gender || ''}
                onChange={handleChange}
                required
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
                placeholder="Enter phone number"
                value={userData.phone || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="batch">Batch</label>
              <select
                id="batch"
                name="batch"
                value={userData.batch || ''}
                onChange={handleChange}
                required
              >
                <option value="">Select Batch</option>
                <option value="1">2020</option>
                <option value="2">2021</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter email"
                value={userData.email || ''}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="department">Department</label>
              <select
                id="department"
                name="department"
                value={userData.department || ''}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                <option value="1">Chemical Engineering</option>
                <option value="2">Computer Engineering</option>
                <option value="3">Civil Engineering</option>
                <option value="4">Electronic Engineering</option>
                <option value="5">EC Engineering</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="course">Course</label>
              <select
                id="course"
                name="course"
                value={userData.course || ''}
                onChange={handleChange}
                required
              >
                <option value="">Select Course</option>
                <option value="3">B.tech</option>
                <option value="2">M.tech</option>
              </select>
            </div>
            <div className="form-buttons">
              <button type="button" className="cancel" onClick={() => navigate('/view-students')}>
                Cancel
              </button>
              <button type="submit" className="create">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditStudent;
