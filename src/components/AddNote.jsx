import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { upload_Studentnote } from '../services/allApi'; 

const AddNote = ({ onNoteAdded }) => {
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [file, setFile] = useState(null);
  const [course, setCourse] = useState('');
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    // Retrieve the role and username from localStorage or API
    const storedRole = localStorage.getItem('role');
    const storedUsername = localStorage.getItem('username');
    setRole(storedRole);
    setUsername(storedUsername);
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    formData.append('course', course);
    formData.append('user', userId); // Append the user ID (either faculty or HOD)

    // Retrieve the token from localStorage
    const token = localStorage.getItem('access');
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }

    const reqHeader = {
      Authorization: `Bearer ${token}`, 
    };

    try {
      await upload_Studentnote(formData, reqHeader);
      toast.success("Note uploaded successfully!");
      onNoteAdded && onNoteAdded();
      setTitle('');
      setFile(null);
      setCourse('');
    } catch (err) {
      console.error('Error uploading note:', err);
      toast.error("Error uploading note.");
    }
  };

  return (
    <Container className="add-note-container">
      <h2>Upload Note</h2>
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
        <Form.Group controlId="file">
          <Form.Label>File</Form.Label>
          <Form.Control
            type="file"
            onChange={handleFileChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="course">
          <Form.Label>Course</Form.Label>
          <Form.Control
            type="text"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
          />
        </Form.Group>

        {/* Display the correct ID based on the role */}
        <Form.Group controlId="username">
          <Form.Label>{role === "HOD" ? "HOD Username" : "Faculty Username"}</Form.Label>
          <Form.Control
            type="text"
            value={username}
            readOnly
          />
        </Form.Group>

        <Button className='my-2' variant="primary" type="submit">Upload</Button>
      </Form>
      <ToastContainer />
    </Container>
  );
};

export default AddNote;
