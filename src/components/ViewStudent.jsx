import React, { useState, useEffect } from 'react';
import { StudentApi, deleteStudentApi, editStdApi } from '../services/allApi';
import './viewStudent.css';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Container, Row, Col, Spinner, Table } from 'react-bootstrap';
import { toast, ToastContainer } from "react-toastify";

const ViewStudent = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const token = localStorage.getItem('access');
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }

    try {
      const response = await StudentApi(token);
      console.log('Fetched students:', response.data);
      if (Array.isArray(response.data)) {
        setStudents(response.data);
      } else {
        console.error('Expected an array but got:', response.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleEdit = (student) => {
    console.log(`Edit student with ID: ${student.id}`);
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleDelete = async (studentId) => {
    const token = localStorage.getItem('access');
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this student?");
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await deleteStudentApi(studentId, token);
      if (response.status === 204) {
        console.log(`Student with ID: ${studentId} deleted successfully`);
        setStudents(students.filter(student => student.id !== studentId));
      } else {
        console.error('Failed to delete student');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedStudent((prevStudent) => ({
      ...prevStudent,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem("access");
    const formData = new FormData();
    formData.append("full_name", selectedStudent.full_name);
    formData.append("email", selectedStudent.email);
    formData.append("phone", selectedStudent.phone);
    formData.append("dob", selectedStudent.dob);
    formData.append("gender", selectedStudent.gender);
    formData.append("department", selectedStudent.department);
    formData.append("course", selectedStudent.course);
    formData.append("batch", selectedStudent.batch);
    formData.append("role", selectedStudent.role);

    try {
      const response = await editStdApi(selectedStudent.id, formData, token);
      if (response.status === 200) {
        toast.success("Student details updated successfully!");
        setShowModal(false);
        setStudents(students.map(student => student.id === selectedStudent.id ? selectedStudent : student));
      } else {
        toast.error("Failed to update student details. Please try again.");
      }
    } catch (error) {
      console.error("Error updating student details:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <h1 className="text-center mb-4">Students List</h1>
          <Table striped bordered hover responsive className="bg-white shadow-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date of Birth</th>
                <th>Gender</th>
                <th>Department</th>
                <th>Course</th>
                <th>Batch</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.full_name}</td>
                    <td>{student.email}</td>
                    <td>{student.phone}</td>
                    <td>{student.dob}</td>
                    <td>{student.gender}</td>
                    <td>{student.department}</td>
                    <td>{student.course}</td>
                    <td>{student.batch}</td>
                    <td>{student.role}</td>
                    <td className="student-actions">
                      <i
                        className="fa fa-edit edit-icon"
                        onClick={() => handleEdit(student)}
                      ></i>
                      <i
                        className="fa fa-trash delete-icon"
                        onClick={() => handleDelete(student.id)}
                      ></i>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11">No students found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Student Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter full name"
                name="full_name"
                value={selectedStudent?.full_name || ""}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={selectedStudent?.email || ""}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </Form.Group>

            <Form.Group controlId="formPhone" className="mt-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                name="phone"
                value={selectedStudent?.phone || ""}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </Form.Group>

            <Form.Group controlId="formDob" className="mt-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="dob"
                value={selectedStudent?.dob || ""}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </Form.Group>

            <Form.Group controlId="formGender" className="mt-3">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter gender"
                name="gender"
                value={selectedStudent?.gender || ""}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </Form.Group>

            <Form.Group controlId="formDepartment" className="mt-3">
              <Form.Label>Department</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter department"
                name="department"
                value={selectedStudent?.department || ""}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </Form.Group>

            <Form.Group controlId="formCourse" className="mt-3">
              <Form.Label>Course</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter course"
                name="course"
                value={selectedStudent?.course || ""}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </Form.Group>

            <Form.Group controlId="formBatch" className="mt-3">
              <Form.Label>Batch</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter batch"
                name="batch"
                value={selectedStudent?.batch || ""}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-4" disabled={isSubmitting}>
              {isSubmitting ? <Spinner animation="border" size="sm" /> : "Update"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </Container>
  );
};

export default ViewStudent;
