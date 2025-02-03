import React from 'react'
import './notes.css'
import pdf from '../assets/pdf.png'
import { MdOutlineSimCardDownload } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";

const Notes = () => {
  return (
    <div className='notes-container'>
        <div className="row d-flex p-2 gap-1">
            <div className="col-lg-3 note-card">
                <div className='pdf '>
                  <div><img src={pdf} style={{width:'100px', height:'110px'}} alt="" /></div>
                </div>
                <div className='d-flex flex-column'>
                  <h5>DATA SCIENCE</h5>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit aut assumenda dicta dolor repudiandae modi in accusamus voluptate </p>
                  <div className='buttons d-flex ' >
                    {/* <FaRegEye className='w-100'/> <MdOutlineSimCardDownload className='w-100'/> */}
                    <button className='save-note px-3 py-2'>save</button>
                    <button className='view-note px-3 '><FaRegEye className='w-100'/></button>
                  </div>
                </div>
                
            </div>
            <div className="col-lg-3 note-card">
                <div className='pdf '>
                  <div><img src={pdf} style={{width:'100px', height:'110px'}} alt="" /></div>
                </div>
                <div className='d-flex flex-column'>
                  <h5>DATA SCIENCE</h5>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit aut assumenda dicta dolor repudiandae modi in accusamus voluptate </p>
                  <div className='buttons d-flex ' >
                    {/* <FaRegEye className='w-100'/> <MdOutlineSimCardDownload className='w-100'/> */}
                    <button className='save-note px-3 py-2'>save</button>
                    <button className='view-note px-3 '><FaRegEye className='w-100'/></button>
                  </div>
                </div>
                
            </div>
            <div className="col-lg-3 note-card">
                <div className='pdf '>
                  <div><img src={pdf} style={{width:'100px', height:'110px'}} alt="" /></div>
                </div>
                <div className='d-flex flex-column'>
                  <h5>DATA SCIENCE</h5>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit aut assumenda dicta dolor repudiandae modi in accusamus voluptate </p>
                  <div className='buttons d-flex ' >
                    {/* <FaRegEye className='w-100'/> <MdOutlineSimCardDownload className='w-100'/> */}
                    <button className='save-note px-3 py-2'>save</button>
                    <button className='view-note px-3 '><FaRegEye className='w-100'/></button>
                  </div>
                </div>
                
            </div>
            <div className="col-lg-3 note-card">
                <div className='pdf '>
                  <div><img src={pdf} style={{width:'100px', height:'110px'}} alt="" /></div>
                </div>
                <div className='d-flex flex-column'>
                  <h5>DATA SCIENCE</h5>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit aut assumenda dicta dolor repudiandae modi in accusamus voluptate </p>
                  <div className='buttons d-flex ' >
                    {/* <FaRegEye className='w-100'/> <MdOutlineSimCardDownload className='w-100'/> */}
                    <button className='save-note px-3 py-2'>save</button>
                    <button className='view-note px-3 '><FaRegEye className='w-100'/></button>
                  </div>
                </div>
                
            </div>
         
        </div>
    </div>
  )
}

export default Notes