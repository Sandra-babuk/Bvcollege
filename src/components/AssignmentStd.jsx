import React, { useState } from 'react';
import './assign.css';
import { MdDelete } from "react-icons/md";
import { IoIosCloudUpload } from "react-icons/io";
import { FaDownload } from "react-icons/fa";
import { Button, Modal } from 'react-bootstrap';

const AssignmentStd = () => {
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleOpenModal = () => setShowModal(true);


  const handleUpload = (file) => {
    console.log('Uploading:', file);
  };

  const handleDelete = (id) => {
    console.log('Deleting:', id);
  };

  return (
    <div className="assignment-container">

      {/* Assignment Table */}
      <div className="table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th>SI No</th>
              <th>Subject</th>
              <th>Topic</th>
              <th>Submit</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>OOPs</td>
              <td>Data Structure Assignment</td>
              <td>
                <button className="action-btn upload-btn" onClick={() => document.getElementById('fileInput').click()}>
                  <IoIosCloudUpload className="icon" /> Upload
                </button>
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: 'none' }}
                  onChange={(e) => handleUpload(e.target.files[0])}
                />
              </td>
              <td>
                <button className="action-btn delete-btn" onClick={() => handleDelete('item-id')}>
                  <MdDelete className="icon" /> Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default AssignmentStd;