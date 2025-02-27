import React, { useState, useEffect } from 'react';
import './stddash.css';
import user from '../assets/user.jpg';
import { RiArrowGoForwardLine } from "react-icons/ri";
import { MdNotifications } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';
import AssignmentStd from '../components/AssignmentStd';
import ResultStd from '../components/ResultStd';
import { useNavigate, Link } from 'react-router-dom';  // Use Link for navigation
import StdProfile from '../components/StdProfile';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getNotificationsApi, deleteNotificationApi, getUserProfileApi } from '../services/allApi';
import StudentNotesView from '../components/StudentNoteView';

const StudentDash = () => {
    const [activeFeature, setActiveFeature] = useState("profile"); // Default active feature
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [courseId] = useState(1); // Example course ID
    const [profile, setProfile] = useState(null);

    const navigate = useNavigate();

    // Fetch Profile Data
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('access');
            if (!token) {
                console.error("No token found");
                return;
            }
            try {
                const response = await getUserProfileApi(token); 
                setProfile(response.data);
            } catch (error) {
                console.error("Error fetching profile:", error.response?.data || error.message);
            }
        };
        fetchProfile();
    }, []);

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
                return <StudentNotesView courseId={courseId} />;
            case "profile":
            default:
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

    return (
        <div className="student-dashboard">
            <div className="student-header">
                <Link to="/home" onClick={backhome} className="back-link">
                    <RiArrowGoForwardLine /> Back to Home
                </Link>
                <MdNotifications
                    className="notification-btn"
                    onClick={handleShowNotifications}
                />
            </div>

            <div className="navigation-menu">
                <nav className="nav-links">
                    <Link
                        to="#profile"
                        onClick={() => handleActiveFeature("profile")}
                        className={activeFeature === "profile" ? "active" : ""}
                    >
                        Profile
                    </Link>
                    <Link
                        to="#assignment"
                        onClick={() => handleActiveFeature("assignment")}
                        className={activeFeature === "assignment" ? "active" : ""}
                    >
                        Assignments
                    </Link>
                    <Link
                        to="#notes"
                        onClick={() => handleActiveFeature("notes")}
                        className={activeFeature === "notes" ? "active" : ""}
                    >
                        Notes
                    </Link>
                    <Link
                        to="#result"
                        onClick={() => handleActiveFeature("result")}
                        className={activeFeature === "result" ? "active" : ""}
                    >
                        Result
                    </Link>
                </nav>
            </div>

            <div className="dashboard-content">
                <aside className="profile-sidebar">
                    <div className="profile-image">
                        <img src={user} alt="Student Profile" />
                    </div>
                    <div className="profile-info">
                        {profile ? (
                            <>
                                <h4>{profile.full_name}</h4>
                                <p>Student ID: {profile.student_id}</p>
                                <hr />
                                <p>{profile.email}</p>
                                <p>{profile.phone}</p>
                            </>
                        ) : (
                            <p>Loading profile...</p>
                        )}
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
                            {notifications.map((notification) => (
                                <li key={notification.id} className="notification-item">
                                    <h5>{notification.title}</h5>
                                    <p>{notification.message}</p>
                                    <FaTrash className="delete-icon" onClick={() => handleDeleteNotification(notification.id)} />
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
