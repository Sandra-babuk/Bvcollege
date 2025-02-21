import React, { useState, useEffect } from "react";
import "./stdattend.css";
import { createStudentAttendanceApi, getBatchApi, getSubjectApi, StudentApi } from "../services/allApi";

const StdAttendance = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [batch, setBatch] = useState("");
    const [subject, setSubject] = useState("");
    const [date, setDate] = useState("");
    const [students, setStudents] = useState([]);
    const [attendence, setAttendence] = useState('')
    const [batches, setBatches] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [filteredStudents, setFilteredStudents] = useState([]);

    const token = localStorage.getItem('access');

    // Fetch Batches and Subjects
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [batchResponse, subjectResponse, studentResponse] = await Promise.all([
                    getBatchApi(token),
                    getSubjectApi(token),
                    StudentApi(token)
                ]);

                setBatches(batchResponse?.data || []);
                setSubjects(subjectResponse?.data || []);
                setStudents(studentResponse?.data || [])
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data.");
            }
        };

        fetchData();
    }, [token]);
    useEffect(() => {
        if (batch) {
            setFilteredStudents(students.filter(student => student.batch.toString() === batch));
        } else {
            setFilteredStudents(students);
        }
    }, [batch, students]);




    // Handle Status Change
    const handleStatusChange = (index, status) => {
        const updatedRecords = [...attendanceRecords];
        updatedRecords[index] = { ...updatedRecords[index], status };
        setAttendanceRecords(updatedRecords);
    };

    // Submit Attendance Updates
    const submitAttendance = async () => {
      setLoading(true);
      setError(null);
      setSuccess(false);
  
      if (!batch || !subject || !date) {
          setError("Batch, subject, and date are required.");
          setLoading(false);
          return;
      }
  
      // Get current timestamp
      const updatedAt = new Date().toISOString();
  
      try {
          const attendanceData = filteredStudents.map(student => ({
              student_id: student.id,
              status: student.status || "present", // Default to present if not selected
              batch,
              subject,
              date,
              updated_at: updatedAt,
          }));
  
          const response = await createStudentAttendanceApi(token, attendanceData);
          setAttendence(response.data);
          setSuccess(true);
      } catch (err) {
          setError("Failed to submit attendance. Please try again.");
          console.error(err);
      } finally {
          setLoading(false);
      }
  };
  
    
    

    return (
        <div className="attendance-container">
            <h2>Attendance Sheet</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">Attendance submitted successfully!</p>}
            <div className="filters">
                <select value={batch} onChange={(e) => setBatch(e.target.value)}>
                    <option value="">Select Batch</option>
                    {batches.map((b) => (
                        <option key={b.id} value={b.id}>{b.batch_name}</option>
                    ))}
                </select>
                <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                    <option value="">Select Subject</option>
                    {subjects.map((sub) => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                </select>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Attendance ID</th>
                        <th>Student ID</th>
                        <th>Student Name</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filteredStudents.map((student, index) => (
                            <tr key={student.id}>
                                <td>{index + 1}</td>
                                <td>{student.id}</td>
                                <td>{student.full_name}</td>
                                <td>
                                    <select
                                        value={student.status}
                                        onChange={(e) => handleStatusChange(index, e.target.value)}
                                    >
                                        <option value="present">Present</option>
                                        <option value="absent">Absent</option>
                                    </select>
                                </td>

                            </tr>))
                    }

                </tbody>
            </table>

            <button
                className="submit-btn"
                onClick={submitAttendance}
            // disabled={loading || attendanceRecords.length === 0}
            >
                {loading ? "Submitting..." : "Submit Attendance"}
            </button>
        </div>
    );
};

export default StdAttendance;
