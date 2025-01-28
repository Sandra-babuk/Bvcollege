import React, { useState, useEffect } from 'react';
import { StudentApi, deleteStudentApi } from '../services/allApi'; 
import './viewStudent.css'; 
import { useNavigate } from 'react-router-dom';

const ViewStudent = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const token = localStorage.getItem('access'); 
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }

    try {
      const response = await StudentApi(token); 
      console.log('Fetched students:', response.data);
      if (Array.isArray(response.data)) {
        setStudents(response.data);
      } else {
        console.error('Expected an array but got:', response.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleEdit = (student) => {
    console.log(`Edit student with ID: ${student.id}`);
    navigate('/edit-student', { state: { student } }); 
  };

  const handleDelete = async (studentId) => {
    const token = localStorage.getItem('access'); 
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this student?");
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await deleteStudentApi(studentId, token);
      if (response.status === 204) {
        console.log(`Student with ID: ${studentId} deleted successfully`);
        setStudents(students.filter(student => student.id !== studentId)); 
      } else {
        console.error('Failed to delete student');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  return (
    <div className="view-student">
      <h1 className="title">Students</h1>
      <table className="student-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Date of Birth</th>
            <th>Gender</th>
            <th>Department</th>
            <th>Course</th>
            <th>Batch</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.full_name}</td>
                <td>{student.email}</td>
                <td>{student.phone}</td>
                <td>{student.dob}</td>
                <td>{student.gender}</td>
                <td>{student.department}</td>
                <td>{student.course}</td>
                <td>{student.batch}</td>
                <td>{student.role}</td>
                <td className="student-actions">
                  <i
                    className="fa fa-edit edit-icon"
                    onClick={() => handleEdit(student)}
                  ></i>
                  <i
                    className="fa fa-trash delete-icon"
                    onClick={() => handleDelete(student.id)}
                  ></i>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11">No students found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewStudent;
