import React, { useEffect, useState } from 'react';
import { getAssignmentsByBatch, getBatchApi, createSubmissionApi } from '../services/allApi';
import { Button, Modal } from 'react-bootstrap';
import { toast,ToastContainer } from 'react-toastify';
import { FaUpload } from "react-icons/fa";
import './assignstd.css';

const AssignmentStd = () => {
  const [assignments, setAssignments] = useState([]);
  const [batchId, setBatchId] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedDescription, setSelectedDescription] = useState('');
  const [file, setFile] = useState(null);
  const [submittedAssignments, setSubmittedAssignments] = useState({});
  
  const token = localStorage.getItem('access');
  const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));

  useEffect(() => {
    if (loggedUser) {
      if (loggedUser.batch_id) {
        setBatchId(loggedUser.batch_id);
      } else {
        fetchBatchId();
      }
    } else {
      toast.error("Logged user information not available.");
    }
  }, [loggedUser]);

  const fetchBatchId = async () => {
    try {
      const batchResponse = await getBatchApi(token);
      const batchId = batchResponse.data[0].id;
      localStorage.setItem('batch', batchId);
      setBatchId(batchId);
    } catch (error) {
      toast.error('Error fetching batch.');
    }
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!batchId || !token) {
        toast.error('Authentication failed or batch ID not found.');
        return;
      }
      try {
        const response = await getAssignmentsByBatch(token, batchId);
        setAssignments(response.data);
      } catch (error) {
        toast.error('Error fetching assignments.');
      } finally {
        setLoading(false);
      }
    };

    if (batchId) fetchAssignments();
  }, [batchId, token]);

  const handleShowModal = (title, description) => {
    setSelectedTitle(title);
    setSelectedDescription(description);
    setShowDescriptionModal(true);
  };

  const handleFileChange = (event, assignmentId) => {
    setFile({ assignmentId, file: event.target.files[0] });
  };

  const handleFileUpload = async (assignmentId) => {
    if (!file || file.assignmentId !== assignmentId) {
      toast.error("Please select a file first.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file.file);
    formData.append("student_id", loggedUser.id); // Include student ID in the form data
    formData.append("submitted_at", new Date().toISOString()); // Store submission date
  
    try {
      const response = await createSubmissionApi(token, assignmentId, formData);
  
      if (response.status === 201) {
        toast.success("Assignment submitted successfully!");
        setSubmittedAssignments((prev) => ({
          ...prev,
          [assignmentId]: {
            student_id: loggedUser.id,
            student_name: loggedUser.name, // Include student name from loggedUser
            submitted_at: new Date().toISOString(),
          },
        }));
      } else {
        toast.error("Failed to submit assignment.");
      }
    } catch (error) {
      toast.error("Error submitting assignment.");
    }
  };
  

  return (
    <div className="assignment-container">
      <h2 className="assignments-title">My Assignments</h2>
      {loading ? (
        <p className="assignments-loading">Loading assignments...</p>
      ) : assignments.length === 0 ? (
        <p className="assignments-empty">No assignments available for your batch.</p>
      ) : (
        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>SI No</th>
                <th>Title</th>
                <th>Due Date</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment, index) => (
                <tr key={assignment.id}>
                  <td>{index + 1}</td>
                  <td>{assignment.title}</td>
                  <td>{assignment.deadline}</td>
                  <td>
                    <a href="#" onClick={(e) => { e.preventDefault(); handleShowModal(assignment.title, assignment.description); }}>
                      Check details
                    </a>
                  </td>
                  <td>
                    {submittedAssignments[assignment.id] ? (
                      <Button className="submitted-btn ms-2" disabled>Submitted</Button>
                    ) : (
                      <>
                        <input 
                          type="file" 
                          onChange={(e) => handleFileChange(e, assignment.id)}
                        />
                        <Button 
                          className="action-btn upload-btn ms-2" 
                          onClick={() => handleFileUpload(assignment.id)}
                        >
                          <FaUpload className="icon" /> Upload
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <Modal show={showDescriptionModal} onHide={() => setShowDescriptionModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Assignment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className='description'>
          <h2 className='text-center'>{selectedTitle}</h2>
          <p>{selectedDescription}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDescriptionModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer/>
      
    </div>
  );
};

export default AssignmentStd;
