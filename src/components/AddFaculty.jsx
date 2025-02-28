import React, { useState, useEffect } from "react";
import './addFac.css';
import { departmentApi, getBatchApi, getCoursesApi, getSubjectApi, registerApi } from "../services/allApi";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function FacultyRegistration() {
  const [userData, setUserData] = useState({
    full_name: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    password: "",
    department: "",
    course: "",
    batch: "",
    subject: "",
    photo: null,
    role: "faculty",
  });

  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      const file = files[0];
      if (file) {
        if (file.type.startsWith("image/")) {
          if (file.size <= 2 * 1024 * 1024) {
            setUserData({ ...userData, photo: file });
          } else {
            toast.error("Image size must be less than 2MB.");
          }
        } else {
          toast.error("Please upload a valid image file (JPEG, PNG, etc.)");
        }
      }
    } else {
      setUserData({ ...userData, [name]: value.trim() });
    }
  };




  const validateInputs = () => {
    const { full_name, dob, gender, email, phone, password, department, course, batch, photo } = userData;

    if (!full_name.trim()) return "Full Name is required.";
    if (!dob) return "Date of Birth is required.";
    if (!gender) return "Gender is required.";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Invalid email format.";
    if (!/^\d{10}$/.test(phone)) return "Phone number must be 10 digits.";
    if (password.length < 6) return "Password must be at least 6 characters long.";
    if (!department) return "Department is required.";
    if (!course.trim()) return "Course is required.";
    if (!batch.trim()) return "Batch is required.";
    if (!photo) return "Photo is required.";

    return null;
  };


  // Handle registration
  const handleRegistration = async (e) => {
    e.preventDefault();
    setIsLoading(true); 

    const error = validateInputs();
    if (error) {
      toast.warning(error);
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("full_name", userData.full_name);
    formData.append("dob", userData.dob);
    formData.append("gender", userData.gender);
    formData.append("email", userData.email);
    formData.append("phone", userData.phone);
    formData.append("password", userData.password);
    formData.append("department", userData.department);
    formData.append("course", userData.course);
    formData.append("batch", userData.batch);
    formData.append("role", userData.role);
    formData.append("photo", userData.photo);


    try {
      const response = await registerApi(formData);

      if (response.status === 200) {
        toast.success("OTP sent successfully.");
        setUserData({
          full_name: "",
          dob: "",
          gender: "",
          email: "",
          phone: "",
          password: "",
          department: "",
          course: "",
          batch: "",
          photo: null,
          role: "faculty",
        });
        navigate("/Otp", { state: { email: userData.email } });
      } else {
        toast.error("Registration failed! Please try again.");
      }
    } catch (error) {
      console.error(
        "Error during registration:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.error ||
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const departmentResponse = await departmentApi();
        if (departmentResponse.status === 200) {
          setDepartments(departmentResponse.data);
        } else {
          toast.error('Failed to fetch departments');
        }

        const courseResponse = await getCoursesApi();
        if (courseResponse.status === 200) {
          setCourses(courseResponse.data);
        } else {
          toast.error('Failed to fetch courses');
        }

        const batchResponse = await getBatchApi();
        if (batchResponse.status === 200) {
          setBatches(batchResponse.data);
        } else {
          toast.error('Failed to fetch batches');
        }

        const subjectResponse = await getSubjectApi();
        if (subjectResponse.status === 200) {
          setSubjects(subjectResponse.data);
        } else {
          toast.error('Failed to fetch subjects');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('An unexpected error occurred. Please try again.');
      }
    };

    fetchData();
  }, []);


  return (
    <div className="registration-page">
      <div className="registration-container">
        <div className="registration-card">
          <header className="registration-header">
            <h1>Faculty Registration</h1>
            <p>Enter faculty details to create a new account</p>
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>

              <div className="input-group">
                <label htmlFor="photo">Profile Image</label>
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  onChange={handleChange}
                  className="input-field"
                  disabled={isLoading}
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
                  disabled={isLoading}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.department_name}
                    </option>
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
                  disabled={isLoading}
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.course_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="batch">Batch</label>
                <select
                  id="batch"
                  name="batch"
                  value={userData.batch}
                  onChange={handleChange}
                  className="select-field"
                  disabled={isLoading}
                >
                  <option value="">Select Batch</option>
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.batch_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="subject">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  value={userData.subject}
                  onChange={handleChange}
                  className="select-field"
                  disabled={isLoading}
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>




            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"

                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Register Faculty'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default FacultyRegistration;
