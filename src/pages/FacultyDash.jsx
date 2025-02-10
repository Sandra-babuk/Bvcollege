import React, { useEffect, useState } from 'react';
import './facdash.css';
import prof3 from '../assets/prof3.jpg';
import { RiArrowGoForwardLine } from "react-icons/ri";
import { FaPlus } from 'react-icons/fa';
import { MdNotifications } from 'react-icons/md';
import { Button, Modal } from 'react-bootstrap';
// import ResultStd from '../components/ResultStd';
import Notes from '../components/Notes';
import FacultyProfile from '../components/FacultyProfile';
import ViewStudent from '../components/ViewStudent';
import AddStudent from '../components/AddStudent';
import AddNote from '../components/AddNote';
import { getUserProfileApi, getNotificationsApi } from '../services/allApi';
import { toast } from 'react-toastify';
import FacProfile from '../components/FacProfile';

const FacultyDash = () => {
    const [activeFeature, setActiveFeature] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showForm, setShowForm] = useState(null);
    const [showActionMenu, setShowActionMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [profile, setProfile] = useState({
        full_name: '',
        department: '',
        email: '',
        phone: '',
        photo: ''
    });

    useEffect(() => {
        const ProfileDetails = async () => {
            const token = localStorage.getItem('access');
            const userId = localStorage.getItem('userId');
            if (!token || !userId) {
                toast.error('No token or user ID found in localStorage.');
                return;
            }

            try {
                const response = await getUserProfileApi(userId, token);
                const profileData = response.data;
                setProfile({
                    full_name: profileData.full_name,
                    department: profileData.department_name,
                    email: profileData.email,
                    phone: profileData.phone,
                    photo: profileData.photo
                });
            } catch (error) {
                console.error('Error fetching profile data:', error);
                toast.error('Failed to fetch profile data.');
            }
        };

        ProfileDetails();
    }, []);

    const handleActiveFeature = (feature) => {
        setActiveFeature(feature);
    };

    const renderFeature = () => {
        switch (activeFeature) {
            case "assignment":
                return <ViewStudent />;
            case "result":
                return <FacProfile />;
            case "notes":
                return <Notes />;
            default:
            case "profile":
                return <FacultyProfile />;
        }
    };

    const handleAddStudent = () => {
        setShowForm("Student");
        setShowModal(true);
        setShowActionMenu(false);
    };

    const handleAddNote = () => {
        setShowForm("Note");
        setShowModal(true);
        setShowActionMenu(false);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setShowForm(null);
    };

    const toggleActionMenu = () => {
        setShowActionMenu(!showActionMenu);
    };

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

    const handleShowNotifications = () => {
        allNotifications();
        setShowNotifications(true);
    };

    const handleCloseNotifications = () => {
        setShowNotifications(false);
    };

    return (
        <div className="faculty-dashboard">
            <div className="faculty-header">
                <p className="back-link">
                    <RiArrowGoForwardLine /> Back to Home
                </p>
                <MdNotifications 
                    className="notification-btn" 
                    onClick={handleShowNotifications}
                />
            </div>

            <div className="navigation-menu">
                <nav className="nav-links">
                    <a 
                        href="#result" 
                        onClick={() => handleActiveFeature("result")}
                        className={activeFeature === "result" ? "active" : ""}
                    >
                        Profile
                    </a>
                    <a 
                        href="#assignment" 
                        onClick={() => handleActiveFeature("assignment")}
                        className={activeFeature === "assignment" ? "active" : ""}
                    >
                        All Students
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
                        href="#profile" 
                        onClick={() => handleActiveFeature("profile")}
                        className={activeFeature === "profile" ? "active" : ""}
                    >
                        Result
                    </a>
                </nav>
            </div>

            <div className="dashboard-content">
                <aside className="profile-sidebar">
                    <div className="profile-image">
                        <img src={profile.photo || prof3} alt="Profile" />
                    </div>
                    <div className="profile-info">
                        <h4>{profile.full_name}</h4>
                        <p>{profile.department}</p>
                        <hr />
                        <p>{profile.email}</p>
                        <p>{profile.phone}</p>
                    </div>
                </aside>

                <main className="main-content">
                    {renderFeature()}
                </main>
            </div>

            <button className="floating-action-btn" onClick={toggleActionMenu}>
                <FaPlus />
            </button>

            {showActionMenu && (
                <div className="action-menu-container">
                    <Button variant="primary" onClick={handleAddStudent}>
                        Add Student
                    </Button>
                    <Button variant="secondary" onClick={handleAddNote}>
                        Add Note
                    </Button>
                </div>
            )}

            {/* Modal for Adding Student or Note */}
            <Modal show={showModal} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {showForm ? `Add ${showForm}` : "Select Action"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!showForm ? (
                        <div className="d-flex justify-content-around">
                            <Button variant="primary" onClick={handleAddStudent}>
                                Add Student
                            </Button>
                            <Button variant="success" onClick={handleAddNote}>
                                Add Note
                            </Button>
                        </div>
                    ) : showForm === "Student" ? (
                        <AddStudent onClose={handleModalClose} />
                    ) : (
                        showForm === "Note" && <AddNote onClose={handleModalClose} />
                    )}
                </Modal.Body>
            </Modal>

            {/* Notifications Modal */}
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

export default FacultyDash;