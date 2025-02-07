import React, { useEffect, useState } from 'react';
import './facdash.css';
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
import { getUserProfileApi } from '../services/allApi';
import { toast } from 'react-toastify';  // Ensure toast is imported for error messages

const HodDash = () => {
  const [activeFeature, setActiveFeature] = useState("profile");
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(null);
  const [profile, setProfile] = useState({
    full_name: '',
    department: '',
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
        setProfile({
          full_name: profileData.full_name || "N/A",
          department: profileData.department || "N/A",
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
    setActiveFeature(feature || "profile");  // Fallback to prevent crashes
  };

  const renderFeature = () => {
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


  

  const handleShowNotifications = async () => {
    await fetchNotifications();  // Fetch first
    setShowNotifications(true);  // Then show modal
  };
  

  const handleCloseNotifications = () => {
    setShowNotifications(false);
  };

  return (
    <section>
      <div>
        <div className='container d-flex justify-content-end mt-1 me-auto text-primary'>
          <p className='tohome'><RiArrowGoForwardLine /> Back to Home </p>
        </div>
        <div className='dash'>
          <div className='stdOptions d-flex justify-content-center p-2 gap-4 mt-2 '>
            <a href="#profile" onClick={() => handleActiveFeature("profile")}>Profile</a>
            <a href="#assignment" onClick={() => handleActiveFeature("assignment")}>All Students</a>
            <a href="#notes" onClick={() => handleActiveFeature("notes")}>Notes</a>
            <a href="#attendence" onClick={() => handleActiveFeature("attendence")}>Attendance</a>
            <a href="#result" onClick={() => handleActiveFeature("result")}>All Faculty</a>
            <MdNotifications className='notification-icon' onClick={handleShowNotifications} /> 

          </div>
        </div>
        <div className='d-flex row'>
          <div className='sidebar col-lg-2 container mb-2 '>
            <div className='photo img-fluid'>
              <img src={profile.photo} alt="Profile" />
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
        
        {/* Floating Add Button */}
        <div className="fab" onClick={handleAddUser}>
          <FaPlus />
        </div>
      </div>

      {/* Modal to Choose User Type */}
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{showForm ? `Add ${showForm}` : "Select User Type"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!showForm ? (
            <div className="d-flex justify-content-around">
              <Button variant="primary" onClick={() => setShowForm("Student")}>Add Student</Button>
              <Button variant="success" onClick={() => setShowForm("Faculty")}>Add Faculty</Button>
              <Button variant='warning' onClick={() => setShowForm("Department")}>Add Department</Button>
              <Button variant='info' onClick={() => setShowForm("Notes")}>Add Notes</Button>
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

      

    </section>
  );
};

export default HodDash;
