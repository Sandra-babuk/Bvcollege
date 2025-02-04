import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Coursedes.css";

function CourseDescription() {
  const location = useLocation();
  const { department } = location.state || {}; // Access passed state

  if (!department) {
    return <div>No department details available.</div>;
  }

  return (
    <>
      <div className="cd-main my-3">
        <div className="ms-auto">
            <Link className="link-back my-5" to='/home'>Back</Link>
        </div>
        <div className="c-description shadow">
          <div className="c-description-head justify-content-center align-items-center d-flex">
            <h2>{department.department_name}</h2>
          </div>
          <div className="cd-para">
            <p>
            {department.description}
            </p>
          </div>
          <div className="batch-button">
            <div>
              
            </div>
            <div className="btech">
              <b>B.tech</b>
            </div>
            <div className="mtech">
              <b>M.tech</b>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseDescription;
