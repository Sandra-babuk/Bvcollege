import React, { useState, useEffect } from 'react';
import { Container, Table, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getCoursesApi } from '../services/allApi';

const ViewCourse = () => {
  const [courses, setCourses] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
        try {
          const response = await getCoursesApi(token);
          console.log('Fetched response:', response); // Log full response
          if (response?.data && Array.isArray(response.data)) {
            setCourses(response.data);
          } else {
            setError('Unexpected response format');
            console.error('Unexpected response format:', response);
          }
        } catch (error) {
          console.error('Error fetching courses:', error);
          setError('Failed to fetch courses. Please check your authorization token.');
        }
      };
      

    fetchCourses();
  }, [token]);

  return (
    <Container className="mt-4">
      <h2>Courses List</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Course Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.id}</td>
              <td>{course.course_name}</td>
              <td>{course.description}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ViewCourse;
