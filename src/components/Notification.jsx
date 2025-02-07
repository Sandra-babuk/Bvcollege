import React, { useState, useEffect } from 'react';
import { addNotificationApi, StudentApi } from '../services/allApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './notif.css';

const Notification = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [recipientType, setRecipientType] = useState('');
    const [recipientId, setRecipientId] = useState('');
    const [students, setStudents] = useState([]);

    useEffect(() => {
        if (recipientType === 'particularStudent') {
            const allStudents = async () => {
                const token = localStorage.getItem('access');
                try {
                    const response = await StudentApi(token);
                    console.log('students data:', response); 
                    const studentsData = response.data;
                    if (Array.isArray(studentsData)) {
                        setStudents(studentsData);
                    } else {
                        console.error('Unexpected response format:', studentsData);
                    }
                } catch (error) {
                    console.error('Error fetching students:', error);
                }
            };
            allStudents();
        } else {
            setStudents([]); 
        }
    }, [recipientType]);

    const handleSendNotification = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('access');
  
      const data = {
          title,
          message,
          recipientType, 
          recipientId: recipientType === 'particularStudent' ? recipientId : null
      };
  
      try {
          await addNotificationApi(data, token);
          setTitle('');
          setMessage('');
          setRecipientType('');
          setRecipientId('');
          toast.success('Notification sent successfully!');
      } catch (error) {
          console.error('Error sending notification:', error);
          toast.error('Failed to send notification.');
      }
  };
  

    return (
        <div className="send-notification-page">
            <h2>Send Notification</h2>
            <form onSubmit={handleSendNotification}>
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
                    <label htmlFor="message">Message</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="recipientType">Send To</label>
                    <select
                        id="recipientType"
                        value={recipientType}
                        onChange={(e) => setRecipientType(e.target.value)}
                        required
                    >
                        <option value="">Select recipient type</option>
                        <option value="faculty">Faculty</option>
                        <option value="allStudents">All Students</option>
                        <option value="particularStudent">Particular Student</option>
                    </select>
                </div>
                {recipientType === 'particularStudent' && (
                    <div className="form-group">
                        <label htmlFor="recipientId">Student Name</label>
                        <select
                            id="recipientId"
                            value={recipientId}
                            onChange={(e) => setRecipientId(e.target.value)}
                            required
                        >
                            <option value="">Select a student</option>
                            {students.map(student => (
                                <option key={student.id} value={student.id}>
                                    {student.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <button type="submit" className="btn btn-primary">Send</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default Notification;
