import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { addAssignmentApi, getBatchApi, FacultyApi, getSubjectApi, departmentApi, getCoursesApi } from '../services/allApi';

const AddAssignment = () => {
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [batch, setBatch] = useState('');
  const [deadline, setDeadline] = useState('');
  const [faculty, setFaculty] = useState('');
  const [sub, setSub] = useState('');
  const [department, setDepartment] = useState('');
  const [course, setCourse] = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [batches, setBatches] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);

  const [error, setError] = useState('');
  
  useEffect(() => {
    setFacultyId(localStorage.getItem('facultyId') || '');
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access');
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');

    console.log("Role:", role);
    console.log("Username:", username);

    const fetchData = async () => {
      try {
        const [batchRes, facultyRes, subjectRes, departmentRes, courseRes] = await Promise.all([
          getBatchApi(token),
          FacultyApi(token),
          getSubjectApi(token),
          departmentApi(token),
          getCoursesApi(token)
        ]);

        if (batchRes?.data) setBatches(batchRes.data);
        if (subjectRes?.data) setSubjects(subjectRes.data);
        if (departmentRes?.data) setDepartments(departmentRes.data);
        if (courseRes?.data) setCourses(courseRes.data);

        if (facultyRes?.data) {
          setFaculties(facultyRes.data);
          if (role?.toLowerCase() === 'faculty') {
            const loggedInFaculty = facultyRes.data.find(fac => fac.user === username);
            if (loggedInFaculty) setFaculty(loggedInFaculty.id);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError('Failed to fetch data. Please check your authorization token.');
      }
    };

    fetchData();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('access');

    if (!title || !sub || !faculty || !batch || !department || !course || !deadline) {
      toast.error("All fields are required!");
      return;
    }

    const assignmentData = {
      title,
      description,
      subject: sub,
      faculty,
      batch,
      department,
      course,
      deadline,
    };

    console.log('Submitting assignment data:', assignmentData);

    try {
      const response = await addAssignmentApi(token, assignmentData);
      
      if (response.status === 201) {
        toast.success('Assignment uploaded successfully!');
        navigate('/assignments'); 
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
        
        {/* Title */}
        <Form.Group controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </Form.Group>

        {/* Description */}
        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </Form.Group>

        {/* Batch */}
        <Form.Group controlId="batch">
          <Form.Label>Batch</Form.Label>
          <Form.Control as="select" value={batch} onChange={(e) => setBatch(e.target.value)} required>
            <option value="">Select a Batch</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>{b.batch_name}</option>
            ))}
          </Form.Control>
        </Form.Group>

        {/* Subject */}
        <Form.Group controlId="subject">
          <Form.Label>Subject</Form.Label>
          <Form.Control as="select" value={sub} onChange={(e) => setSub(e.target.value)} required>
            <option value="">Select a subject</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </Form.Control>
        </Form.Group>

        {/* Department */}
        <Form.Group controlId="department">
          <Form.Label>Department</Form.Label>
          <Form.Control as="select" value={department} onChange={(e) => setDepartment(e.target.value)} required>
            <option value="">Select a Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.department_name}</option>
            ))}
          </Form.Control>
        </Form.Group>

        {/* Course */}
        <Form.Group controlId="course">
          <Form.Label>Course</Form.Label>
          <Form.Control as="select" value={course} onChange={(e) => setCourse(e.target.value)} required>
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>{course.course_name}</option>
            ))}
          </Form.Control>
        </Form.Group>

        {/* Faculty ID */}
        <Form.Group controlId="facultyId">
          <Form.Label>Faculty ID</Form.Label>
          <Form.Control type="text" value={facultyId} readOnly />
        </Form.Group>

        {/* Deadline */}
        <Form.Group controlId="deadline">
          <Form.Label>Deadline</Form.Label>
          <Form.Control type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
        </Form.Group>

        {/* Submit Button */}
        <Button className="my-2" variant="primary" type="submit">Upload</Button>
      </Form>
      <ToastContainer />
    </Container>
  );
};

export default AddAssignment;
