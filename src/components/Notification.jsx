import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { addNotificationApi, updateNotificationApi, deleteNotificationApi, getNotificationsApi, StudentApi } from '../services/allApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './notif.css';
import { FaEye ,FaEdit,FaTrash } from 'react-icons/fa'; 

const Notification = () => {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [recipientType, setRecipientType] = useState('');
    const [recipientIds, setRecipientIds] = useState([]);
    const [students, setStudents] = useState([]);
    const [studentOptions, setStudentOptions] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        allNotifications();
    }, []);

    // useEffect(() => {
    //     if (recipientType === 'particularStudent') {
    //         fetchStudents();
    //     } else {
    //         setStudents([]);
    //         setStudentOptions([]);
    //     }
    // }, [recipientType]);

    // const fetchStudents = async () => {
    //     const token = localStorage.getItem('access');
    //     try {
    //         const response = await StudentApi(token);
    //         if (response.status === 200) {
    //             const studentsData = response.data;
    //             setStudents(studentsData);
    //             const options = studentsData.map(student => ({
    //                 value: student.id,
    //                 label: student.full_name
    //             }));
    //             setStudentOptions(options);
    //         } else if (response.status === 404) {
    //             toast.error('Students not found.');
    //         }
    //     } catch (error) {
    //         console.error('Error fetching students:', error);
    //         toast.error('Failed to fetch students.');
    //     }
    // };

    const allNotifications = async () => {
        const token = localStorage.getItem('access');
        try {
            const response = await getNotificationsApi(token);
            if (response.status === 200) {
                setNotifications(response.data);
            } else {
                toast.error('No notifications found.');
            }
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
            // recipientIds: recipientType === 'particularStudent' ? recipientIds : []
        };

        try {
            if (selectedNotification) {
                const response = await updateNotificationApi(selectedNotification.id, data, token);
                if (response.status === 200) {
                    toast.success('Notification updated successfully!');
                    setSelectedNotification(null);
                } else {
                    toast.error('Failed to update notification.');
                }
            } else {
                const response = await addNotificationApi(data, token);
                if (response.status === 201) {
                    toast.success('Notification sent successfully!');
                } else {
                    toast.error('Failed to send notification.');
                }
            }
            setTitle('');
            setMessage('');
            setRecipientType('');
            // setRecipientIds([]);
            allNotifications(); // Refresh notifications
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
            const response = await deleteNotificationApi(id, token);
            if (response.status === 204) {
                setNotifications(notifications.filter(notification => notification.id !== id));
                toast.success('Notification deleted successfully.');
            } else if (response.status === 404) {
                toast.error('Notification not found.');
            } else {
                toast.error('Failed to delete notification.');
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
            toast.error('Failed to delete notification.');
        }
    };

    const handleEditNotification = (notification) => {
        setSelectedNotification(notification);
        setTitle(notification.title);
        setMessage(notification.message);
        // setRecipientType(notification.recipientType);
        // setRecipientIds(notification.recipientIds || []);
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
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
                {/* <div className="form-group">
                    <label htmlFor="recipientType">Send To</label>
                    <select
                        id="recipientType"
                        value={recipientType}
                        onChange={(e) => setRecipientType(e.target.value)}
                        required
                    >
                        <option value="">Select recipient type</option>
                        <option value="faculty">All</option>
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
                )} */}
                <button type="submit" className="btn btn-primary">{selectedNotification ? 'Update' : 'Send'}</button>
            </form>
            
            <button className="btn btn-secondary" onClick={toggleNotifications}>
                <FaEye /> {showNotifications ? 'Hide Notifications' : 'View Notifications'}
            </button>
            <ToastContainer/>
            {showNotifications && notifications.length > 0 && (
                <div className="notifications-list">
                    <h3>All Notifications</h3>
                    <ul>
                        {notifications.map(notification => (
                            <li key={notification.id}>
                                <h4>{notification.title}</h4>
                                <p>{notification.message}</p>
                                <button variant="outline-primary" onClick={() => handleEditNotification(notification)}><FaEdit/></button>
                                <button variant="outline-danger" onClick={() => handleDeleteNotification(notification.id)}><FaTrash/></button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Notification;
