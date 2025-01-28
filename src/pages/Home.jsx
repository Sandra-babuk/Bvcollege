import React, { useEffect, useState } from "react";
import "./home.css";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    sessionStorage.clear();
  };

  const [uniDetail, setUniDetail] = useState([
    {
      icon: <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPQ0uNyu5bhFP72eISTo_6zfxowBADsY61Rw&s" alt="Chairman" />,
      p1: " Prof.Dr Freddy Frenandas",
      p2: "Chairman",
      p3: "Phd in IT  & Research Coordinator Dept of Information Technology ",
    },
    {
      icon: <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6J5Bsi7UrlOsw-9agdJ8ekj3SqLFypPmF65EHjDBri92JKDk1alQUK6ean1BzmjF9a7w&usqp=CAU" alt="Principal" />,
      p1: "Prof. Dr Sanjna Mathew",
      p2: "Principal",
      p3: "Phd in Structural Engineering (Mtech)",
    },
    {
      icon: <img src="https://www.shcollege.ac.in/wp-content/uploads/Images/Staff/Teaching/Jeleeta-Rose-C-N.png" alt="Vice Principal" />,
      p1: "Prof.Rhithika Nambiyar",
      p2: "Vice Principal & HOD of Civil",
      p3: "Mtech (Civil) & Phd scholar in Civil",
    },
  ]);

  useEffect(() => {
    // First navigate to the home page
    navigate("/home");
    // Then navigate to the role-based dashboard after a short delay
    const timer = setTimeout(() => {
      if (role === "student") {
        navigate("/studentDash");
      } 
      else if(role === "faculty") {
        navigate("/teacherDash");
      }else if (role === "hod") {
        navigate("/hodDash");
      } 
    }, 55000); // Delay of 1 second

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, [role, navigate]);
  return (
    <>
      <div className="landing-page">
        <div className="nav-bar d-flex justify-content-between">
          <div className="logo ms-5">
            <p>BV College</p>
          </div>
          <div className="me-5">
            <div className="d-flex text-white ">
              <button className="cc me-2 btn btn-outline-success">
                <i className="fa-solid fa-user me-1"></i>
                {username}
              </button>
              {role === "student" && (
                <Link to="/studentDash" style={{ textDecoration: "none" }}>
                  <button className="sign-in-btn">Student Dashboard</button>
                </Link>
              )}
              {role === "hod" && (
                <Link to="/hodDash" style={{ textDecoration: "none" }}>
                  <button className="sign-in-btn">HOD Dashboard</button>
                </Link>
              )}
              {role === "faculty" && (
                <Link to="/teacherDash" style={{ textDecoration: "none" }}>
                  <button className="sign-in-btn">Faculty Dashboard</button>
                </Link>
              )}
              <Link to="/" style={{ textDecoration: "none" }}>
                <button className="logout btn btn-danger ms-2" onClick={handleLogout}>
                  Logout
                  <i className="fa-solid fa-right-from-bracket ms-1"></i>
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="land-text">
          <p>
            Get Ready to <span className="expl">Explore</span> now!{" "}
          </p>
          <p>Empowering Minds, Shaping Futures.</p>
        </div>
      </div>
      <div className="uni-content">
        <p>
          Explore endless opportunities and shape your future with BV College.
          Discover our top-ranked programs, connect with a vibrant community of learners, and embark on a journey of academic excellence. 
          With diverse fields of study, expert faculty, and state-of-the-art resources, we provide everything you need to achieve your dreams. 
          Begin your journey with us today and find your perfect place to thrive.
        </p>
        <button>GET STARTED</button>
      </div>
      <div className="uni-detail">
        {uniDetail.map((uni, index) => (
          <div className="detail-box" key={index}>
            {uni.icon}
            <div className="detail-box-text">
              <p className="ms-1">{uni.p1}</p>
              <p className="ms-2">{uni.p2}</p>
              <p className="ms-2">{uni.p3}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Home;
