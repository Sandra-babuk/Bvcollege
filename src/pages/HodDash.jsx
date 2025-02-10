import React, { useEffect, useState } from 'react';
import './hoddash.css';
import prof3 from '../assets/prof3.jpg';
import { RiArrowGoForwardLine } from "react-icons/ri";
import { FaPlus } from 'react-icons/fa';
import { MdNotifications } from 'react-icons/md';
import { Modal, Button } from 'react-bootstrap';
import ViewStudent from '../components/ViewStudent';
import ViewFaculty from '../components/ViewFaculty';
import Notes from '../components/Notes';
import HodProfile from '../components/HodProfile';
import AddStudent from '../components/AddStudent';
import AddFaculty from '../components/AddFaculty';
import AddDepartment from '../components/AddDepartment';
import AddNote from '../components/AddNote';
import Notification from '../components/Notification';
import { getUserProfileApi, departmentApi } from '../services/allApi';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const HodDash = () => {
  const [activeFeature, setActiveFeature] = useState("profile");
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(null);
  const [profile, setProfile] = useState({
    full_name: '',
    department_name: '',
    email: '',
    phone: '',
    photo: ''
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      const token = localStorage.getItem('access');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        toast.error('Authentication error: Missing token or user ID.');
        return;
      }

      try {
        const response = await getUserProfileApi(userId, token);
        const profileData = response.data;
        const departmentNameResponse = await departmentApi(profileData.department);
        const departmentName = departmentNameResponse.data ? departmentNameResponse.data.name : "N/A";

        setProfile({
          full_name: profileData.full_name || "N/A",
          department_name: departmentName,
          email: profileData.email || "N/A",
          phone: profileData.phone || "N/A",
          photo: profileData.photo || prof3
        });
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error('Failed to fetch profile data.');
      }
    };

    fetchProfileDetails();
  }, []);

  const handleActiveFeature = (feature) => {
    setShowNotifications(false);
    setActiveFeature(feature || "profile");
  };

  const renderFeature = () => {
    if (showNotifications) {
      return <Notification notifications={notifications} onClose={handleCloseNotifications} />;
    }

    switch (activeFeature) {
      case "assignment":
        return <ViewStudent />;
      case "result":
        return <ViewFaculty />;
      case "notes":
        return <Notes />;
      default:
        return <HodProfile />;
    }
  };

  const handleAddUser = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setShowForm(null);
  };

  const handleShowNotifications = () => {
    setShowNotifications(true);
  };

  const handleCloseNotifications = () => {
    setShowNotifications(false);
  };

  return (
    <div className="hod-dashboard">
      <div className="hod-header">
        <Link to="/home" className="back-link">
          <RiArrowGoForwardLine /> Back to Home
        </Link>
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
            href="#result" 
            onClick={() => handleActiveFeature("result")}
            className={activeFeature === "result" ? "active" : ""}
          >
            All Faculty
          </a>
          <MdNotifications 
            className="notification-btn"
            onClick={handleShowNotifications}
          />
        </nav>
      </div>

      <div className="dashboard-content">
        <aside className="profile-sidebar">
          <div className="profile-image">
            <img src={profile.photo} alt="Profile" />
          </div>
          <div className="profile-info">
            <h4>{profile.full_name}</h4>
            <p>{profile.department_name}</p>
            <hr />
            <p>{profile.email}</p>
            <p>{profile.phone}</p>
          </div>
        </aside>

        <main className="main-content">
          {renderFeature()}
        </main>
      </div>

      <button className="floating-action-btn" onClick={handleAddUser}>
        <FaPlus />
      </button>

      <Modal show={showModal} onHide={handleModalClose} centered className="custom-modal">
        <Modal.Header closeButton className="custom-modal-header">
          <Modal.Title>{showForm ? `Add ${showForm}` : "Select User Type"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body">
          {!showForm ? (
            <div className="d-flex justify-content-around">
              <Button variant="primary" onClick={() => setShowForm("Student")} className="custom-button m-2">
                Add Student
              </Button>
              <Button variant="success" onClick={() => setShowForm("Faculty")} className="custom-button m-2">
                Add Faculty
              </Button>
              <Button variant="warning" onClick={() => setShowForm("Department")} className="custom-button m-2">
                Add Department
              </Button>
              <Button variant="info" onClick={() => setShowForm("Notes")} className="custom-button m-2">
                Add Notes
              </Button>
            </div>
          ) : showForm === "Student" ? (
            <AddStudent onClose={handleModalClose} />
          ) : showForm === "Faculty" ? (
            <AddFaculty onClose={handleModalClose} />
          ) : showForm === "Department" ? (
            <AddDepartment onClose={handleModalClose} />
          ) : showForm === "Notes" ? (
            <AddNote onClose={handleModalClose} />
          ) : null}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default HodDash;