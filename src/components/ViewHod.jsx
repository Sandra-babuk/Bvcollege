import React, { useState, useEffect } from 'react';
import { HodApi, deleteHodApi, editHodApi } from '../services/allApi';
import './viewHod.css';
import { useNavigate } from 'react-router-dom';

const ViewHod = () => {
  const [hods, setHods] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    AllHods();
  }, []);

  const AllHods = async () => {
    const token = localStorage.getItem('access');
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }

    try {
      const response = await HodApi(token);
      console.log('Fetched HODs:', response.data);
      if (Array.isArray(response.data)) {
        setHods(response.data);
      } else {
        console.error('Expected an array but got:', response.data);
      }
    } catch (error) {
      console.error('Error fetching HODs:', error);
    }
  };

  const handleEdit = (hod) => {
    console.log(`Edit HOD with ID: ${hod.id}`);
    navigate('/edit-hod', { state: { hod } });
  };

  const handleDelete = async (hodId) => {
    const token = localStorage.getItem('access');
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this HOD?");
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await deleteHodApi(hodId, token);
      if (response.status === 204) {
        console.log(`HOD with ID: ${hodId} deleted successfully`);
        setHods(hods.filter(hod => hod.id !== hodId));
      } else {
        console.error('Failed to delete HOD');
      }
    } catch (error) {
      console.error('Error deleting HOD:', error);
    }
  };

  return (
    <div className="view-hod">
      <h1 className="title">Heads of Departments</h1>
      <ul className="hod-list">
        {hods.length > 0 ? (
          hods.map((hod) => (
            <li key={hod.id} className="hod-item">
              <div className="hod-details">
                <h2 className="hod-name">{hod.full_name}</h2>
                <p className="hod-email">Email: {hod.email}</p>
                <p className="hod-phone">Phone: {hod.phone}</p>
                <p className="hod-department">Department: {hod.department}</p>
              </div>
              <div className="hod-actions">
                <i
                  className="fa fa-edit edit-icon"
                  onClick={() => handleEdit(hod)}
                ></i>
                <i
                  className="fa fa-trash delete-icon"
                  onClick={() => handleDelete(hod.id)}
                ></i>
              </div>
            </li>
          ))
        ) : (
          <p>No HODs found.</p>
        )}
      </ul>
    </div>
  );
};

export default ViewHod;
