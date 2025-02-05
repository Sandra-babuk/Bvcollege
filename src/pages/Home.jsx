import React from 'react';
import Header from '../components/Header';
import './Home.css';
import About from '../components/About';
import logo from '../assets/logo.png';

const Home = () => {
  return (
    <>
      <div className="landingPage">
        <Header />
        <div className='d-flex flex-column justify-content-center align-items-center ' style={{ height: '70%' }}>
          <div className="logo-container pt-auto">
            <img
              alt=""
              src={logo}
              width="120"
              height="120"
              className="d-inline-block align-top "
              style={{ borderRadius: '70px' }}
            />
          </div>
          <div>
            <h1 className='text-light'>Get Ready to Explore now!</h1>
            <p className='text-center text-light'>BV College Kakkanad, Ernamkulam. 989822882</p>
          </div>
        </div>
      </div>
      <About />

    </>
  )
}

export default Home;
