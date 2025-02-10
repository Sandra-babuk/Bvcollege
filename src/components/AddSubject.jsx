import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addSubjectApi, departmentApi, getCoursesApi } from '../services/allApi';

const AddSubject = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState(''); // State for description
  const [department, setDepartment] = useState('');
  const [course, setCourse] = useState('');
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]); // State for courses
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await departmentApi(token);
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await getCoursesApi(token);
        setCourses(response.data); // Ensure you're accessing response.data
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchDepartments();
    fetchCourses();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const subjectData = { name, description, department, course };
    try {
      const result = await addSubjectApi(token, subjectData);
      toast.success('Subject added successfully!');
      setName('');
      setDescription(''); // Reset description field
      setDepartment('');
      setCourse('');
    } catch (error) {
      console.error('Error adding subject:', error);
      toast.error('Error adding subject. Please try again.');
    }
  };

  return (
    <Container className="mt-4">
      <h2>Add New Subject</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Subject Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            required
          />
        </Form.Group>

        <Form.Group controlId="department">
          <Form.Label>Department</Form.Label>
          <select
            id="department"
            name="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="form-control"
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.department_name}</option>
            ))}
          </select>
        </Form.Group>

        <Form.Group controlId="course">
          <Form.Label>Course</Form.Label>
          <select
            id="course"
            name="course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="form-control"
            required
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>{course.course_name}</option>
            ))}
          </select>
        </Form.Group>

        <Button className='my-2' variant="primary" type="submit">Add Subject</Button>
      </Form>
      <ToastContainer />
    </Container>
  );
};

export default AddSubject;
