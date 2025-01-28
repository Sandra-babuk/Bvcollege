import React, { useState, useEffect } from 'react';
import { getDepartmentsApi } from '../services/allApi';
import './viewdept.css'; // Ensure the CSS file exists in the specified path

const serverUrl = 'http://localhost:8000'; // Update with your server URL

const ViewDepartment = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedCourseType, setSelectedCourseType] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    const token = localStorage.getItem('access');
    if (!token) {
      console.log('No token found');
      return;
    }
    try {
      const response = await getDepartmentsApi(token);
      console.log('Fetched departments:', response.data);
      if (response.status === 200) {
        setDepartments(response.data);
      } else {
        console.error('Failed to fetch departments');
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleCourseTypeChange = (e) => {
    setSelectedCourseType(e.target.value);
  };

  const filteredDepartments = selectedCourseType
    ? departments.filter(department => department.course_type === selectedCourseType)
    : departments;

  return (
    <div className="view-department-container">
      <h1 className="title">Departments</h1>
      <div className="filter-container">
        <label htmlFor="course_type">Filter by Course Type: </label>
        <select
          id="course_type"
          name="course_type"
          value={selectedCourseType}
          onChange={handleCourseTypeChange}
        >
          <option value="">All</option>
          <option value="B.Tech">B.Tech</option>
          <option value="M.Tech">M.Tech</option>
        </select>
      </div>
      <table className="department-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Department Name</th>
            <th>Description</th>
            <th>Courses</th>
          </tr>
        </thead>
        <tbody>
          {filteredDepartments.length > 0 ? (
            filteredDepartments.map((department) => (
              <tr key={department.id}>
                <td>{department.id}</td>
                <td>
                  {department.photo && (
                    <img
                      src={`${serverUrl}${department.photo}`}
                      alt={`${department.department_name} photo`}
                      className="department-photo"
                    />
                  )}
                </td>
                <td>{department.department_name}</td>
                <td>{department.description}</td>
                <td>
                  {Array.isArray(department.courses) && department.courses.length > 0
                    ? department.courses.join(', ')
                    : 'No courses available'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No departments found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewDepartment;
