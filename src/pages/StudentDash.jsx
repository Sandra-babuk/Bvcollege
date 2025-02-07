import React, { useState, useEffect } from 'react';
import './stddash.css';
import user from '../assets/user.jpg';
import { RiArrowGoForwardLine } from "react-icons/ri";
import { MdNotifications } from 'react-icons/md'; // Import notification icon
import AssignmentStd from '../components/AssignmentStd';
import ResultStd from '../components/ResultStd';
import Notes from '../components/Notes';
import { useNavigate } from 'react-router-dom';
import StdProfile from '../components/StdProfile';
import { Modal } from 'react-bootstrap';
import { getNotificationsApi } from '../services/allApi'; // Import API for notifications

const StudentDash = () => {
    const [activeFeature, setActiveFeature] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false); // State for notification modal
    const [notifications, setNotifications] = useState([]); // State for notifications

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

    const navigate = useNavigate();
    const backhome = () => {
        navigate('/home');
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
                    <a href="" onClick={backhome} className='tohome'><RiArrowGoForwardLine /> Back to Home</a>
                    <MdNotifications className='notification-icon' onClick={handleShowNotifications} /> {/* Add notification icon */}
                </div>
                <div className='dash'>
                    <div className='stdOptions d-flex justify-content-center p-2 gap-4 mt-2 '>
                        <a href="#profile" onClick={() => handleActiveFeature("profile")}>Profile</a>
                        <a href="#assignment" onClick={() => handleActiveFeature("assignment")}>Assignments</a>
                        <a href="#notes" onClick={() => handleActiveFeature("notes")}>Notes</a>
                        <a href="#attendence" onClick={() => handleActiveFeature("attendence")}>Attendance</a>
                        <a href="#result" onClick={() => handleActiveFeature("result")}>Result</a>
                    </div>
                </div>
                <div className='d-flex row'>
                    <div className='sidebar col-lg-2 container mb-2 '>
                        <div className='photo img-fluid'>
                            <img src={user} alt="" />
                        </div>
                        <div className='text-center'>
                            <h4>JOHN MATHEW</h4>
                            <p>student Id:3809</p>
                            <hr />
                            <p>email@gmail.com</p>
                            <p>908765432</p>
                        </div>
                    </div>
                    <div className="col-lg-8 view " id=''>
                        {renderFeature()}
                    </div>
                    <div className="col-lg-1"></div>
                </div>
            </div>

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

export default StudentDash;
