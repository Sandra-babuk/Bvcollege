import React, { useEffect, useState } from 'react';
import { RiEdit2Fill } from 'react-icons/ri'; // Edit icon
import { getUserProfileApi } from '../services/allApi'; // API function for fetching profile

const HodProfile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const HodProfile = async () => {
      const token = localStorage.getItem('access'); // Get token from localStorage
      const userId = localStorage.getItem('userId'); // Get the HOD's user ID from localStorage

      if (!token || !userId) {
        setError('No token or user ID found in localStorage.');
        setLoading(false);
        return;
      }

      try {
        const response = await getUserProfileApi(userId, token); 
        console.log(response.data); // Log the entire response to check if 'department' is there

        
        const userData = response.data;
        
        setUserDetails({
          full_name: userData.full_name,
          dob: userData.dob,
          gender: userData.gender,
          email: userData.email,
          phone: userData.phone,
          department: userData.department_name,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching HOD profile:', error);
        setError('Failed to fetch HOD profile data.');
        setLoading(false);
      }
    };

    HodProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="profile mt-2 border py-3 px-3">
      <h2>HOD Profile</h2>
      <div className="d-flex justify-content-end"><RiEdit2Fill /></div> {/* Edit icon */}
      <hr />
      <div className="profile-details d-flex flex-row">
        <div className="col-lg-3">Name</div>:
        <div className="col-lg-5 ms-2">{userDetails.full_name}</div>
      </div>
      <hr />
      <div className="profile-details d-flex flex-row">
        <div className="col-lg-3">DOB</div>:
        <div className="col-lg-5 ms-2">{userDetails.dob}</div>
      </div>
      <hr />
      <div className="profile-details d-flex flex-row">
        <div className="col-lg-3">Gender</div>:
        <div className="col-lg-5 ms-2">{userDetails.gender}</div>
      </div>
      <hr />
      <div className="profile-details d-flex flex-row">
        <div className="col-lg-3">Email</div>:
        <div className="col-lg-5 ms-2">{userDetails.email}</div>
      </div>
      <hr />
      <div className="profile-details d-flex flex-row">
        <div className="col-lg-3">Phone</div>:
        <div className="col-lg-5 ms-2">{userDetails.phone}</div>
      </div>
      <hr />
      {/* <div className="profile-details d-flex flex-row">
        <div className="col-lg-3">Department</div>:
        <div className="col-lg-5 ms-2">{userDetails.department_name}</div>
      </div> */}
    </div>
  );
};

export default HodProfile;
