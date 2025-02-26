import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Spinner, Row, Col } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { HodApi, deleteHodApi, departmentApi, editHodApi } from '../services/allApi';
import './viewHod.css';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const ViewHod = () => {

  const serverUrl = 'http://localhost:8000';


  const [hods, setHods] = useState([]);
  const [selectedHod, setSelectedHod] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [filteredHods, setFilteredHods] = useState([]); // Store filtered HODs
  const [filterDepartment, setFilterDepartment] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);




  const token = localStorage.getItem("access"); // Fetch the token from localStorage

  useEffect(() => {
    AllHods();
  }, []);

  const AllHods = async () => {
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }

    try {
      const response = await HodApi(token);
      console.log('Fetched HODs:', response.data);
      if (Array.isArray(response.data)) {
        setHods(response.data);
      } else {
        console.error('Expected an array but got:', response.data);
      }
    } catch (error) {
      console.error('Error fetching HODs:', error);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (!hods || hods.length === 0) return; // Ensure data exists

    let filteredList = hods; // Default: all HODs

    if (filterDepartment) {
      filteredList = hods.filter(hod => String(hod.department) === String(filterDepartment));
    }

    console.log('Filtered HODs:', filteredList);
    setFilteredHods(filteredList);
  }, [hods, filterDepartment]);



  useEffect(() => {
    AllHods();
    allDepartments();
    // allCourses();
    // allBatches();
  }, []);

  const allDepartments = async () => {
    try {
      const response = await departmentApi();
      if (Array.isArray(response.data)) {
        setDepartments(response.data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };



  const handleEdit = (hod) => {
    console.log(`Edit HOD with ID: ${hod.id}`);
    localStorage.setItem("selectedFacultyId", hod.id);
    setSelectedHod(hod);
    setShowModal(true);
  };

  const handleDelete = async (hodId) => {
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this HOD?");
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await deleteHodApi(hodId, token);
      console.log('Delete Response:', response); // Add this log to inspect the response

      if (response.status === 204) {
        console.log(`HOD with ID: ${hodId} deleted successfully`);
        setHods(hods.filter(hod => hod.id !== hodId)); // Update UI
        toast.success("HOD deleted successfully!");
      } else {
        console.error('Failed to delete HOD');
        toast.error("Failed to delete HOD.");
      }
    } catch (error) {
      console.error('Error deleting HOD:', error);
      toast.error("Error deleting HOD.");
    }
  };


  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo" && files.length > 0) {
      setSelectedHod((prevHod) => ({
        ...prevHod,
        photo: files[0], // Store file object
      }));
    } else {
      setSelectedHod((prevHod) => ({
        ...prevHod,
        [name]: value,
      }));
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("id", selectedHod.id);
    formData.append("full_name", selectedHod.full_name);
    formData.append("email", selectedHod.email);
    formData.append("phone", selectedHod.phone);
    formData.append("department", selectedHod.department);
    formData.append("dob", selectedHod.dob);
    formData.append("gender", selectedHod.gender);

    if (selectedHod.photo instanceof File) {
      formData.append("photo", selectedHod.photo); // Append only if it's a File
    }

    try {
      const response = await editHodApi(selectedHod.id, formData, token, true);
      console.log('API Response:', response);

      if (response.status === 200) {
        setHods(hods.map(hod => (hod.id === selectedHod.id ? response.data : hod)));
        setShowModal(false);
        setSelectedHod(null);
        toast.success("HOD details updated!");
      } else {
        toast.error("Failed to update HOD details.");
      }
    } catch (error) {
      console.error('Error during update:', error.response || error.message);
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="container">

      <Row className="justify-content-center">
        <Col lg={10}>
          <Form.Select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.department_name}</option>
            ))}

          </Form.Select>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col lg={10}>
          {isLoading ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" size="lg" />
            </div>
          ) : (
            <div className="p-4">
              <Table striped bordered hover responsive className="bg-white w-100">
                <thead>
                  <tr>
                    <th >#</th>
                    <th>id</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Department</th>
                    <th>Date of Birth</th>
                    <th>Gender</th>
                    <th>Photos</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHods.length > 0 ? (
                    filteredHods.map((hod, index) => (
                      <tr key={hod.id}>
                        <td>{index + 1}</td>
                        <td>{hod.hodId || hod.id}</td>
                        <td>{hod.full_name}</td>
                        <td>{hod.email}</td>
                        <td>{hod.phone}</td>
                        <td>{departments.find(dept => dept.id === hod.department)?.department_name || 'Unknown'}</td>
                        <td>{hod.dob}</td>
                        <td>{hod.gender}</td>
                        <td>
                          {hod.photo ? (
                            <img
                              src={`${serverUrl}${hod.photo}`}
                              alt={hod.full_name}
                              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                            />
                          ) : (
                            "No Photo"
                          )}
                        </td>
                        <td>
                          <Button variant="outline-primary" size="sm" onClick={() => handleEdit(hod)} className="me-2">
                            <FaEdit />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(hod.id)}
                            // disabled={}
                          >
                            {isDeleting ? <Spinner animation="border" size="sm" /> : <FaTrash />}
                          </Button>

                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">No HODs found.</td>
                    </tr>
                  )}
                </tbody>

              </Table>
            </div>
          )}
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit HOD Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Group>
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="text" name="full_name" value={selectedHod?.full_name || ""} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={selectedHod?.email || ""} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="number" name="phone" value={selectedHod?.phone || ""} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="department" className="mt-3">
              <Form.Label>Department</Form.Label>
              <Form.Select
                value={selectedHod?.department || ""}
                onChange={(e) => setSelectedHod({ ...selectedHod, department: e.target.value })}
              >

                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.department_name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control type="date" name="dob" value={selectedHod?.dob || ""} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Gender</Form.Label>
              <Form.Control type="text" name="gender" value={selectedHod?.gender || ""} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Current Photo</Form.Label>
              <div>
                {selectedHod?.preview ? (
                  <img
                    src={selectedHod.preview}  // Display the preview if a new image is selected
                    alt="Preview"
                    style={{ width: "80px", height: "80px", borderRadius: "50%", marginBottom: "10px" }}
                  />
                ) : selectedHod?.photo ? (
                  <img
                    src={selectedHod.photo instanceof File ? URL.createObjectURL(selectedHod.photo) : `${serverUrl}${selectedHod.photo}`}
                    alt="HOD"
                    style={{ width: "80px", height: "80px", borderRadius: "50%", marginBottom: "10px" }}
                  />
                ) : (
                  <p>No Photo</p>
                )}
              </div>
              <Form.Control type="file" name="photo" onChange={handleChange} />
            </Form.Group>


            <Button variant="primary" type="submit" className="mt-4 w-100" disabled={isSubmitting}>
              {isSubmitting ? <Spinner animation="border" size="sm" /> : "Update"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default ViewHod;
