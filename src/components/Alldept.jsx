import React, { useState, useEffect } from "react";
import "./alldept.css";
import { departmentApi } from "../services/allApi";
import { Link } from "react-router-dom";

const serverUrl = 'http://localhost:8000';

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const AllDepartments = async () => {
      try {
        const response = await departmentApi();
        if (response.status === 200 && Array.isArray(response.data)) {
          setDepartments(response.data); 
        } else {
          setError("Failed to fetch departments data.");
        }
      } catch (err) {
        setError("Error fetching departments: " + err.message);
        console.error("Error fetching departments:", err);
      } finally {
        setLoading(false);
      }
    };

    AllDepartments();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!departments || departments.length === 0) {
    return <div>No departments available.</div>;
  }

  return (
    <>
      <div className="head-course-text my-5">
        <p className="text-center fs-4 mt-4">All Departments</p>
      </div>

      <div className="allcourse-box">
        {departments.map((department, index) => {
          const imageUrl = department.photo;
          return (
            <div className="alldept-card" key={index}>
              <div className="allimage-container">
                <img
                  className="alldept-img"
                  src={`${serverUrl}${imageUrl}`}
                  alt={department.department_name}
                />
                <div className="dep-title">
                  <p className="cp1">{department.department_name}</p>
                  <Link to={{
                    pathname: "/coursedescription" }} state={{ department }} style={{ textDecoration: 'none' }}> 
                    <p className="text-warning">
                      See Course Guide <i className="fa-solid fa-arrow-right"></i>
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Departments;
