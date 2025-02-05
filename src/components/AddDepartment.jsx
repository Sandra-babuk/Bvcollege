import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./addDepartment.css"; 
import { addDepartmentApi } from "../services/allApi";

const AddDepartment = () => {
  const [departmentData, setDepartmentData] = useState({
    department_name: "",
    description: "",
    courses: "",
    photo: null,
  });
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
    const token = localStorage.getItem('access'); 
    if (!token) {
      toast.error("You must be logged in to add a department.");
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
      } else {
        console.error("Error response:", response.data);
        toast.error("There was a problem adding the department. Please try again.");
      }
    } catch (error) {
      console.error("Error adding department:", error.response || error.message);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="add-department-container">
      <div className="main">
        <div className="form-container">
          <h1>Add Department</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="department_name">Department Name</label>
              <input
                type="text"
                id="department_name"
                name="department_name"
                placeholder="Enter department name"
                value={departmentData.department_name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter department description"
                value={departmentData.description}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="courses">Course Type</label>
              <select
                id="courses"
                name="courses"
                value={departmentData.courses}
                onChange={handleChange}
              >
                <option value="">Select Course Type</option>
                <option value="2">B.Tech</option>
                <option value="3">M.Tech</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="photo">Photo</label>
              <input
                type="file"
                id="photo"
                name="photo"
                onChange={handleFileChange}
              />
            </div>
            <div className="form-buttons">
              <button type="button" className="cancel">
                Cancel
              </button>
              <button type="submit" className="create">
                Add Department
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
