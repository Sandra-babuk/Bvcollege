import React, { useEffect, useState } from 'react';
import './notes.css';
import pdf from '../assets/pdf.png';
import { MdOutlineSimCardDownload, MdDelete } from "react-icons/md"; // Import the delete icon
import { FaRegEye } from "react-icons/fa";
import { delete_Studentnote, get_notes } from '../services/allApi';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [role, setRole] = useState('');

  useEffect(() => {
    // Retrieve the role from local storage or API
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);

    // Fetch notes from the API
    const allNotes = async () => {
      try {
        const response = await get_notes(token)
        setNotes(response.data);
      } catch (err) {
        console.error('Error fetching notes:', err);
      }
    };

    allNotes();
  }, []);

  // Handler to delete a note
  const handleDelete = async (id) => {
    const token = localStorage.getItem('access');
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }

    try {
      const response = await delete_Studentnote(id, token);
      if (response.status === 200) {
        // Remove the deleted note from the state
        setNotes(notes.filter(note => note.id !== id));
        alert("Note deleted successfully!");
      } else {
        console.error("Error deleting note:", response.data);
      }
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  return (
    <div className='notes-container'>
      <div className="card-wrap p-2 gap-1">
        {notes.map(note => (
          <div className="note-card" key={note.id}>
            <div className='pdf'>
              <div><img src={pdf} style={{ width: '100px', height: '110px' }} alt="" /></div>
            </div>
            <div className='d-flex flex-column'>
              <h5>{note.title}</h5>
              <p>{note.description}</p>
              <div className='buttons d-flex'>
                <button className='save-note px-3 py-2'>save</button>
                {role === 'HOD' || role === 'faculty' ? (
                  <button
                    className='delete-note px-3 '
                    onClick={() => handleDelete(note.id)} // Add onClick handler for delete
                  >
                    <MdDelete className='w-100' />
                  </button>
                ) : (
                  <button className='view-note px-3 '><FaRegEye className='w-100' /></button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;
