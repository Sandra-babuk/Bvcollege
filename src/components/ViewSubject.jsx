import React, { useState, useEffect } from 'react';
import { getSubjectApi } from '../services/allApi'; // Adjust the import path
import { Container, Table } from 'react-bootstrap';

const ViewSubject = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('access');

  useEffect(() => {
    const SubData = async () => {
      try {
        const response = await getSubjectApi(token, {});
        console.log(response.data);
        setSubjects(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    SubData();
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container className="mt-4">
      <h2>Subjects List</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Course</th>
          </tr>
        </thead>
        <tbody>
          {subjects.length > 0 ? (
            subjects.map((subject) => (
              <tr key={subject.id}>
                <td>{subject.name}</td>
                <td>{subject.department}</td>
                <td>{subject.course}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No subjects found.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default ViewSubject;
