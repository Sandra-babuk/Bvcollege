import React, { useState } from 'react';
import { uploadExamResultApi } from '../services/allApi';
import { toast, ToastContainer } from 'react-toastify';

const ExamResult = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const token = localStorage.getItem('access');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Ensure it's a single file
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!file) {
      toast.error('No file selected');
      return;
    }
  
    try {
      const response = await uploadExamResultApi(token, title, file);
      console.log(response);
      
      if (response.status === 201) {
        toast.success('Exam result uploaded successfully');
        
        // Check if the file is a PDF before clearing the fields
        if (file.type === 'application/pdf') {
          setTitle('');
          setFile(null);
        }
      } else {
        toast.error('Failed to upload exam result');
      }
    } catch (error) {
      console.error("API Upload Error:", error);
      toast.error(error.response?.data?.file?.[0] || 'Error uploading exam result');
    }
  };
  
  return (
    <div className="exam-result-upload-page">
      <h2>Upload Exam Results</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
          <label htmlFor="file">Choose File</label>
          <input
            type="file"
            id="file"
            accept=".pdf,.docx,.xlsx"
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Upload</button>
      </form>
      <ToastContainer/>
    </div>
  );
};

export default ExamResult;
