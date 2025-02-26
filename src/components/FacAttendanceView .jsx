import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AtendenceRecord.css";
import { getBatchApi, getSubjectApi, StudentApi } from "../services/allApi";

const FacAttendanceView = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState("");
    const [attendanceStatus, setAttendanceStatus] = useState("present");


    const token = localStorage.getItem('access');

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const [batchResponse, subjectResponse, studentResponse] = await Promise.all([
    //                 getBatchApi(token),
    //                 getSubjectApi(token),
    //                 StudentApi(token)
    //             ]);

    //             setBatches(batchResponse?.data || []);
    //             setSubjects(subjectResponse?.data || []);
    //             setStudents(studentResponse?.data || [])
    //         } catch (err) {
    //             console.error("Error fetching data:", err);
    //             setError("Failed to load data.");
    //         }
    //     };

    //     fetchData();
    // }, [token]);

    // useEffect(() => {
    //     if (batch) {
    //         setFilteredStudents(students.filter(student => student.batch.toString() === batch));
    //     } else {
    //         setFilteredStudents(students);
    //     }
    // }, [batch, students]);

    // Fetch attendancerecords
    // const fetchAttendance = async () => {
    //     setLoading(true);
    //     setError(null);

   
    //     try {
    //         const response = await axios.get("http://127.0.0.1:8000/api/faculty-attendance-reports/", {
    //             headers: { Authorization: Bearer ${token} }
    //         });

    //         if (Array.isArray(response.data)) {
    //             setStudents(response.data);
    //         } else {
    //             setStudents([]);
    //             setError("Unexpected response format.");
    //         }
    //     } catch (err) {
    //         console.error("Error fetching attendance:", err);
    //         setError("Failed to fetch attendance records.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

 
    return (
        <div className="attendance-view-container">
            <h2>View Attendance Records</h2>
            {error && <p className="error-message">{error}</p>}
    
            <table>
                <thead>
                    <tr>
                        <th> ID</th>
                        <th> Faculty</th>
                        <th>Attendence</th>
                        <th>Status</th>
                        <th>created_at</th>
                        <th >updated_at</th>
                    </tr>
                </thead>
                <tbody>
              
                            <tr >
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td ></td>
                            </tr>
                     
                </tbody>
            </table>

        </div>
    );
};

export default FacAttendanceView;
