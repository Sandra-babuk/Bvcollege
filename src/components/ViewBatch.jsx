import React, { useEffect, useState } from 'react';
import { Container, Table, Alert } from 'react-bootstrap';
import { getBatchApi, getCoursesApi } from '../services/allApi';

const ViewBatch = () => {
    const [batches, setBatches] = useState([]);
    const [courses, setCourses] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [error, setError] = useState(null);

    useEffect(() => {
        allBatches();
        fetchCourses();
    }, [token]);

    const allBatches = async () => {
        try {
            const response = await getBatchApi(token);
            console.log(response.data);
            if (response?.data && Array.isArray(response.data)) {
                setBatches(response.data);
            } else {
                setError('Unexpected response format');
                console.error('Unexpected response format:', response);
            }
        } catch (error) {
            console.log("error fetching batches", error);
            setError('Failed to fetch batches. Please check your authorization token.');
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await getCoursesApi(token);
            if (response?.data && Array.isArray(response.data)) {
                setCourses(response.data);
            } else {
                setError('Unexpected response format');
                console.error('Unexpected response format:', response);
            }
        } catch (error) {
            console.log("error fetching courses", error);
            setError('Failed to fetch courses. Please check your authorization token.');
        }
    };

    const getCourseNameById = (id) => {
        const course = courses.find(course => course.id === id);
        return course ? course.course_name : 'Unknown Course';
    };

    return (
        <div>
            <Container className="mt-4">
                <h2>Batch List</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Batch Name</th>
                            <th>Course Name</th>
                            <th>Start Year</th>
                            <th>End Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        {batches.map((batch) => (
                            <tr key={batch.id}>
                                <td>{batch.id}</td>
                                <td>{batch.batch_name}</td>
                                <td>{getCourseNameById(batch.course)}</td>
                                <td>{batch.start_year}</td>
                                <td>{batch.end_year}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </div>
    );
};

export default ViewBatch;
