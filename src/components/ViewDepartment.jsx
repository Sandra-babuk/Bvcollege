import React, { useState, useEffect } from 'react';
import { getDepartmentsApi, editDeptApi, deleteDeptApi } from '../services/allApi';
import './viewdept.css';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const serverUrl = 'http://localhost:8000';

const ViewDepartment = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedCourseType, setSelectedCourseType] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    AllDepartments();
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

  const handleCourseTypeChange = (e) => {
    setSelectedCourseType(e.target.value);
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setShowModal(true);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem('access');
    const { id, department_name, description, course_type } = selectedDepartment;

    try {
      const response = await editDeptApi(id, { department_name, description, course_type }, token);
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

  const filteredDepartments = selectedCourseType
    ? departments.filter(department => department.course_type === selectedCourseType)
    : departments;

  return (
    <div className="view-department-container">
      <h1 className="title">Departments</h1>
      <div className="filter-container">
        <label htmlFor="course_type">Filter by Course Type: </label>
        <select id="course_type" name="course_type" value={selectedCourseType} onChange={handleCourseTypeChange}>
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
                <td>{Array.isArray(department.courses) && department.courses.length > 0 ? department.courses.join(', ') : 'No courses available'}</td>
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
                <Form.Control type="text" placeholder="Enter department name" name="department_name" value={selectedDepartment.department_name} onChange={handleChange} disabled={isSubmitting} />
              </Form.Group>
              <Form.Group controlId="formDescription" className="mt-3">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="Enter description" name="description" value={selectedDepartment.description} onChange={handleChange} disabled={isSubmitting} />
              </Form.Group>
              <Form.Group controlId="formCourseType" className="mt-3">
                <Form.Label>Course Type</Form.Label>
                <Form.Control type="text" placeholder="Enter course type" name="course_type" value={selectedDepartment.course_type} onChange={handleChange} disabled={isSubmitting} />
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
