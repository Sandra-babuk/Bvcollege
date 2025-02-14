import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
// import "./addDepartment.css";
import { addDepartmentApi } from "../services/allApi";

const AddDepartment = () => {
  const [departmentData, setDepartmentData] = useState({
    department_name: "",
    description: "",
    courses: "",
    photo: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartmentData({ ...departmentData, [name]: value });
  };

  const handleFileChange = (e) => {
    setDepartmentData({ ...departmentData, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem('access');
    if (!token) {
      toast.error("You must be logged in to add a department.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    for (const key in departmentData) {
      formData.append(key, departmentData[key]);
    }

    try {
      const response = await addDepartmentApi(formData, token);
      if (response.status === 200) {
        toast.success("The department has been added successfully.");
        setDepartmentData({
          department_name: "",
          description: "",
          courses: "",
          photo: null,
        });
      } else {
        toast.error("There was a problem adding the department. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registration-page">
      <div className="registration-container">
        <div className="registration-card">
          <header className="registration-header">
            <h1>Add Department</h1>
            <p>Enter department details to create a new entry</p>
          </header>

          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-grid ">
              <div className="input-group">
                <label htmlFor="department_name">Department Name</label>
                <input
                  type="text"
                  id="department_name"
                  name="department_name"
                  placeholder="Enter department name"
                  value={departmentData.department_name}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <label htmlFor="courses">Course Type</label>
                <select
                  id="courses"
                  name="courses"
                  value={departmentData.courses}
                  onChange={handleChange}
                  className="select-field"
                >
                  <option value="">Select Course Type</option>
                  <option value="2">B.Tech</option>
                  <option value="3">M.Tech</option>
                </select>
              </div>

              <div className="input-group full-width">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter department description"
                  value={departmentData.description}
                  onChange={handleChange}
                  className="input-field"
                ></textarea>
              </div>

              <div className="input-group">
                <label htmlFor="photo">Photo</label>
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  onChange={handleFileChange}
                  className="input-field"
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Add Department'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddDepartment;
