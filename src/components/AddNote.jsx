import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { upload_Studentnote, HodApi, FacultyApi } from '../services/allApi';

const AddNote = ({ onNoteAdded }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [course, setCourse] = useState('');
  const [role, setRole] = useState('');
  const [selectedHod, setSelectedHod] = useState('');
  const [username, setUsername] = useState('');
  const [hodList, setHodList] = useState([]);
  const [facultyList, setFacultyList] = useState([]);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    const storedUsername = localStorage.getItem('username');
    setRole(storedRole);
    setUsername(storedUsername);

    const fetchLists = async () => {
      try {
        const hodResponse = await HodApi();
        const facultyResponse = await FacultyApi();
        setHodList(hodResponse.data);
        setFacultyList(facultyResponse.data);
      } catch (error) {
        console.error('Error fetching lists:', error);
      }
    };
    fetchLists();
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
    if (role === 'HOD') {
      formData.append('hod', selectedHod);
    } else {
      formData.append('faculty', username); // Append the username

    console.log("Form Data:");
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    const token = localStorage.getItem('access');
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }

    const reqHeader = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await upload_Studentnote(formData, reqHeader);
      if (response.status === 201) {
        toast.success("Note uploaded successfully!");
        onNoteAdded && onNoteAdded();
        setTitle('');
        setFile(null);
        setCourse('');
        setSelectedHod('');
      } else {
        console.error("Error response:", response.data);
        toast.error("There was a problem adding the note. Please try again.");
      }
    } catch (err) {
      console.error('Error uploading note:', err);
      console.log("Error response data:", err.response?.data); // Log the detailed error response
      toast.error("Error uploading note.");
    }
  };
}

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

        {/* Display the dropdown based on the role */}
        {role === 'HOD' ? (
          <Form.Group controlId="hod">
            <Form.Label>Select HOD</Form.Label>
            <Form.Control
              as="select"
              value={selectedHod}
              onChange={(e) => setSelectedHod(e.target.value)}
              required
            >
              <option value="">Select HOD</option>
              {hodList.map((hod) => (
                <option key={hod.id} value={hod.id}>
                  {hod.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        ) : (
          <Form.Group controlId="faculty">
            <Form.Label>Select Faculty</Form.Label>
            <Form.Control
              as="select"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            >
              <option value="">Select Faculty</option>
              {facultyList.map((faculty) => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.full_name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        )}

        <Button className='my-2' variant="primary" type="submit">Upload</Button>
      </Form>
      <ToastContainer />
    </Container>
  );
};

export default AddNote;

// department,batch
// permission to fetch batch to faculty