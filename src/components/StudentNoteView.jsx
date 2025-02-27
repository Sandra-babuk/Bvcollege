import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import './StudentNote.css';
import { StudentApi } from '../services/allApi';

const StudentNoteView = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [courseId, setCourseId] = useState('');
  const [students, setStudents] = useState([]); // Store students
  const username = localStorage.getItem("username"); // Getting the username
  const token = JSON.parse(localStorage.getItem("loggedUser"))?.access; // Access token

  useEffect(() => {
    if (token) {
      getStudentDetails(token);
    } else {
      console.log("No access token found.");
    }
  }, []);

  const getStudentDetails = async (token) => {
    try {
      const response = await StudentApi(token); 
      console.log("Full API Response:", response);
  
      let studentsData = response.data.data || response.data; // Handle nested data
      console.log("Fetched Students Data (Full Object):", JSON.stringify(studentsData, null, 2));
  
      if (!Array.isArray(studentsData)) {
        console.error("Expected an array but received:", studentsData);
        return;
      }
  
      console.log("All Student IDs in API Response:", studentsData.map(s => s.id));
  
      if (studentsData.length > 0) {
        setStudents(studentsData);
      } else {
        console.log("No students found.");
        return;
      }
  
      // Compare username with full_name field
      const currentUser = studentsData.find(student => student.full_name === username);
      console.log("Current User:", currentUser);
  
      if (currentUser) {
        console.log("Current User Course ID:", currentUser.course);
        setCourseId(currentUser.course); // Set course ID if the user is found
      } else {
        console.log("Current user not found in student list.");
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  const handleViewNote = (noteId) => {
    // Find the note by ID and set it as the selected note
    const note = notes.find(note => note.id === noteId);
    setSelectedNote(note);
    setShowModal(true);
  };

  return (
    <Container className="note-view-container">
      <h2 className='note-view-title'>My Notes</h2>
      {loading ? (
        <p className="note-view-loading">Loading notes...</p>
      ) : notes.length === 0 ? (
        <p className="note-view-empty">No notes available for your course.</p>
      ) : (
        <Table striped bordered hover className="note-view-table">
          <thead>
            <tr>
              <th className="note-view-header">Title</th>
              <th className="note-view-header">Course</th>
              <th className="note-view-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => (
              <tr key={note.id} className="note-view-row">
                <td className="note-view-cell">{note.title}</td>
                <td className="note-view-cell">{note.course_name}</td>
                <td className="note-view-cell">
                  <Button 
                    variant='primary' 
                    onClick={() => handleViewNote(note.id)}
                    className="note-view-button"
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        className="note-view-modal"
      >
        <Modal.Header closeButton className="note-view-modal-header">
          <Modal.Title className="note-view-modal-title">Note Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="note-view-modal-body">
          {selectedNote ? (
            <>
              <h5 className="note-view-modal-subtitle">{selectedNote.title}</h5>
              <p className="note-view-modal-link">
                {selectedNote.fileUrl ? (
                  <a 
                    className="note-link" 
                    href={selectedNote.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Open PDF
                  </a>
                ) : (
                  <p className="note-info">No PDF available</p>
                )}
              </p>
            </>
          ) : (
            <p className="note-view-modal-loading">Loading...</p>
          )}
        </Modal.Body>
        <Modal.Footer className="note-view-modal-footer">
          <Button 
            variant='secondary' 
            onClick={() => setShowModal(false)}
            className="note-view-modal-button"
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </Container>
  );
};

export default StudentNoteView;
