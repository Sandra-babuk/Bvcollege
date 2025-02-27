import React, { useState, useEffect } from "react";
import { getSubjectApi, deleteSubjectApi, editSubjectApi } from "../services/allApi"; // Adjust the import path
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

const ViewSubject = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingSubject, setEditingSubject] = useState(null);
    const [newSubjectData, setNewSubjectData] = useState({ name: "", department: "", course: "" });
    const token = localStorage.getItem("access");

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await getSubjectApi(token);
                console.log("API Response:", response.data); // Debugging API response
                
                // Ensure subjects is always an array
                setSubjects(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, [token]);

    const handleDelete = async (id) => {
        try {
            await deleteSubjectApi(token, id);
            setSubjects(subjects.filter(subject => subject.id !== id));
        } catch (err) {
            console.error("Error deleting subject:", err.message);
        }
    };

    const handleEdit = async (id) => {
        try {
            await editSubjectApi(id, newSubjectData, token);
            setSubjects(subjects.map(subject => 
                subject.id === id ? { ...subject, ...newSubjectData } : subject
            ));
            setEditingSubject(null);
            setNewSubjectData({ name: "", department: "", course: "" });
        } catch (err) {
            console.error("Error editing subject:", err.message);
        }
    };

    const openEditModal = (subject) => {
        setEditingSubject(subject.id);
        setNewSubjectData({ name: subject.name, department: subject.department, course: subject.course });
    };

    const closeEditModal = () => {
        setEditingSubject(null);
        setNewSubjectData({ name: "", department: "", course: "" });
    };

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
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.length > 0 ? (
                        subjects.map((subject) => (
                            <tr key={subject.id}>
                                <td>{subject.name}</td>
                                <td>{subject.department}</td>
                                <td>{subject.course}</td>
                                <td>
                                    <Button variant="outline-primary" size="sm" onClick={() => openEditModal(subject)}>
                                        <FaEdit />
                                    </Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(subject.id)}>
                                        <FaTrash />
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No subjects found.</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {editingSubject && (
                <Modal show={true} onHide={closeEditModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Subject</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={(e) => {
                            e.preventDefault();
                            handleEdit(editingSubject);
                        }}>
                            <Form.Group controlId="formSubjectName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newSubjectData.name}
                                    onChange={(e) => setNewSubjectData({ ...newSubjectData, name: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formSubjectDepartment">
                                <Form.Label>Department</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newSubjectData.department}
                                    onChange={(e) => setNewSubjectData({ ...newSubjectData, department: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formSubjectCourse">
                                <Form.Label>Course</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newSubjectData.course}
                                    onChange={(e) => setNewSubjectData({ ...newSubjectData, course: e.target.value })}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Save
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            )}
        </Container>
    );
};

export default ViewSubject;
