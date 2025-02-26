import React from 'react'
import { TfiAnnouncement } from "react-icons/tfi";
import { MdOutlineEventNote, MdOutlineLibraryBooks } from "react-icons/md";
import { GiBlackBook } from "react-icons/gi";
import { BsTrophy } from "react-icons/bs";
import './about.css'
import Events from './Events';
import Courses from './Courses';
import prof1 from '../assets/prof1.jpg'
import prof3 from '../assets/prof2.jpg'
import prof4 from '../assets/prof3.jpg'
import Departments from './Departments';

const About = () => {
    return (
        <>
            <div className="container d-flex gap-5 justify-content-center my-3">
                <div className='card p-2 text-light text-center'>
                    <div className='d-flex align-items-center justify-content-center'><TfiAnnouncement /></div>
                    <h5>Announcements</h5>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                </div >
                <div className='card p-2 text-light text-center'>
                    <div className='d-flex align-items-center justify-content-center'><MdOutlineEventNote /></div>
                    <h5>Events</h5>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                </div>
                <div className='card p-2 text-light text-center'>
                    <div className='d-flex align-items-center justify-content-center'><GiBlackBook /></div>
                    <h5>Courses</h5>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                </div>
                <div className='card p-2 text-light text-center'>
                    <div className='d-flex align-items-center justify-content-center'><BsTrophy /></div>
                    <h5>Results</h5>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                </div>
            </div>
            {/* Events */}
            <Events />
            <Departments />
            <Courses />
            <div className=''>
                <div className='d-flex flex-row gap-2 m-2'>
                    <div className="people py-2 ms-auto">
                        <h4 className="text-center">Principal</h4>
                        <div className="people-content d-flex flex-row">
                            <img src={prof1} width={200} height={200} alt="img" className="people-image" />
                            <div className='people-details d-flex flex-column justify-content-center  gap-2'>
                                <h6 className='ms-2'>Prof. Dr Freddy Frenandas</h6>
                                <p className='ms-2' style={{ fontSize: '15px' }}>PhD in IT & Research Coordinator Dept of Information Technology</p>
                            </div>
                        </div>
                    </div>
                    <div className="people py-2 ">
                        <h4 className="text-center">Chairman</h4>
                        <div className="people-content d-flex flex-row">
                            <img src={prof3} width={200} height={200} alt="img" className="people-image" />
                            <div className='people-details d-flex flex-column justify-content-center gap-2 '>
                                <h6 className='ms-2'>Prof. Dr Freddy Frenandas</h6>
                                <p className='ms-2' style={{ fontSize: '15px' }}>PhD in IT & Research Coordinator Dept of Information Technology</p>
                            </div>
                        </div>
                    </div>
                    <div className="people py-2  ">
                        <h4 className="text-center">Vice Principal</h4>
                        <div className="people-content d-flex flex-row">
                            <img src={prof4} width={200} height={200} alt="img" className="people-image" />
                            <div className='people-details d-flex flex-column justify-content-center gap-2'>
                                <h6 className='ms-2'>Prof. Dr Freddy Frenandas</h6>
                                <p className='ms-2' style={{ fontSize: '15px' }}>PhD in IT & Research Coordinator Dept of Information Technology</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}

export default About
