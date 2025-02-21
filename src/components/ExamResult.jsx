import React, { useState } from 'react';
import { ExamResultApi } from '../services/allApi';
import './resultstd.css';

const ExamResult = () => {
  const [formData, setFormData] = useState({
    student_name: '',
    course_name: '',
    department_name: '',
    batch_name: '',
    sub_name: '',
    score: '',
    max_score: ''
  });
  const [token, setToken] = useState('access');  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await ExamResultApi(formData, token);
      console.log('Exam result posted successfully:', result);
      // Clear the form
      setFormData({
        student_name: '',
        course_name: '',
        department_name: '',
        batch_name: '',
        sub_name: '',
        score: '',
        max_score: ''
      });
    } catch (error) {
      console.error('There was an error posting the exam result!', error);
    }
  };

  return (
    <div className='result'>
      <form className='form' onSubmit={handleSubmit}>
        <div>
          <label>Student Name</label>
          <input type='text' name='student_name' value={formData.student_name} onChange={handleChange} required />
        </div>
        <div>
          <label>Course Name</label>
          <input type='text' name='course_name' value={formData.course_name} onChange={handleChange} required />
        </div>
        <div>
          <label>Department Name</label>
          <input type='text' name='department_name' value={formData.department_name} onChange={handleChange} />
        </div>
        <div>
          <label>Batch Name</label>
          <input type='text' name='batch_name' value={formData.batch_name} onChange={handleChange} />
        </div>
        <div>
          <label>Subject Name</label>
          <input type='text' name='sub_name' value={formData.sub_name} onChange={handleChange} required />
        </div>
        <div>
          <label>Score</label>
          <input type='number' name='score' value={formData.score} onChange={handleChange} required />
        </div>
        <div>
          <label>Maximum Score</label>
          <input type='number' name='max_score' value={formData.max_score} onChange={handleChange} required />
        </div>
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default ExamResult;
