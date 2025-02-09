import React, { useEffect, useState } from 'react';
import './facdash.css';
import prof3 from '../assets/prof3.jpg';
import { RiArrowGoForwardLine } from "react-icons/ri";
import { FaPlus } from 'react-icons/fa';
import { MdNotifications } from 'react-icons/md'; // Import notification icon
import { Button, Modal } from 'react-bootstrap';
import ResultStd from '../components/ResultStd';
import Notes from '../components/Notes';
import FacultyProfile from '../components/FacultyProfile';
import ViewStudent from '../components/ViewStudent';
import AddStudent from '../components/AddStudent';
import AddNote from '../components/AddNote';
import { getUserProfileApi, getNotificationsApi } from '../services/allApi'; // Import API for notifications
import { toast } from 'react-toastify';
import FacProfile from '../components/FacProfile';

const FacultyDash = () => {
    const [activeFeature, setActiveFeature] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showForm, setShowForm] = useState(null);
    const [showActionMenu, setShowActionMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false); // State for notification modal
    const [notifications, setNotifications] = useState([]); // State for notifications
    const [profile, setProfile] = useState({
        full_name: '',
        department: '',
        email: '',
        phone: '',
        photo: ''
    });

    useEffect(() => {
        const ProfileDetails = async () => {
            const token = localStorage.getItem('access'); // Get the token from localStorage
            const userId = localStorage.getItem('userId'); // Get the user ID from localStorage
            if (!token || !userId) {
                toast.error('No token or user ID found in localStorage.');
                return;
            }

            try {
                const response = await getUserProfileApi(userId, token); // Fetch user profile data
                const profileData = response.data;
                setProfile({
                    full_name: profileData.full_name,
                    department: profileData.department_name,
                    email: profileData.email,
                    phone: profileData.phone,
                    photo: profileData.photo // Assuming the API returns the photo URL
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

    const fetchNotifications = async () => {
        const token = localStorage.getItem('access'); // Get the token from localStorage
        try {
            const response = await getNotificationsApi(token); // Fetch notifications data
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            toast.error('Failed to fetch notifications.');
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
        <section>
            <div>
                <div className='container d-flex justify-content-end mt-1 me-auto'>
                    <p className='tohome text-primary'><RiArrowGoForwardLine /> Back to Home </p>
                    <MdNotifications className='notification-icon' onClick={handleShowNotifications} /> {/* Add notification icon */}
                </div>
                <div className='dash'>
                    <div className='stdOptions d-flex justify-content-center p-2 gap-4 mt-2'>
                        <a href="#result" onClick={() => handleActiveFeature("result")}>Profile</a>
                        <a href="#assignment" onClick={() => handleActiveFeature("assignment")}>All Students</a>
                        <a href="#notes" onClick={() => handleActiveFeature("notes")}>Notes</a>
                        <a href="#attendence" onClick={() => handleActiveFeature("attendence")}>Attendance</a>
                        <a href="#profile" onClick={() => handleActiveFeature("profile")}>Result</a>
                    </div>
                </div>
                <div className='d-flex row'>
                    <div className='sidebar col-lg-2 container mb-2'>
                        <div className='photo img-fluid'>
                            <img src={profile.photo || prof3} alt="Profile" />
                        </div>
                        <div className='text-center'>
                            <h4>{profile.full_name}</h4>
                            <p>{profile.department}</p>
                            <hr />
                            <p>{profile.email}</p>
                            <p>{profile.phone}</p>
                        </div>
                    </div>
                    <div className="col-lg-8 view">
                        {renderFeature()}
                    </div>
                    <div className="col-lg-1"></div>
                </div>

                {/* Floating action button to add student or note */}
                <div className='fab' onClick={toggleActionMenu}>
                    <FaPlus />
                </div>

                {/* Action Menu for selecting Add Student or Add Note */}
                {showActionMenu && (
                    <div className="action-menu">
                        <Button variant="primary" onClick={handleAddStudent}>Add Student</Button>
                        <Button variant="secondary" onClick={handleAddNote}>Add Note</Button>
                    </div>
                )}
            </div>

            {/* Modal for Adding Student or Note */}
            <Modal show={showModal} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{showForm ? `Add ${showForm}` : "Select Action"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!showForm ? (
                        <div className="d-flex justify-content-around">
                            <Button variant="primary" onClick={handleAddStudent}>Add Student</Button>
                            <Button variant="success" onClick={handleAddNote}>Add Note</Button>
                        </div>
                    ) : showForm === "Student" ? (
                        <AddStudent onClose={handleModalClose} />
                    ) : showForm === "Note" && (
                        <AddNote onClose={handleModalClose} />
                    )}
                </Modal.Body>
            </Modal>

            {/* Modal to display notifications */}
            <Modal show={showNotifications} onHide={handleCloseNotifications} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Notifications</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {notifications.length > 0 ? (
                        <ul>
                            {notifications.map((notification, index) => (
                                <li key={index}>
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
        </section>
    );
};

export default FacultyDash;
