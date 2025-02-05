import React, { useEffect, useState } from 'react';
import './addStudent.css';
import { departmentApi, registerApi } from '../services/allApi';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

function StudentRegistration() {
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
    role: 'student',
  });

  const [department, setDepartment] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
    setUserData({ ...userData, [name]: value });
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { full_name, dob, gender, email, phone, password, course, department, batch, role } = userData;

    if (!full_name || !dob || !gender || !email || !phone || !password || !course || !department || !batch) {
      toast.warning('Please fill out all fields');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Sending data:', {
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
      console.error('Error during registration:', error.response || error.message);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registration-page">
      <div className="registration-container">
        <div className="registration-card">
          <header className="registration-header">
            <h1>Student Registration</h1>
            <p>Enter student details to create a new account</p>
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
                <label htmlFor="batch">Batch Year</label>
                <select
                  id="batch"
                  name="batch"
                  value={userData.batch}
                  onChange={handleChange}
                  className="select-field"
                >
                  <option value="">Select Batch</option>
                  <option value="1">2020</option>
                  <option value="2">2021</option>
                </select>
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
                  {department.map((dept) => (
                    <option key={dept.id} value={dept.id}>{dept.department_name}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="course">Course</label>
                <select
                  id="course"
                  name="course"
                  value={userData.course}
                  onChange={handleChange}
                  className="select-field"
                >
                  <option value="">Select Course</option>
                  <option value="3">B.Tech</option>
                  <option value="2">M.Tech</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Register Student'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default StudentRegistration;
