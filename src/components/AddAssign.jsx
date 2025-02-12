import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { addAssignmentApi, getBatchApi, facultyApi, FacultyApi } from '../services/allAPI';

const AddAssignment = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [batch, setBatch] = useState('');
  const [deadline, setDeadline] = useState('');
  const [batches, setBatches] = useState([]);
  const [faculty, setFaculty] = useState('');
  const [faculties, setFaculties] = useState([]);
  const [role, setRole] = useState('');
  const [token, setToken] = useState(localStorage.getItem('access'));
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Role:", localStorage.getItem("role"));
    console.log("Username:", localStorage.getItem('username'));

    const fetchData = async () => {
      try {
        const [batchResponse, facultyResponse] = await Promise.all([
          getBatchApi(token),
          FacultyApi(token) // Add API call to fetch faculty data
        ]);

        if (batchResponse?.data && Array.isArray(batchResponse.data)) {
          setBatches(batchResponse.data);
        } else {
          setError('Unexpected response format for batches');
          console.error('Unexpected response format:', batchResponse);
        }

        if (facultyResponse?.data && Array.isArray(facultyResponse.data)) {
          setFaculties(facultyResponse.data);
        } else {
          setError('Unexpected response format for faculties');
          console.error('Unexpected response format:', facultyResponse);
        }
      } catch (error) {
        console.log("Error fetching batches and faculties", error);
        setError('Failed to fetch batches or faculties. Please check your authorization token.');
      }
    };

    fetchData();
    setRole(localStorage.getItem("role") || "");
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const assignmentData = {
      title,
      description,
      faculty,  // Use faculty ID
      batch,
      deadline,
    };

    try {
      const response = await addAssignmentApi(token, assignmentData);
      console.log(response.data);

      if (response.status === 201) {
        toast.success('Assignment uploaded successfully!');
      } else {
        toast.error('Failed to upload assignment');
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
      toast.error('Something went wrong!');
    }
  };

  return (
    <Container className="add-note-container">
      <h2>Upload Assignment Topic</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>

        {role?.toLowerCase() === "hod" && (
          <Form.Group controlId="batch">
            <Form.Label>Batch</Form.Label>
            <Form.Control
              as="select"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              required
            >
              <option value="">Select a Batch</option>
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.batch_name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        )}

        {role?.toLowerCase() === "hod" && (
          <Form.Group controlId="faculty">
            <Form.Label>Select Faculty</Form.Label>
            <Form.Control
              as="select"
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
              required
            >
              <option value="">Select Faculty</option>
              {faculties.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.full_name}  {/* Display faculty usernames */}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        )}

        <Form.Group controlId="deadline">
          <Form.Label>Deadline</Form.Label>
          <Form.Control
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </Form.Group>

        <Button className="my-2" variant="primary" type="submit">
          Upload
        </Button>
      </Form>
      <ToastContainer />
    </Container>
  );
};

export default AddAssignment;
