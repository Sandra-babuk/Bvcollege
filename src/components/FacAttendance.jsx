import React, { useState, useEffect } from "react";
import "./facatten.css";
import { createFacultyAttendanceApi, FacultyApi, HodApi } from "../services/allApi";
import { Navigate, useNavigate } from "react-router-dom";

const FacAttendence = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [recordedBy, setRecordedBy] = useState("");
  const [faculties, setFaculties] = useState('');
  const [hod, setHod] = useState([])
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [hodId, setHodId] = useState('');

  const token = localStorage.getItem('access');
  const username = localStorage.getItem('username')
  const navigate = useNavigate()

  // Fetch faculty list
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch HOD details
        // const hodResponse = await HodApi(token);
        // let hodId = null;

        // if (hodResponse.data) {
        //     hodId = hodResponse.data.id; 

        //     // localStorage.setItem('hodId', hodId); 
        //     setHodId(hodId); // Set HOD name in state
        // }

        // setHod(hodResponse?.data || []);

        // Fetch faculty list
        const facultyResponse = await FacultyApi(token);
        setFaculties(facultyResponse?.data || []);

        // Initialize attendance state with faculty details
        const initialAttendance = facultyResponse?.data.map((faculty, index) => ({
          SI_No: index + 1,
          facultyId: faculty.id,
          status: "present",
          recordedBy: hodId  // Use HOD name instead of username state
        }));
        setAttendance(initialAttendance);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
      }
    };

    fetchData();
  }, [token]);


  // Handle status change
  const handleStatusChange = (index, status) => {
    const updatedAttendance = [...attendance];
    updatedAttendance[index].status = status;
    setAttendance(updatedAttendance);
  };
  useEffect(() => {
    const userData = (localStorage.getItem("username"));

    if (userData) {
      setRecordedBy(userData.name);
    }
  }, []);

  // Submit Attendance
  const handleSubmitAttendance = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const attendanceData = attendance.map(item => ({
      faculty_id: item.facultyId,  // Match API field
      attendance_date: selectedDate,
      status: item.status,
      recorded_by: username
    }));

    console.log("Submitting Attendance Data:", attendanceData);

    try {
      const response = await createFacultyAttendanceApi(token, JSON.stringify({ attendance: attendanceData }));

      if (response.status === 201) {
        setSuccess("Attendance submitted successfully!");
        setAttendance(attendance.map(item => ({ ...item, status: "present" })));
      } else {
        setError("Failed to submit attendance.");
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
      setError("An error occurred.");
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="attendance-container">
      <div>
        <h2>Faculty Attendance Sheet</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <div className="filters">

          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />

          <label>
            Recorded By:
            <input type="text" value={username} readOnly />
          </label>
        </div>

        <table>
          <thead>
            <tr>
              <th>SI No.</th>
              <th>Faculty ID</th>
              {/* <th>Faculty Name</th> */}
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((faculty, index) => (
              <tr key={faculty.facultyId}>
                <td>{faculty.SI_No}</td>
                <td>{faculty.facultyId}</td>
                <td>
                  <select
                    value={faculty.status}
                    onChange={(e) => handleStatusChange(index, e.target.value)}
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="submit-btn" onClick={handleSubmitAttendance} disabled={loading}>
          {loading ? "Submitting..." : "Submit Attendance"}
        </button>
        <div className="mt-5 "><button className="btn p-2" onClick={() => navigate("/faculty-attendance-record")}>view faculty attendence record</button></div>

      </div>
    </div>


  );
};

export default FacAttendence;
