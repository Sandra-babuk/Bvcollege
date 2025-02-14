import React, { useState, useEffect } from 'react';
import { getSubjectApi, deleteSubjectApi, editSubjectApi, departmentApi, getCoursesApi } from '../services/allApi';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ViewSubject = () => {
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentSubject, setCurrentSubject] = useState({});
  const [courses, setCourses] = useState([]);
  const token = localStorage.getItem('access');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch subjects
        const response = await getSubjectApi(token, {});
        setSubjects(response.data);
  
        // Fetch departments
        const deptResponse = await departmentApi();
        setDepartments(deptResponse.data);
  
        // Fetch courses
        const courseResponse = await getCoursesApi();
        setCourses(courseResponse.data);
  
      } catch (err) {
        setError(err.message);
        toast.error(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [token]);
  

  const getDepartmentName = (deptId) => {
    const department = departments.find((dept) => dept.id === deptId);
    return department ? department.department_name : 'Unknown Department';
  };

  const getCourseName = (courseId) => {
    const course = courses.find((course) => course.id === courseId);
    return course ? course.course_name : 'Unknown Course';
  };

  const handleDelete = async (subjectId) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;

    try {
      const response = await deleteSubjectApi(token, subjectId);
      if (response.status === 204) {
        toast.success(`Subject deleted successfully`);
        setSubjects(subjects.filter(subject => subject.id !== subjectId));
      } else {
        toast.error('Failed to delete subject');
      }
    } catch (error) {
      toast.error(`Error deleting subject: ${error.message}`);
    }
  };

  const handleEdit = (subject) => {
    setCurrentSubject(subject);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveChanges = async () => {
    try {
      await editSubjectApi(currentSubject.id, currentSubject, token);
      setSubjects(subjects.map(subject => subject.id === currentSubject.id ? currentSubject : subject));
      toast.success('Subject updated successfully');
      setShowModal(false);
    } catch (error) {
      toast.error(`Error updating subject: ${error.message}`);
    }
  };

  const handleChange = (e) => {
    setCurrentSubject({ ...currentSubject, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <Container className="mt-4">
      <h2>Subjects List</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Course</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.length > 0 ? (
            subjects.map((subject) => (
              <tr key={subject.id}>
                <td>{subject.name}</td>
                <td>{getDepartmentName(subject.department)}</td>
                <td>{getCourseName(subject.course)}</td> {/* Use subject.course to get course ID */}
                <td>
                  <Button className="edit-btn" onClick={() => handleEdit(subject)}><FaEdit/></Button>
                  <Button className="delete-btn" onClick={() => handleDelete(subject.id)}><FaTrash/></Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No subjects found.</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Subject</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formSubjectName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={currentSubject.name || ''} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formSubjectDepartment">
              <Form.Label>Department</Form.Label>
              <Form.Control as="select" name="department" value={currentSubject.department || ''} onChange={handleChange}>
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.department_name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formSubjectCourse">
              <Form.Label>Course</Form.Label>
              <Form.Control as="select" name="course" value={currentSubject.course || ''} onChange={handleChange}>
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>{course.course_name}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          <Button variant="primary" onClick={handleSaveChanges}>Update</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ViewSubject;
