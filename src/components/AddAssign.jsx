import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { addAssignmentApi, getBatchApi, FacultyApi, HodApi, getSubjectApi } from '../services/allApi';

const AddAssignment = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [batch, setBatch] = useState('');
  const [deadline, setDeadline] = useState('');
  const [batches, setBatches] = useState([]);
  const [faculty, setFaculty] = useState('');
  const [hod, setHod] = useState('');
  const [faculties, setFaculties] = useState([]);
  const [hods, setHods] = useState([]);
  const [sub, setSub] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [token, setToken] = useState(localStorage.getItem('access'));
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    console.log("Role:", role);
    console.log("Username:", localStorage.getItem('username'));

    const fetchData = async () => {
      try {
        const [batchResponse, facultyResponse, hodResponse, subjectResponse] = await Promise.all([
          getBatchApi(token),
          FacultyApi(token),
          HodApi(token),
          getSubjectApi(token)
        ]);

        if (batchResponse?.data && Array.isArray(batchResponse.data)) {
          setBatches(batchResponse.data);
        } else {
          setError('Unexpected response format for batches');
          console.error('Unexpected response format:', batchResponse);
        }

        if (subjectResponse?.data && Array.isArray(subjectResponse.data)) {
          setSubjects(subjectResponse.data);
        } else {
          setError('Unexpected response format for subjects');
          console.error('Unexpected response format:', subjectResponse);
        }

        if (facultyResponse?.data && Array.isArray(facultyResponse.data)) {
          setFaculties(facultyResponse.data);
          if (role?.toLowerCase() === 'faculty') {
            const loggedInFaculty = facultyResponse.data.find(faculty => faculty.user === localStorage.getItem('username'));
            if (loggedInFaculty) {
              setFaculty(loggedInFaculty.id);
            }
          }
        } else {
          setError('Unexpected response format for faculties');
          console.error('Unexpected response format:', facultyResponse);
        }

        if (hodResponse?.data && Array.isArray(hodResponse.data)) {
          setHods(hodResponse.data);
        } else {
          setError('Unexpected response format for HODs');
          console.error('Unexpected response format:', hodResponse);
        }
      } catch (error) {
        console.log("Error fetching data", error);
        setError('Failed to fetch data. Please check your authorization token.');
      }
    };

    fetchData();
  }, [token, role]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const assignmentData = {
      title,
      description,
      subject: sub, // Update the field name to match backend expectations
      faculty,
      hod,
      batch,
      deadline,
    };

    console.log('Submitting assignment data:', assignmentData);

    try {
      const response = await addAssignmentApi(token, assignmentData);
      console.log(response);

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

        <Form.Group controlId="subject">
          <Form.Label>Subject</Form.Label>
          <Form.Control
            as="select"
            value={sub}
            onChange={(e) => setSub(e.target.value)}
            required
          >
            <option value="">Select a subject</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {role?.toLowerCase() === "hod" && (
          <>
            <Form.Group controlId="hod">
              <Form.Label>Select HOD</Form.Label>
              <Form.Control
                as="select"
                value={hod}
                onChange={(e) => setHod(e.target.value)}
                required
              >
                <option value="">Select HOD</option>
                {hods.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.full_name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </>
        )}

        {role?.toLowerCase() === "faculty" && (
          <>
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
                    {f.full_name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </>
        )}

        <Form.Group controlId="deadline">
          <Form.Label>Deadline</Form.Label>
          <Form.Control
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
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

export default AddAssignment;
