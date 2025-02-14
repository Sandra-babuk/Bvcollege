import React, { useEffect, useState } from 'react';
import './assign.css';
import { MdDelete } from "react-icons/md";
import { IoIosCloudUpload } from "react-icons/io";
import { FaEye, FaPen } from "react-icons/fa";
import { editAssignmentApi, FacultyApi, getAssignmentApi, getBatchApi, deleteAssignmentApi } from '../services/allApi';
import { Button, Modal, Spinner, Form } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';

const AssignmentStd = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fileAdded, setFileAdded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [batches, setBatches] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [error, setError] = useState(null);
  //   const [expandedIndex, setExpandedIndex] = useState(null);

  // const showDescription = (index) => {
  //   setExpandedIndex(expandedIndex === index ? null : index);
  // };
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('')

  const handleShowModal = (title, description) => {
    setSelectedTitle(title)
    setSelectedDescription(description);
    setShowDescriptionModal(true);
  };

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);

    const getBatches = async () => {
      try {
        const response = await getBatchApi(token);
        if (response?.data && Array.isArray(response.data)) {
          setBatches(response.data);
        } else {
          setError('Unexpected response format');
          console.error('Unexpected response format:', response);
        }
      } catch (error) {
        console.log('Error fetching batches:', error);
        setError("Error fetching batches");
      }
    };
    getBatches();
  }, [token]);

  useEffect(() => {
    const allFaculties = async () => {
      try {
        const response = await FacultyApi(token);
        if (response?.data && Array.isArray(response.data)) {
          setFaculties(response.data);
        } else {
          setError('Unexpected response format for faculties');
          console.error('Unexpected response format:', response);
        }
      } catch (error) {
        console.error("Error fetching faculty data:", error);
        toast.error("An error occurred.");
      }
    };
    allFaculties();
  }, [token]);

  useEffect(() => {
    const allAssignments = async () => {
      try {
        const response = await getAssignmentApi(token);
        if (response?.data && Array.isArray(response.data)) {
          setAssignments(response.data);
        } else {
          setError('Unexpected response format');
        }
      } catch (error) {
        setError('Failed to fetch assignments. Please check your authorization token.');
      }
    };
    allAssignments();
  }, [token]);

  const handleUpload = (file) => {
    if (file) {
      setFileAdded(true);
    }
  };

  const handleEdit = (A) => {
    setSelectedAssignment(A);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedAssignment((prevA) => ({
      ...prevA,
      [name]: name === "batch" || name === "faculty" ? parseInt(value, 10) : value,
    }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;

    try {
      const response = await deleteAssignmentApi(id, token);
      if (response.status === 204) {
        toast.success("Assignment deleted successfully!");
        setAssignments(assignments.filter(A => A.id !== id));
      } else {
        toast.error("Failed to delete assignment. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting assignment:", error);
      toast.error("An error occurred while deleting. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title", selectedAssignment.title);
    formData.append("description", selectedAssignment.description);
    formData.append("faculty", selectedAssignment.faculty);
    formData.append("deadline", selectedAssignment.deadline);
    formData.append("batch", selectedAssignment.batch);

    console.log("Submitting assignment data:", Object.fromEntries(formData.entries()));

    try {
      const response = await editAssignmentApi(selectedAssignment.id, formData, token);
      if (response.status === 200) {
        toast.success("Assignment details updated successfully!");
        setShowModal(false);
        setAssignments(assignments.map(A => A.id === selectedAssignment.id ? selectedAssignment : A));
      } else {
        toast.error("Failed to update assignment details. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="assignment-container">
        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>SI No</th>
                <th>Subject</th>
                <th>Topic</th>
                <th>Description</th>
                <th>Deadline</th>
                <th>Action</th>
                <th>Remove</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((A, index) => (
                <tr key={A.id}>
                  <td>{index + 1}</td>
                  <td>OOPs</td>
                  <td>{A.title}</td>
                  <td>
                    <a href="#" onClick={(e) => { e.preventDefault(); handleShowModal(A.title, A.description); }}>
                      Check details
                    </a>
                  </td>
                  <td>{A.deadline}</td>
                  <td>
                    {role === 'student' ? (
                      <>
                        <button
                          className={`action-btn upload-btn ${fileAdded ? 'added' : ''}`}
                          onClick={() => document.getElementById('fileInput').click()}
                        >
                          <IoIosCloudUpload className="icon" /> {fileAdded ? 'Added' : 'Upload'}
                        </button>
                        <input
                          type="file"
                          id="fileInput"
                          style={{ display: 'none' }}
                          onChange={(e) => handleUpload(e.target.files[0])}
                        />
                      </>
                    ) : (
                      <button className="action-btn view-btn">
                        <FaEye className="icon" /> View Submissions
                      </button>
                    )}
                  </td>
                  <td>
                    {(role === 'hod' || role === 'faculty') && (
                      <button className="action-btn delete-btn" onClick={() => handleDelete(A.id)}>
                        <MdDelete className="icon" /> Delete
                      </button>
                    )}
                  </td>

                  <td>
                    {(role === 'hod' || role === 'faculty') && (
                      <button className="action-btn edit-btn" onClick={() => handleEdit(A)}>
                        <FaPen className="icon" />
                      </button>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Assignment Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={selectedAssignment?.title || ""}
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
        {/* Description Modal */}
        <Modal show={showDescriptionModal} onHide={() => setShowDescriptionModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Assignment Details</Modal.Title>
          </Modal.Header>

          <Modal.Body className='description '>
            <h2 className='text-center'>{selectedTitle}</h2>

            <p>{selectedDescription}</p>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDescriptionModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <ToastContainer />
      </div >
    </>
  );
};

export default AssignmentStd;
