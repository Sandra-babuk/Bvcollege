import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { upload_Studentnote, FacultyApi, getCoursesApi } from '../services/allApi';

const AddNote = ({ onNoteAdded }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [course, setCourse] = useState('');
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [facultyList, setFacultyList] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole || '');

    const fetchFacultyList = async () => {
      try {
        const facultyResponse = await FacultyApi();
        console.log(facultyResponse);

        if (facultyResponse.data.length > 0) {
          const currentUsername = localStorage.getItem('username'); // Assuming the username is saved in localStorage
          const matchedFaculty = facultyResponse.data.find(faculty => faculty.full_name === currentUsername);

          if (matchedFaculty) {
            const facultyId = matchedFaculty.id;
            localStorage.setItem('facultyId', facultyId); // Store in localStorage
            setUsername(matchedFaculty.username); // Set username to match the logged-in user
            setFacultyList(facultyResponse.data); // Set the list of all faculties
          } else {
            toast.error("Faculty not found for the current username.");
          }
        } else {
          toast.error("No faculty data available.");
        }
      } catch (error) {
        console.error('Error fetching faculty list:', error);
        toast.error("An error occurred while fetching faculty data.");
      }
    };


    const fetchCourses = async () => {
      const token = localStorage.getItem('access'); // Fix: Declare token before using it
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }
      try {
        const response = await getCoursesApi(token);
        if (response.status === 200) {
          setCourses(response.data);
        } else {
          toast.error("Failed to fetch courses.");
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error("An error occurred while fetching courses.");
      }
    };

    fetchFacultyList();
    fetchCourses();
  }, []);



  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    formData.append('course', course);
    formData.append(role === 'HOD' ? 'hod' : 'faculty', username);

    console.log("Form Data:");
    formData.forEach((value, key) => console.log(key, value));

    const token = localStorage.getItem('access');
    if (!token) {
      toast.error("Authentication failed. Please log in again.");
      return;
    }

    const reqHeader = { Authorization: `Bearer ${token}` };

    try {
      const response = await upload_Studentnote(formData, reqHeader);
      if (response.status === 201) {
        toast.success("Note uploaded successfully!");
        onNoteAdded && onNoteAdded();
        setTitle('');
        setFile(null);
        setCourse('');
        document.getElementById('fileInput').value = ""; // Clear file input
      } else {
        console.error("Error response:", response.data);
        toast.error("There was a problem adding the note. Please try again.");
      }
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
            id="fileInput"
            onChange={handleFileChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="course">
          <Form.Label>Course</Form.Label>
          <Form.Control
            as="select"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>{course.course_name}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="facultyId">
          <Form.Label>Faculty ID</Form.Label>
          <Form.Control type="text" value={localStorage.getItem('facultyId')} readOnly />
        </Form.Group>


        <Button className='my-2' variant="primary" type="submit">Upload</Button>
      </Form>
      <ToastContainer />
    </Container>
  );
};

export default AddNote;
