import React, { useState } from 'react';
import './facdash.css';
import prof3 from '../assets/prof3.jpg';
import { RiArrowGoForwardLine } from "react-icons/ri";
import { FaPlus } from 'react-icons/fa';
import { Button, Modal } from 'react-bootstrap';
import ResultStd from '../components/ResultStd';
import Notes from '../components/Notes';
import FacultyProfile from '../components/FacultyProfile';
import ViewStudent from '../components/ViewStudent';
import AddStudent from '../components/AddStudent';
import AddNote from '../components/AddNote';  // Assuming AddNote component exists

const FacultyDash = () => {
    const [activeFeature, setActiveFeature] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showForm, setShowForm] = useState(null); // To control the type of form shown in the modal
    const [showActionMenu, setShowActionMenu] = useState(false); // To control the visibility of the action menu

    const handleActiveFeature = (feature) => {
        setActiveFeature(feature);
    };

    const renderFeature = () => {
        switch (activeFeature) {
            case "assignment":
                return <ViewStudent />;
            case "result":
                return <ResultStd />;
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
        setShowActionMenu(false); // Close action menu when adding a student
    };

    const handleAddNote = () => {
        setShowForm("Note");
        setShowModal(true);
        setShowActionMenu(false); // Close action menu when adding a note
    };

    const handleModalClose = () => {
        setShowModal(false);
        setShowForm(null); // Reset the form type
    };

    const toggleActionMenu = () => {
        setShowActionMenu(!showActionMenu);
    };

    return (
        <section>
            <div>
                <div className='container d-flex justify-content-end mt-1 me-auto'>
                    <p className='tohome'><RiArrowGoForwardLine /> Back to Home </p>
                </div>
                <div className='dash'>
                    <div className='stdOptions d-flex justify-content-center p-2 gap-4 mt-2'>
                        <a href="#profile" onClick={() => handleActiveFeature("profile")}>Profile</a>
                        <a href="#assignment" onClick={() => handleActiveFeature("assignment")}>All Students</a>
                        <a href="#notes" onClick={() => handleActiveFeature("notes")}>Notes</a>
                        <a href="#attendence" onClick={() => handleActiveFeature("attendence")}>Attendance</a>
                        <a href="#result" onClick={() => handleActiveFeature("result")}>Result</a>
                    </div>
                </div>
                <div className='d-flex row'>
                    <div className='sidebar col-lg-2 container mb-2'>
                        <div className='photo img-fluid'>
                            <img src={prof3} alt="Profile" />
                        </div>
                        <div className='text-center'>
                            <h4>Miazna Ameer</h4>
                            <p>Department of Civil Engineering</p>
                            <hr />
                            <p>miszna@gmail.com</p>
                            <p>908765432</p>
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
        </section>
    );
};

export default FacultyDash;
