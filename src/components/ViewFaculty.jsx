import React, { useEffect, useState } from "react";
import { Table, Button, Container, Row, Col, Spinner, Modal, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FacultyApi, deleteFacultyApi, editFacultyApi } from "../services/allApi"; // Import the delete and edit APIs

function ViewFaculty() {
  const [facultyList, setFacultyList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("access"); // Fetch the token from localStorage

  // Fetch faculty data
  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const response = await FacultyApi();
        console.log("API Response:", response); 
        if (response.status === 200) {
          setFacultyList(response.data); 
        } else {
          toast.error("Failed to fetch faculty list. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching faculty data:", error); 
        toast.error("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacultyData();
  }, []);

  // Handle edit faculty details
  const handleEdit = (faculty) => {
    setSelectedFaculty(faculty);
    setShowModal(true);
  };

  // Handle delete faculty
  const handleDelete = async (facultyId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this faculty?");
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await deleteFacultyApi(facultyId, token);
      if (response.status === 204) {
        console.log(`Faculty with ID: ${facultyId} deleted successfully`);
        setFacultyList(facultyList.filter(faculty => faculty.id !== facultyId)); 
        toast.success("Faculty deleted successfully.");
      } else {
        console.error('Failed to delete faculty');
        toast.error("Failed to delete faculty. Please try again.");
      }
    } catch (error) {
      console.error('Error deleting faculty:', error);
      toast.error("An error occurred while deleting the faculty. Please try again.");
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedFaculty((prevFaculty) => ({
      ...prevFaculty,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const formData = new FormData();
    formData.append("full_name", selectedFaculty.full_name);
    formData.append("email", selectedFaculty.email);
    formData.append("phone", selectedFaculty.phone);
    formData.append("dob", selectedFaculty.dob);
    formData.append("gender", selectedFaculty.gender);
    formData.append("department", selectedFaculty.department);
    formData.append("role", selectedFaculty.role);
  
    try {
      const response = await editFacultyApi(selectedFaculty.id, formData, token);
      if (response.status === 200) {
        toast.success("Faculty details updated successfully!");
        setShowModal(false);
        setFacultyList(facultyList.map(faculty => faculty.id === selectedFaculty.id ? selectedFaculty : faculty));
      } else {
        toast.error("Failed to update faculty details. Please try again.");
      }
    } catch (error) {
      console.error("Error updating faculty details:", error);
  
      // Log the error response for debugging
      if (error.response && error.response.data) {
        console.error("API Error Response:", error.response.data);
        toast.error(error.response.data.message || "An unexpected error occurred. Please try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <h1 className="text-center mb-4">Faculty List</h1>
          
          {isLoading ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" size="lg" />
            </div>
          ) : (
            <Table striped bordered hover responsive className="bg-white shadow-sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Gender</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {facultyList.length > 0 ? (
                  facultyList.map((faculty, index) => (
                    <tr key={faculty.id}>
                      <td>{index + 1}</td>
                      <td>{faculty.full_name}</td>
                      <td>{faculty.email}</td>
                      <td>{faculty.phone}</td>
                      <td>{faculty.department}</td>
                      <td>{faculty.gender}</td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleEdit(faculty)}
                          className="me-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(faculty.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No faculty members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Faculty Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter full name"
                name="full_name"
                value={selectedFaculty?.full_name || ""}
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
                value={selectedFaculty?.email || ""}
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
                value={selectedFaculty?.phone || ""}
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
                value={selectedFaculty?.department || ""}
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
                value={selectedFaculty?.gender || ""}
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
}

export default ViewFaculty;
