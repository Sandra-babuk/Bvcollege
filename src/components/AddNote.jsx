import React, { useState } from 'react';
// import './addNote.css';

const AddNote = ({ onNoteAdded }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [course, setCourse] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder function for form submission
    console.log({
      title,
      file,
      course
    });
    onNoteAdded && onNoteAdded();
    setTitle('');
    setFile(null);
    setCourse('');
  };

  return (
    <div className="add-note-container">
      <h2>Upload Note</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="file">File</label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="course">Course</label>
          <input
            type="text"
            id="course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
          />
        </div>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default AddNote;
