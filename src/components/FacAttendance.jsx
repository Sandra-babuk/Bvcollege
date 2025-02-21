import React, { useEffect, useState } from 'react';
import { FacultyApi, getFacultyAttendanceApi, createFacultyAttendanceApi, updateFacultyAttendanceApi } from '../services/allApi';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Facatten.css';

const FacAttendance = () => {
  const [token, setToken] = useState(localStorage.getItem('access'));
  const [facultyList, setFacultyList] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [currentWeek, setCurrentWeek] = useState(new Date());

  useEffect(() => {
    allFacultyList();
    fetchAttendanceRecords();
  }, [token, currentWeek]);

  const allFacultyList = async () => {
    try {
      const response = await FacultyApi(token);
      if (response?.status === 200) {
        setFacultyList(response.data);
      } else {
        toast.error("Failed to fetch faculty list");
      }
    } catch (error) {
      console.error("Error fetching faculty list:", error);
      toast.error("Error fetching faculty list");
    }
  };

  const fetchAttendanceRecords = async () => {
    try {
      const response = await getFacultyAttendanceApi(token);
      if (response?.status === 200) {
        setAttendance(response.data.reduce((acc, record) => {
          acc[record.facultyId] = acc[record.facultyId] || {};
          acc[record.facultyId][record.date] = record.status;
          return acc;
        }, {}));
      } else {
        toast.error("Failed to fetch attendance records");
      }
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      toast.error("Error fetching attendance records");
    }
  };

  const getWeekDates = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1);
    return Array.from({ length: 6 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day.toISOString().split('T')[0];
    });
  };

  const weekDates = getWeekDates(currentWeek);

  const markAttendance = async (facultyId, date, status) => {
    const existingRecord = attendance[facultyId]?.[date];
    try {
      let response;
      if (existingRecord && existingRecord.id) {
        response = await updateFacultyAttendanceApi(token, existingRecord.id, { facultyId, date, status });
      } else {
        response = await createFacultyAttendanceApi(token, { facultyId, date, status });
      }

      if (response?.status === 200 || response?.status === 201) {
        toast.success(`Attendance ${existingRecord ? 'updated' : 'marked'} for ${facultyId} on ${date}`);
        setAttendance((prevAttendance) => ({
          ...prevAttendance,
          [facultyId]: {
            ...prevAttendance[facultyId],
            [date]: status,
          },
        }));
      } else if (response?.status === 404) {
        toast.error("Attendance record not found");
      } else {
        toast.error("Error marking attendance");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast.error("Error marking attendance");
    }
  };

  const changeWeek = (direction) => {
    setCurrentWeek((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + (direction === "next" ? 7 : -7));
      return newDate;
    });
  };

  return (
    <div className="attendance-container">
      <ToastContainer />
      <h1>Faculty Attendance</h1>
      <div className="week-navigation">
        <button onClick={() => changeWeek("prev")}><FaArrowLeft /> Previous</button>
        <span>Week of {weekDates[0]} - {weekDates[5]}</span>
        <button onClick={() => changeWeek("next")}>Next <FaArrowRight /></button>
      </div>
      <table className="styled-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Faculty Name</th>
            <th>Department</th>
            {weekDates.map((date) => (
              <th key={date}>{date}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {facultyList.map((faculty, index) => (
            <tr key={faculty.id}>
              <td>{index + 1}</td>
              <td>{faculty.full_name}</td>
              <td>{faculty.department}</td>
              {weekDates.map((date) => (
                <td key={`${faculty.id}-${date}`}>
                  <button 
                    className={`status-btn ${attendance[faculty.id]?.[date] === 'Present' ? 'present' : ''}`} 
                    onClick={() => markAttendance(faculty.id, date, 'Present')}
                  >
                    P
                  </button>
                  <button 
                    className={`status-btn ${attendance[faculty.id]?.[date] === 'Absent' ? 'absent' : ''}`} 
                    onClick={() => markAttendance(faculty.id, date, 'Absent')}
                  >
                    A
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FacAttendance;
