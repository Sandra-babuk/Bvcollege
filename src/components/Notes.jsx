import React, { useEffect, useState } from 'react';
import { getNotes } from '../services/allApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './notes.css';  // Add styles in this file

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [course, setCourse] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    const storedCourse = localStorage.getItem('course');

    if (storedRole) {
      setUserRole(storedRole);
    }

    if (storedCourse) {
      setCourse(storedCourse);
    }

    const fetchNotes = async () => {
      const token = localStorage.getItem('access');
      if (!token) {
        toast.error('Authentication error: Missing token.');
        return;
      }

      try {
        // Fetch all notes regardless of the user's role
        const notesData = await getNotes(token);

        console.log('Notes:', notesData);

        const notesWithDetails = notesData.map(note => ({
          ...note,
          facultyName: note.faculty_name || 'Unknown',
          courseName: note.course_name || 'Unknown',
          fileUrl: note.file ? `http://localhost:8000${note.file}` : null
        }));

        setNotes(notesWithDetails);
      } catch (error) {
        console.error('Error fetching notes:', error);
        toast.error('Failed to fetch notes.');
      }
    };

    fetchNotes();
  }, [course, userRole]);

  return (
    <div className="notes-page">
      <h1 className="notes-title">Notes Management</h1>
      <div className="notes-grid-container">
        {notes.map(note => (
          <div className="note-card" key={note.id}>
            <h3 className="note-title">{note.title}</h3>
            <p className="note-info">Subject: {note.subject}</p>
            <p className="note-info">Course: {note.course}</p>
            <p className="note-info">Faculty: {note.faculty}</p>
            {note.fileUrl ? (
              <a className="note-link" href={note.fileUrl} target="_blank" rel="noopener noreferrer">
                Open PDF
              </a>
            ) : (
              <p className="note-info">No PDF available</p>
            )}
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Notes;
