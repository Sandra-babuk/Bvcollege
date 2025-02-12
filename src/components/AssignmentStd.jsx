import React, { useEffect, useState } from 'react';
import './assign.css';
import { MdDelete } from "react-icons/md";
import { IoIosCloudUpload } from "react-icons/io";
import { FaEye } from "react-icons/fa";
import { editAssignmentApi, getAssignmentApi } from '../services/allApi';

const AssignmentStd = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [fileAdded, setFileAdded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  useEffect(() => {
    const getAssignmentTopic = async () => {
      try {
        const response = await getAssignmentApi(token);
        if (response?.data && Array.isArray(response.data)) {
          setAssignments(response.data);
        } else {
          setError('Unexpected response format');
          console.error('Unexpected response format:', response);
        }
      } catch (error) {
        console.log("error fetching assignments", error);
        setError('Failed to fetch assignments. Please check your authorization token.');
      }
    };
    getAssignmentTopic();
  }, [token, fileAdded]);

  const handleUpload = (file) => {
    if (file) {
      console.log('Uploading:', file);
      setFileAdded(true);
    }
  };

  const handleDelete = (id) => {
    console.log('Deleting:', id);
  };

  const handleViewSubmissions = () => {
    console.log('Viewing submissions');
  };

  return (
    <div className="assignment-container">
      <div className="table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th>SI No</th>
              <th>Subject</th>
              <th>Topic</th>
              <th>Deadline</th>
              <th>Action</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((A) => (
              <tr key={A.id}>
                <td>{A.id}</td>
                <td>OOPs</td>
                <td>{A.title}</td>
                <td>{A.deadline}</td>
                <td>
                  {role === 'student' ? (
                    <>
                      <button
                        className={`action-btn upload-btn ${fileAdded ? 'added' : ''}`}
                        onClick={() => document.getElementById('fileInput').click()}
                      >
                        <IoIosCloudUpload className="icon" /> {fileAdded ? 'Added' : 'Upload'}
                      </button>
                      <input
                        type="file"
                        id="fileInput"
                        style={{ display: 'none' }}
                        onChange={(e) => handleUpload(e.target.files[0])}
                      />
                    </>
                  ) : (
                    <button className="action-btn view-btn" onClick={handleViewSubmissions}>
                      <FaEye className="icon" /> View Submissions
                    </button>
                  )}
                </td>
                <td>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(A.id)}>
                    <MdDelete className="icon" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignmentStd;
