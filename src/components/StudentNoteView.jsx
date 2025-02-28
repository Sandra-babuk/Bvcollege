import React, { useEffect, useState } from 'react';
import { getStudentNotesByCourse, getCoursesApi, getSubjectApi, FacultyApi, StudentApi } from '../services/allApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './studentnote.css';

const StudentNoteView = () => {
  const [notes, setNotes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [courseId, setCourseId] = useState('');
  const [students, setStudents] = useState([]);

  const username = localStorage.getItem("username");
  const token = JSON.parse(localStorage.getItem("loggedUser"))?.access;

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) setUserRole(storedRole);

    if (!token) {
      toast.error('Authentication error: Missing token.');
      return;
    }

    fetchCourses();
    fetchSubjects();
    fetchFacultyList();
  }, []);

  useEffect(() => {
    if (token) {
      getStudentDetails(token);
    } else {
      console.log("No access token found.");
    }
  }, [token]);

  // ✅ Move fetchNotesByCourse outside useEffect
  const fetchNotesByCourse = async (courseId, token) => {
    try {
      const notesData = await getStudentNotesByCourse(courseId, token);
      console.log("Fetched Notes Data:", notesData);

      if (Array.isArray(notesData)) {
        setNotes(notesData);
      } else {
        console.error("Expected an array but received:", notesData);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notes by course:", error);
      setLoading(false);
    }
  };

  const getStudentDetails = async (token) => {
    try {
      const response = await StudentApi(token);
      console.log("Full API Response:", response);

      let studentsData = response.data.data || response.data;
      console.log("Fetched Students Data:", JSON.stringify(studentsData, null, 2));

      if (!Array.isArray(studentsData)) {
        console.error("Expected an array but received:", studentsData);
        return;
      }

      if (studentsData.length > 0) {
        setStudents(studentsData);
      } else {
        console.log("No students found.");
        return;
      }

      const currentUser = studentsData.find(student => student.full_name === username);
      console.log("Current User:", currentUser);

      if (currentUser) {
        console.log("Current User Course ID:", currentUser.course);
        setCourseId(currentUser.course);
        fetchNotesByCourse(currentUser.course, token); // ✅ Now this works
      } else {
        console.log("Current user not found in student list.");
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await getCoursesApi(token);
      if (response.status === 200) {
        setCourses(response.data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await getSubjectApi(token);
      if (response.status === 200) {
        setSubjects(response.data);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchFacultyList = async () => {
    try {
      const response = await FacultyApi();
      if (response.status === 200) {
        setFacultyList(response.data);
      }
    } catch (error) {
      console.error('Error fetching faculty list:', error);
    }
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.course_name : "Unknown Course";
  };

  const getFacultyName = (facultyId) => {
    const faculty = facultyList.find(f => f.id === facultyId);
    return faculty ? faculty.full_name : "Unknown Faculty";
  };

  const filteredNotes = selectedSubject
    ? notes.filter(note => note.subject === selectedSubject)
    : notes;

  return (
    <div className="notes-page">
      <h1 className="notes-title">Notes</h1>
      <div className="filter-container">
        <select id="subject-filter" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="custom-dropdown">
          <option value="">All Subjects</option>
          {subjects.map(subject => (
            <option key={subject.id} value={subject.id}>{subject.name}</option>
          ))}
        </select>
      </div>

      <div className="notes-grid-container">
        {filteredNotes.map(note => (
          <div className="note-card" key={note.id}>
            <h3 className="note-title">{note.title}</h3>
            <p className="note-info"><strong>Course:</strong> {getCourseName(note.course)}</p>
            <p className="note-info"><strong>Faculty:</strong> {getFacultyName(note.faculty)}</p>
            {note.file ? (
              <a className="note-link" href={`http://localhost:8000${note.file}`} target="_blank" rel="noopener noreferrer">
                Open PDF
              </a>
            ) : (
              <p className="note-info">No PDF available</p>
            )}
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default StudentNoteView;
