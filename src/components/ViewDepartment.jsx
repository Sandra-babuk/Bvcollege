import React, { useState, useEffect } from 'react';
import { getDepartmentsApi, getCoursesApi, editDeptApi, deleteDeptApi } from '../services/allApi';
import './viewdept.css';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import 'react-toastify/dist/ReactToastify.css';

const serverUrl = 'http://localhost:8000';

const ViewDepartment = () => {
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    AllDepartments();
    fetchCourses();
  }, []);

  const AllDepartments = async () => {
    const token = localStorage.getItem('access');
    if (!token) {
      toast.error('No token found');
      return;
    }
    try {
      const response = await getDepartmentsApi(token);
      if (response.status === 200) {
        setDepartments(response.data);
      } else {
        toast.error('Failed to fetch departments');
      }
    } catch (error) {
      toast.error('Error fetching departments:', error);
    }
  };

  const fetchCourses = async () => {
    const token = localStorage.getItem('access');
    if (!token) {
      toast.error('No token found');
      return;
    }
    try {
      const response = await getCoursesApi(token);
      if (response.status === 200) {
        setCourses(response.data);
      } else {
        toast.error('Failed to fetch courses');
      }
    } catch (error) {
      toast.error('Error fetching courses:', error);
    }
  };

  const handleCourseChangeMulti = (selectedOptions) => {
    const courseIds = selectedOptions.map(option => option.id);
    setSelectedDepartment(prevDept => ({
      ...prevDept,
      course_type: courseIds,
    }));
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setShowModal(true);
    setPhoto(null); // Reset photo state
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('access');
    if (!token) {
      toast.error('No token found');
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this department?");
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await deleteDeptApi(id, token);
      if (response.status === 200) {
        setDepartments(departments.filter(dept => dept.id !== id));
        setSelectedCourse(''); // Reset filter after deletion
        toast.success('Department deleted successfully');
      } else {
        toast.error('Failed to delete department');
      }
    } catch (error) {
      toast.error('Error deleting department:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedDepartment((prevDept) => ({
      ...prevDept,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    setSelectedDepartment((prevDept) => ({
      ...prevDept,
      photo: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem('access');
    const { id, department_name, description, course_type } = selectedDepartment;

    const formData = new FormData();
    formData.append('department_name', department_name);
    formData.append('description', description);
    formData.append('course_type', course_type);

    // Append the photo correctly if it exists
    if (photo) {
      formData.append('photo', photo);  // Ensure 'photo' is a file object here
    }

    try {
      const response = await editDeptApi(id, formData, token);
      if (response.status === 200) {
        setDepartments(departments.map(dept => dept.id === id ? response.data : dept));
        setShowModal(false);
        toast.success('Department updated successfully');
      } else {
        toast.error('Failed to update department');
      }
    } catch (error) {
      toast.error('Error updating department:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCourseNameById = (id) => {
    const course = courses.find(course => course.id === id);
    return course ? course.course_name : 'Unknown Course';
  };

  const filteredDepartments = selectedCourse
    ? departments.filter(department => Array.isArray(department.courses) && department.courses.includes(selectedCourse))
    : departments;

  return (
    <div className="view-department-container">
      <h1 className="title">Departments</h1>
      <div className="filter-container">
        <label htmlFor="course">Filter by Course: </label>
        <select id="course" name="course" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
          <option value="">All</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.course_name}
            </option>
          ))}
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDepartments.length > 0 ? (
            filteredDepartments.map((department, index) => (
              <tr key={department.id}>
                <td>{index + 1}</td>
                <td>
                  {department.photo && (
                    <img src={`${serverUrl}${department.photo}`} alt={`${department.department_name} photo`} className="department-photo" />
                  )}
                </td>
                <td>{department.department_name}</td>
                <td>{department.description}</td>
                <td>{Array.isArray(department.courses) && department.courses.length > 0 ? department.courses.map(courseId => getCourseNameById(courseId)).join(', ') : 'No courses available'}</td>
                <td>
                  <button onClick={() => handleEdit(department)}>
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(department.id)} className="delete-button">
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No departments found.</td>
            </tr>
          )}
        </tbody>
      </table>
      {selectedDepartment && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Department</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formDepartmentName">
                <Form.Label>Department Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter department name"
                  name="department_name"
                  value={selectedDepartment.department_name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </Form.Group>

              <Form.Group controlId="formDescription" className="mt-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter description"
                  name="description"
                  value={selectedDepartment.description}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </Form.Group>

              <Form.Group controlId="formCourses" className="mt-3">
                <Form.Label>Courses</Form.Label>
                <Select
                  isMulti
                  options={courses}
                  value={courses.filter(course =>
                    Array.isArray(selectedDepartment.course_type) &&
                    selectedDepartment.course_type.includes(course.id)
                  )}
                  getOptionLabel={option => option.course_name}
                  getOptionValue={option => option.id}
                  onChange={handleCourseChangeMulti}
                  isDisabled={isSubmitting}
                />
              </Form.Group>

              <Form.Group controlId="formPhoto" className="mt-3">
                <Form.Label>Photo</Form.Label>
                <Form.Control
                  type="file"
                  name="photo"
                  onChange={handlePhotoChange}
                  disabled={isSubmitting}
                />
                {photo ? (
                  <div className="mt-3">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="Selected"
                      style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
                    />
                  </div>
                ) : selectedDepartment.photo ? (
                  <div className="mt-3">
                    <img
                      src={`${serverUrl}${selectedDepartment.photo}`}
                      alt="Existing Department Photo"
                      style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
                    />
                  </div>
                ) : (
                  <div className="mt-3">No photo available</div>
                )}
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-4" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
      <ToastContainer />
    </div>
  );
};

export default ViewDepartment;
