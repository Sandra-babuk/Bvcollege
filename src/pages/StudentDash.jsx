import React, { useState } from 'react';
import './stddash.css';
import user from '../assets/user.jpg';
import { RiArrowGoForwardLine } from "react-icons/ri";
import { MdNotifications } from 'react-icons/md';
import AssignmentStd from '../components/AssignmentStd';
import ResultStd from '../components/ResultStd';
import Notes from '../components/Notes';
import { useNavigate } from 'react-router-dom';
import StdProfile from '../components/StdProfile';
import { Modal } from 'react-bootstrap';
import { getNotificationsApi } from '../services/allApi';

const StudentDash = () => {
    const [activeFeature, setActiveFeature] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const navigate = useNavigate();
    
    const handleActiveFeature = (feature) => {
        setActiveFeature(feature);
    };

    const renderFeature = () => {
        switch (activeFeature) {
            case "assignment":
                return <AssignmentStd />; 
            case "result":
                return <ResultStd />;
            case 'notes':
                return <Notes />;
            default:
            case "profile":
                return <StdProfile />;
        }
    };

    const backhome = (e) => {
        e.preventDefault();
        navigate('/home');
    };

    const fetchNotifications = async () => {
        const token = localStorage.getItem('access');
        try {
            const response = await getNotificationsApi(token);
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleShowNotifications = () => {
        fetchNotifications();
        setShowNotifications(true);
    };

    const handleCloseNotifications = () => {
        setShowNotifications(false);
    };

    return (
        <div className="student-dashboard">
            <div className="student-header">
                <a href="/" onClick={backhome} className="back-link">
                    <RiArrowGoForwardLine /> Back to Home
                </a>
                <MdNotifications 
                    className="notification-btn" 
                    onClick={handleShowNotifications}
                />
            </div>

            <div className="navigation-menu">
                <nav className="nav-links">
                    <a 
                        href="#profile" 
                        onClick={() => handleActiveFeature("profile")}
                        className={activeFeature === "profile" ? "active" : ""}
                    >
                        Profile
                    </a>
                    <a 
                        href="#assignment" 
                        onClick={() => handleActiveFeature("assignment")}
                        className={activeFeature === "assignment" ? "active" : ""}
                    >
                        Assignments
                    </a>
                    <a 
                        href="#notes" 
                        onClick={() => handleActiveFeature("notes")}
                        className={activeFeature === "notes" ? "active" : ""}
                    >
                        Notes
                    </a>
                    <a 
                        href="#attendence" 
                        onClick={() => handleActiveFeature("attendence")}
                        className={activeFeature === "attendence" ? "active" : ""}
                    >
                        Attendance
                    </a>
                    <a 
                        href="#result" 
                        onClick={() => handleActiveFeature("result")}
                        className={activeFeature === "result" ? "active" : ""}
                    >
                        Result
                    </a>
                </nav>
            </div>

            <div className="dashboard-content">
                <aside className="profile-sidebar">
                    <div className="profile-image">
                        <img src={user} alt="Student Profile" />
                    </div>
                    <div className="profile-info">
                        <h4>JOHN MATHEW</h4>
                        <p>Student ID: 3809</p>
                        <hr />
                        <p>email@gmail.com</p>
                        <p>908765432</p>
                    </div>
                </aside>

                <main className="main-content">
                    {renderFeature()}
                </main>
            </div>

            <Modal show={showNotifications} onHide={handleCloseNotifications} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Notifications</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {notifications.length > 0 ? (
                        <ul className="notification-list">
                            {notifications.map((notification, index) => (
                                <li key={index} className="notification-item">
                                    <h5>{notification.title}</h5>
                                    <p>{notification.message}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No notifications available.</p>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default StudentDash;