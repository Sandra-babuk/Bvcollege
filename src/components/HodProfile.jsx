import React from 'react'
import { RiEdit2Fill } from 'react-icons/ri'
// import './hodpofile.css'

const HodProfile = () => {
  return (
    <div>
           <div className="profile mt-2 border py-3 px-3">
                            <h2>PROFILE</h2>
                            <div className='d-flex justify-content-end'><RiEdit2Fill/></div>

                            <hr />
                            <div className='profile-details d-flex flex-row '>
                                <div className='col-lg-3'>HOD Id </div>
                                :
                                <div className='col-lg-5 ms-2'> 01</div>
                            </div>
                            <hr />
                            <div className='profile-details d-flex flex-row '>
                                <div className='col-lg-3'>HOD Name </div>
                                :
                                <div className='col-lg-5 ms-2'> Aleena</div>
                            </div>
                            <hr />
                           
                            <div className='profile-details d-flex flex-row '>
                                <div className='col-lg-3'>Department </div>
                                :
                                <div className='col-lg-5 ms-2'> Btech</div>
                            </div>
                            <hr />
                            <div className='profile-details d-flex flex-row '>
                                <div className='col-lg-3'> DOB </div>
                                :
                                <div className='col-lg-5 ms-2'> 12/3/2000</div>
                            </div>
                            <hr />
                            <div className='profile-details d-flex flex-row '>
                                <div className='col-lg-3'> Gender </div>
                                :
                                <div className='col-lg-5 ms-2'> Female</div>
                            </div>
                            <hr />
                            <div className='profile-details d-flex flex-row '>
                                <div className='col-lg-3'> Email </div>
                                :
                                <div className='col-lg-5 ms-2'> John@gmail.com</div>
                            </div>
                            <hr />
                            <div className='profile-details d-flex flex-row '>
                                <div className='col-lg-3'> Phone </div>
                                :
                                <div className='col-lg-5 ms-2'> 9088822002</div>
                            </div>


                        </div>
    </div>
  )
}

export default HodProfile