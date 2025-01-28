import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addCourseApi } from '../services/allApi'; // Ensure this path is correct
// import "./addCourse.css"; // Ensure the CSS file exists in the specified path

const AddCourse = () => {
  const [courseData, setCourseData] = useState({
    course_name: "",
    description: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access'); // Retrieve the token from localStorage
    if (!token) {
      toast.error("You must be logged in to add a course.");
      return;
    }

    try {
      const response = await addCourseApi(courseData, token);
      if (response.status === 200) {
        toast.success("The course has been added successfully.");
        navigate("/view-courses");
      } else {
        toast.error("There was a problem adding the course. Please try again.");
      }
    } catch (error) {
      console.error("Error adding course:", error.response || error.message);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="add-course-container">
      <div className="main">
        <div className="form-container">
          <h1>Add Course</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="course_name">Course Name</label>
              <input
                type="text"
                id="course_name"
                name="course_name"
                placeholder="Enter course name"
                value={courseData.course_name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter course description"
                value={courseData.description}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="form-buttons">
              <button type="button" className="cancel" onClick={() => navigate('/view-courses')}>
                Cancel
              </button>
              <button type="submit" className="create">
                Add Course
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
