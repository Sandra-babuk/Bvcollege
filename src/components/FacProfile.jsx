import React, { useEffect, useState } from 'react';
import { RiEdit2Fill } from 'react-icons/ri';
import { getUserProfileApi } from '../services/allApi'; 

const FacProfile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const facProfile = async () => {
      const token = localStorage.getItem('access'); 
      const userId = localStorage.getItem('userId'); 
      if (!token || !userId) {
        setError('No token or user ID found in localStorage.');
        setLoading(false);
        return;
      }

      try {
        const response = await getUserProfileApi(userId, token); 
        console.log(response.data); 

        const userData = response.data;
        setUserDetails({
          id: userData.id,
          full_name: userData.full_name,
          department: userData.department_name,
          dob: userData.dob,
          gender: userData.gender,
          email: userData.email,
          phone: userData.phone,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to fetch user profile data.');
        setLoading(false);
      }
    };

    facProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className="profile mt-2 border py-3 px-3">
        <h2>USER PROFILE</h2>
        <div className='d-flex justify-content-end'><RiEdit2Fill /></div>
        <hr />
        <div className='profile-details d-flex flex-row '>
          <div className='col-lg-3'>ID </div>:
          <div className='col-lg-5 ms-2'>{userDetails.id}</div>
        </div>
        <hr />
        <div className='profile-details d-flex flex-row '>
          <div className='col-lg-3'>Name </div>:
          <div className='col-lg-5 ms-2'>{userDetails.full_name}</div>
        </div>
        <hr />
        {/* <div className='profile-details d-flex flex-row '>
          <div className='col-lg-3'>Department </div>:
          <div className='col-lg-5 ms-2'>{userDetails.department_name}</div>
        </div> */}
        {/* <hr /> */}
        <div className='profile-details d-flex flex-row '>
          <div className='col-lg-3'>DOB </div>:
          <div className='col-lg-5 ms-2'>{userDetails.dob}</div>
        </div>
        <hr />
        <div className='profile-details d-flex flex-row '>
          <div className='col-lg-3'>Gender </div>:
          <div className='col-lg-5 ms-2'>{userDetails.gender}</div>
        </div>
        <hr />
        <div className='profile-details d-flex flex-row '>
          <div className='col-lg-3'>Email </div>:
          <div className='col-lg-5 ms-2'>{userDetails.email}</div>
        </div>
        <hr />
        <div className='profile-details d-flex flex-row '>
          <div className='col-lg-3'>Phone </div>:
          <div className='col-lg-5 ms-2'>{userDetails.phone}</div>
        </div>
      </div>
    </div>
  );
};

export default FacProfile;
