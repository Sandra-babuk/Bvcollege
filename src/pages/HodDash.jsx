import React, { useState } from 'react';
import './facdash.css';
import prof3 from '../assets/prof3.jpg';
import { RiArrowGoForwardLine } from "react-icons/ri";
import { FaPlus } from 'react-icons/fa'; 
import { Modal, Button } from 'react-bootstrap'; 
import ViewStudent from '../components/ViewStudent';
import ViewFaculty from '../components/ViewFaculty';
import Notes from '../components/Notes';
import HodProfile from '../components/HodProfile';
import AddStudent from '../components/AddStudent';
import AddFaculty from '../components/AddFaculty';
import AddDepartment from '../components/AddDepartment';

const HodDash = () => {
  const [activeFeature, setActiveFeature] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(null);

  const handleActiveFeature = (feature) => {
    setActiveFeature(feature);
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
      case "profile":
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

  return (
    <section>
      <div>
        <div className='container d-flex justify-content-end mt-1 me-auto'><p className='tohome'><RiArrowGoForwardLine /> Back to Home </p></div>
        <div className='dash'>
          <div className='stdOptions d-flex justify-content-center p-2 gap-4 mt-2 '>
            <a href="#profile" onClick={() => handleActiveFeature("profile")}>Profile</a>
            <a href="#assignment" onClick={() => handleActiveFeature("assignment")}>AllStudents</a>
            <a href="#notes" onClick={() => handleActiveFeature("notes")}>Notes</a>
            <a href="#attendence" onClick={() => handleActiveFeature("attendence")}>Attendance</a>
            <a href="#result" onClick={() => handleActiveFeature("result")}>AllFaculty</a>
          </div>
        </div>
        <div className='d-flex row'>
          <div className='sidebar col-lg-2 container mb-2 '>
            <div className='photo img-fluid'>
              <img src={prof3} alt="Profile" />
            </div>
            <div className='text-center'>
              <h4>Aleena</h4>
              <p>Department of Civil Engineering</p>
              <hr />
              <p>email@gmail.com</p>
              <p>908765432</p>
            </div>
          </div>
          <div className="col-lg-8 view" id=''>
            {renderFeature()}
          </div>
          <div className="col-lg-1"></div>
        </div>
        {/*  add student or faculty */}
        <div className="fab" onClick={handleAddUser}>
          <FaPlus />
        </div>
      </div>

      {/* Modal to choose Student, Faculty, or Department */}
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
            </div>
          ) : showForm === "Student" ? (
            <AddStudent onClose={handleModalClose} />
          ) : showForm === "Faculty" ? (
            <AddFaculty onClose={handleModalClose} />
          ) : (
            <AddDepartment onClose={handleModalClose} />
          )}
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default HodDash;