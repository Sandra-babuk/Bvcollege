import React, { useEffect, useState } from 'react';
import './facdash.css';
import prof3 from '../assets/prof3.jpg';
import { RiArrowGoForwardLine } from "react-icons/ri";
import { FaPlus } from 'react-icons/fa';
import { MdNotifications } from 'react-icons/md';
import { Button, Modal } from 'react-bootstrap';
import Notes from '../components/Notes';
// import FacultyProfile from '../components/FacultyProfile';
import ViewStudent from '../components/ViewStudent';
import AddStudent from '../components/AddStudent';
import AddNote from '../components/AddNote';
import { toast } from 'react-toastify';
import FacProfile from '../components/FacProfile';
import AddAssignment from '../components/AddAssign';
import { getUserProfileApi, getNotificationsApi } from '../services/allApi';
import AssignmentStd from '../components/AssignmentStd';
import AssignmentView from '../components/AssignmentView';
import StdAttendance from '../components/StdAttendance';

const FacultyDash = () => {

    const serverUrl = "http://localhost:8000"; // Change this for production


    const [activeFeature, setActiveFeature] = useState("profile");
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
        const fetchProfileDetails = async () => {
            const token = localStorage.getItem('access');
            const userId = localStorage.getItem('userId');
            if (!token || !userId) {
                toast.error('No token or user ID found in localStorage.');
                return;
            }

            try {
                const response = await getUserProfileApi(userId, token);
                setProfile(response.data);
            } catch (error) {
                console.error('Error fetching profile data:', error);
                toast.error('Failed to fetch profile data.');
            }
        };
        fetchProfileDetails();
    }, []);

    const renderFeature = () => {
        switch (activeFeature) {
            case "students":
                return <ViewStudent department={profile.department} />;
            case "profile":
                return <FacProfile />;
            case "notes":
                return <Notes />;
            case "assignments":
                return <AssignmentView />;
            case "attendance":
                return <StdAttendance />; // Update this line
            default:
                return <FacultyProfile />;
        }
    };

    const handleAdd = (formType) => {
        setShowForm(formType);
        setShowModal(true);
        setShowActionMenu(false);
    };

    const toggleActionMenu = () => setShowActionMenu(!showActionMenu);
    const handleModalClose = () => setShowModal(false);

    const fetchNotifications = async () => {
        const token = localStorage.getItem('access');
        try {
            const response = await getNotificationsApi(token);
            // Ensure the response data is an array
            setNotifications(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            toast.error('Failed to fetch notifications.');
        }
    };

    return (
        <div className="faculty-dashboard">
            <div className="faculty-header">
                <p className="back-link">
                    <RiArrowGoForwardLine /> Back to Home
                </p>
                <MdNotifications
                    className="notification-btn"
                    onClick={() => { fetchNotifications(); setShowNotifications(true); }}
                />
            </div>

            <div className="navigation-menu">
                <nav className="nav-links">
                    {['profile', 'students', 'notes', 'assignments', 'attendance'].map(feature => ( // Update this line
                        <a
                            key={feature}
                            href={`#${feature}`}
                            onClick={() => setActiveFeature(feature)}
                            className={activeFeature === feature ? "active" : ""}
                        >
                            {feature.charAt(0).toUpperCase() + feature.slice(1)}
                        </a>
                    ))}
                </nav>
            </div>

            <div className="dashboard-content">
                <aside className="profile-sidebar">
                    {/* <div className="profile-image">

                        <img
                            src={profile.photo ? `${serverUrl}${profile.photo}` :""}
                            alt="Profile"
                            onError={(e) => e.target.src = prof3}
                        />                    </div> */}
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
                    {['Student', 'Note', 'Assignment'].map(type => (
                        <Button key={type} variant="primary" onClick={() => handleAdd(type)}>
                            Add {type}
                        </Button>
                    ))}
                </div>
            )}

            <Modal show={showModal} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add {showForm}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showForm === "Student" ? <AddStudent onClose={handleModalClose} /> :
                        showForm === "Note" ? <AddNote onClose={handleModalClose} /> :
                            showForm === "Assignment" ? <AddAssignment onClose={handleModalClose} /> : null}
                </Modal.Body>
            </Modal>

            <Modal show={showNotifications} onHide={() => setShowNotifications(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Notifications</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {Array.isArray(notifications) && notifications.length > 0 ? (
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
