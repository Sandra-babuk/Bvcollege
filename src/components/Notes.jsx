import React, { useEffect, useState } from 'react';
import { getNotes } from '../services/allApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notes = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem('access');
      if (!token) {
        toast.error('Authentication error: Missing token.');
        return;
      }

      try {
        const notesData = await getNotes(token);
        console.log('notesData:', notesData);
        
        setNotes(notesData);
      } catch (error) {
        console.error('Error fetching notes:', error);
        toast.error('Failed to fetch notes.');
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className="notes-container">
      <h2>Notes</h2>
      <ul>
        {notes.map(note => (
          <li key={note.id}>
            <h3>{note.title}</h3>
            <p>Course: {note.course}</p>
            <p>Faculty: {note.faculty}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notes;
