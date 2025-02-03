import React, { useState } from 'react';
import It from '../assets/it.jpg';
import commerce from '../assets/commerce.png';
// import engineering from '../assets/engineering.webp'; // Uncomment this line
import './dept.css'

const Departments = () => {
  const departments = [
    { title: "Department of Computer", image: It },
    // { title: "Department of Engineering", image: engineering },
    { title: "Department of Commerce", image: commerce }
  ];

  return (
    <section className='container'>
      <div className='d-flex gap-2'>
        {departments.map((dept, index) => (
          <div key={index} className="dept-card">
            <div className='image-container'>
              <img src={dept.image} width={250} height={200} alt={dept.title} className='dept-img' />
              <div className='dept-title'>
                <h6>{dept.title}</h6>
                <a href="#" className='text-light'>View Details</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Departments;
