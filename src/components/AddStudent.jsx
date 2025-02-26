import React, { useEffect, useState } from 'react';
import './addStudent.css';
import { departmentApi, registerApi, getCoursesApi, getBatchApi } from '../services/allApi';
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
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const deptResponse = await departmentApi();
        if (deptResponse.status === 200) {
          setDepartment(deptResponse.data);
        } else {
          toast.error('Failed to get departments');
        }

        const courseResponse = await getCoursesApi();
        if (courseResponse.status === 200) {
          setCourses(courseResponse.data);
        } else {
          toast.error('Failed to get courses');
        }

        const batchResponse = await getBatchApi();
        if (batchResponse.status === 200) {
          setBatches(batchResponse.data);
        } else {
          toast.error('Failed to get batches');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('An unexpected error occurred. Please try again.');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // Validation function
  const validateInputs = () => {
    const { full_name, dob, gender, email, phone, password, course, department, batch } = userData;

    if (!full_name.trim()) return "Full Name is required.";
    if (!dob) return "Date of Birth is required.";
    if (!gender) return "Gender is required.";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Invalid email format.";
    if (!/^\d{10}$/.test(phone)) return "Phone number must be 10 digits.";
    if (password.length < 6) return "Password must be at least 6 characters long.";
    if (!course) return "Course is required.";
    if (!department) return "Department is required.";
    if (!batch) return "Batch is required.";

    return null;
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setIsLoading(true); 

    const validationError = validateInputs();
    if (validationError) {
      toast.warning(validationError); 
      setIsLoading(false); 
      return;
    }

    const { full_name, dob, gender, email, phone, password, course, department, batch, role } = userData;

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

      console.log('User Data:', userData); 

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
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>{batch.batch_name}</option>
                  ))}
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
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>{course.course_name}</option>
                  ))}
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
