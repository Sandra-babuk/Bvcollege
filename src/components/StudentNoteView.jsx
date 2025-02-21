import React, { useState, useEffect } from 'react';
import { getStudentNotesByCourse, getNoteDetail, getCoursesApi } from '../services/allApi';
import { Container, Table, Button, Modal } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import './StudentNote.css';  // Add this import for the CSS

const StudentNoteView = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [courseId, setCourseId] = useState('');
  const [courses, setCourses] = useState([]);
  const token = localStorage.getItem('access');
  const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));

  useEffect(() => {
    if (loggedUser) {
      if (loggedUser.course) {
        setCourseId(loggedUser.course);
      } else {
        fetchCourseId(); // Fetch the course ID if not available in loggedUser
      }
    } else {
      toast.error("Logged user information not available.");
    }
  }, [loggedUser]);

  const fetchCourseId = async () => {
    try {
      const coursesResponse = await getCoursesApi(token);
      setCourses(coursesResponse.data);
      if (coursesResponse.data.length > 0) {
        const courseId = coursesResponse.data[0].id; 
        localStorage.setItem('course', courseId); 
        setCourseId(courseId);
      }
    } catch (error) {
      toast.error('Error fetching courses.');
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      if (!courseId || !token) {
        toast.error('Authentication failed or course ID not found.');
        return;
      }
      try {
        const response = await getStudentNotesByCourse(courseId, token);

        const notesWithDetails = response.map(note => ({
          ...note,
          facultyName: note.faculty_name || 'Unknown',
          courseName: note.course_name || 'Unknown',
          fileUrl: note.file ? `http://localhost:8000${note.file}` : null
        }));

        setNotes(notesWithDetails);
      } catch (error) {
        toast.error('Error fetching notes.');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchNotes();
  }, [courseId, token]);

  const handleViewNote = async (noteId) => {
    try {
      const noteDetail = await getNoteDetail(noteId, token);

      const noteWithDetails = {
        ...noteDetail,
        facultyName: noteDetail.faculty_name || 'Unknown',
        courseName: noteDetail.course_name || 'Unknown',
        fileUrl: noteDetail.file ? `http://localhost:8000${noteDetail.file}` : null
      };

      setSelectedNote(noteWithDetails);
      setShowModal(true);
    } catch (error) {
      toast.error('Error fetching note details.');
    }
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
                <td className="note-view-cell">
                  {courses.find(course => course.id === courseId)?.course_name || 'Unknown'}
                </td>
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
