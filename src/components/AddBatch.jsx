import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import './addbatch.css'
import { addbatchApi, getCoursesApi } from "../services/allApi";
const AddBatch = () => {
  const [formData, setFormData] = useState({
    batch_name: "",
    course: "",
    start_year: "",
    end_year: "",
  });
  const [courses, setCourses] = useState([]); // Ensuring courses is always an array
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const allCourses = async () => {
      try {
        const response = await getCoursesApi()
        if (response.status === 200) {
          setCourses(response.data)

        } else {
          toast.error('Failed to get courses');

        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('An unexpected error occurred. Please try again.');

      }
    }
    allCourses()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.start_year > formData.end_year) {
      toast.error("Start year cannot be after end year.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await addbatchApi(formData);
      console.log(response.data);
      toast.success("Batch added successfully!");
      setFormData({ batch_name: "", course: "", start_year: "", end_year: "" });
    } catch (error) {
      toast.error("Failed to add batch. Please check the inputs.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-batch-container">
      <div className="add-batch-form">
        <h2>Add New Batch</h2>
        <ToastContainer />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Batch Name:</label>
            <input
              type="text"
              name="batch_name"
              value={formData.batch_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Course:</label>
            <select 
            name="course" 
            value={formData.course}
             onChange={handleChange} required>
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.course_name}
                </option>
              ))}
            </select>
          </div> 

          <div className="form-group">
            <label>Start Year:</label>
            <input type="number" name="start_year" value={formData.start_year} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>End Year:</label>
            <input type="number" name="end_year" value={formData.end_year} onChange={handleChange} required />
          </div>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Processing..." : "Add Batch"}
          </button>
        </form>
      </div>
    </div>
  );

};

export default AddBatch;
