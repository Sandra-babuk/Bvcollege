import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { addNotificationApi, updateNotificationApi, deleteNotificationApi, getNotificationsApi, StudentApi } from '../services/allApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './notif.css';

const Notification = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [recipientType, setRecipientType] = useState('');
    const [recipientIds, setRecipientIds] = useState([]); // Initialize as empty array
    const [students, setStudents] = useState([]);
    const [studentOptions, setStudentOptions] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [selectedNotification, setSelectedNotification] = useState(null);

    useEffect(() => {
        allNotifications();
    }, []);

    useEffect(() => {
        if (recipientType === 'particularStudent') {
            const allStudents = async () => {
                const token = localStorage.getItem('access');
                try {
                    const response = await StudentApi(token);
                    const studentsData = response.data;
                    if (Array.isArray(studentsData)) {
                        setStudents(studentsData);
                        const options = studentsData.map(student => ({
                            value: student.id,
                            label: student.full_name
                        }));
                        setStudentOptions(options);
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
            setStudentOptions([]);
        }
    }, [recipientType]);

    const allNotifications = async () => {
        const token = localStorage.getItem('access');
        try {
            const response = await getNotificationsApi(token);
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            toast.error('Failed to fetch notifications.');
        }
    };

    const handleSendNotification = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access');

        const data = {
            title,
            message,
            recipientType,
            recipientIds: recipientType === 'particularStudent' ? recipientIds : []
        };

        try {
            if (selectedNotification) {
                await updateNotificationApi(selectedNotification.id, data, token);
                toast.success('Notification updated successfully!');
                setSelectedNotification(null);
            } else {
                await addNotificationApi(data, token);
                toast.success('Notification sent successfully!');
            }
            setTitle('');
            setMessage('');
            setRecipientType('');
            setRecipientIds([]);
            allNotifications(); // Refresh notifications after sending or updating
        } catch (error) {
            console.error('Error sending notification:', error);
            toast.error('Failed to send notification.');
        }
    };

    const handleSelectChange = (selectedOptions) => {
        const ids = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setRecipientIds(ids);
    };

    const handleDeleteNotification = async (id) => {
        const token = localStorage.getItem('access');
        try {
            await deleteNotificationApi(id, token);
            setNotifications(notifications.filter(notification => notification.id !== id));
            toast.success('Notification deleted successfully.');
        } catch (error) {
            console.error('Error deleting notification:', error);
            toast.error('Failed to delete notification.');
        }
    };

    const handleEditNotification = (notification) => {
        setSelectedNotification(notification);
        setTitle(notification.title);
        setMessage(notification.message);
        setRecipientType(notification.recipientType);
        setRecipientIds(notification.recipientIds || []); // Ensure recipientIds is always an array
    };

    return (
        <div className="send-notification-page">
            <h2>{selectedNotification ? 'Edit Notification' : 'Send Notification'}</h2>
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
                        <label htmlFor="recipientIds">Student Names</label>
                        <Select
                            id="recipientIds"
                            options={studentOptions}
                            onChange={handleSelectChange}
                            value={studentOptions.filter(option => recipientIds.includes(option.value))}
                            isMulti
                            isClearable
                            placeholder="Search and select students"
                        />
                    </div>
                )}
                <button type="submit" className="btn btn-primary">{selectedNotification ? 'Update' : 'Send'}</button>
            </form>

            {/* <h2>All Notifications</h2>
            <ul>
                {notifications.map(notification => (
                    <li key={notification.id}>
                        <h3>{notification.title}</h3>
                        <p>{notification.message}</p>
                        <button onClick={() => handleEditNotification(notification)}>Edit</button>
                        <button onClick={() => handleDeleteNotification(notification.id)}>Delete</button>
                    </li>
                ))}
            </ul> */}
            <ToastContainer />
        </div>
    );
};

export default Notification;
