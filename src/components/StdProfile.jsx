import React, { useEffect, useState } from 'react';
import { RiEdit2Fill } from 'react-icons/ri';
import { getUserProfileApi } from '../services/allApi';

const StdProfile = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const stdProfile = async () => {
            const token = localStorage.getItem('access');
            const userId = localStorage.getItem('userId');

            console.log('Token:', token);
            console.log('User ID:', userId);

            if (!token || !userId) {
                setError('No token or user ID found in local storage.');
                setLoading(false);
                return;
            }

            try {
                const response = await getUserProfileApi(userId, token);
                console.log('Response data:', response);
                const userData = response.data;
                setUserDetails({
                    id: userData.id,
                    full_name: userData.full_name,
                    batch: userData.batch,
                    department: userData.department,
                    course: userData.course,
                    dob: userData.dob,
                    gender: userData.gender,
                    email: userData.email,
                    phone: userData.phone,
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user profile:', error.response ? error.response.data : error.message);
                setError('Failed to fetch user profile data.');
                setLoading(false);
            }
        };
        stdProfile();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="profile mt-2 border py-3 px-3">
            <h2>Student Profile</h2>
            <div className="d-flex justify-content-end"><RiEdit2Fill /></div>
            <hr />
            <div className="profile-details d-flex flex-row ">
                <div className="col-lg-3">Student Id </div>:
                <div className="col-lg-5 ms-2">{userDetails.id}</div>
            </div>
            <hr />
            <div className="profile-details d-flex flex-row ">
                <div className="col-lg-3">Student Name </div>:
                <div className="col-lg-5 ms-2">{userDetails.full_name}</div>
            </div>
            <hr />
            <div className="profile-details d-flex flex-row ">
                <div className="col-lg-3">Batch </div>:
                <div className="col-lg-5 ms-2">{userDetails.batch}</div>
            </div>
            <hr />
            <div className="profile-details d-flex flex-row ">
                <div className="col-lg-3">Department </div>:
                <div className="col-lg-5 ms-2">{userDetails.department}</div>
            </div>
            <hr />
            <div className="profile-details d-flex flex-row ">
                <div className="col-lg-3">Course </div>:
                <div className="col-lg-5 ms-2">{userDetails.course}</div>
            </div>
            <hr />
            <div className="profile-details d-flex flex-row ">
                <div className="col-lg-3">DOB </div>:
                <div className="col-lg-5 ms-2">{userDetails.dob}</div>
            </div>
            <hr />
            <div className="profile-details d-flex flex-row ">
                <div className="col-lg-3">Gender </div>:
                <div className="col-lg-5 ms-2">{userDetails.gender}</div>
            </div>
            <hr />
            <div className="profile-details d-flex flex-row ">
                <div className="col-lg-3">Email </div>:
                <div className="col-lg-5 ms-2">{userDetails.email}</div>
            </div>
            <hr />
            <div className="profile-details d-flex flex-row ">
                <div className="col-lg-3">Phone </div>:
                <div className="col-lg-5 ms-2">{userDetails.phone}</div>
            </div>
        </div>
    );
};

export default StdProfile;
