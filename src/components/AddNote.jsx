import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { upload_Studentnote } from '../services/allApi'; 

const AddNote = ({ onNoteAdded }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [course, setCourse] = useState('');
  const [facultyId, setFacultyId] = useState('');

  useEffect(() => {
    // Retrieve the faculty ID from localStorage
    const id = localStorage.getItem('facultyId');
    if (id) {
      setFacultyId(id);
    } else {
      console.error('No faculty ID found in localStorage');
    }
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
    formData.append('faculty', facultyId); // Append the faculty ID to the form data

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
      onNoteAdded && onNoteAdded();
      setTitle('');
      setFile(null);
      setCourse('');
    } catch (err) {
      console.error('Error uploading note:', err);
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
        <Button className='my-2' variant="primary" type="submit">Upload</Button>
      </Form>
    </Container>
  );
};

export default AddNote;
