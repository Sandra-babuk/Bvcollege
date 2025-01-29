import React from 'react'
import './events.css'
import seminar from '../assets/seminar.jpg'

const Events = () => {
  return (
    // notifications only
    <section>
        <div className='container my-5'>
           <div className='head my-5'>
                <h2 className='text-center  '>Upcoming Events</h2>
                <hr />
           </div>
            <div className='d-flex flex-column gap-2'>
                <div className='cards d-flex justify-content-center align-items-center gap-5'>
                    {/* date */}
                    <div className='btn p-3'>
                        <h2>07 <br />
                            Jan
                        </h2>
                    </div>
                    {/* event */}
                    <div className='flex-column'>
                        <h5>Seminar </h5>
                        <p style={{fontSize:'15px'}}>Venue</p>
                        <p  style={{fontSize:'12px',width:'300px'}}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur dignissimos similique earum maiores incidunt neque unde vitae, </p>
                    </div>
                    {/* pic */}
                    <div>
                        <img src={seminar}
                        width={210}
                        height={130} alt="" />
                    </div>

                </div>
                <div className='cards d-flex justify-content-center align-items-center gap-5'>
                    {/* date */}
                    <div className='btn p-3'>
                        <h2>07 <br />
                            Jan
                        </h2>
                    </div>
                    {/* event */}
                    <div className='flex-column'>
                        <h5>Seminar </h5>
                        <p style={{fontSize:'15px'}}>Venue</p>
                        <p  style={{fontSize:'12px',width:'300px'}}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur dignissimos similique earum maiores incidunt neque unde vitae, </p>
                    </div>
                    {/* pic */}
                    <div>
                        <img src={seminar}
                        width={210}
                        height={130} alt="" />
                    </div>

                </div>
                <div className='cards d-flex justify-content-center align-items-center gap-5'>
                    {/* date */}
                    <div className='btn p-3'>
                        <h2>07 <br />
                            Jan
                        </h2>
                    </div>
                    {/* event */}
                    <div className='flex-column'>
                        <h5>Seminar </h5>
                        <p style={{fontSize:'15px'}}>Venue</p>
                        <p  style={{fontSize:'12px',width:'300px'}}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur dignissimos similique earum maiores incidunt neque unde vitae, </p>
                    </div>
                    {/* pic */}
                    <div>
                        <img src={seminar}
                        width={210}
                        height={130} alt="" />
                    </div>

                </div>
            </div>

        </div>
    </section>
  )
}

export default Events
