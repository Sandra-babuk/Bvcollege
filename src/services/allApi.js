import axios from "axios";
import { commonAPI } from "./commonApi";
import { serverUrl } from "./serverUrl";


// Function to refresh token
const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refresh'); // Assume the refresh token is also stored
  if (!refreshToken) {
    throw new Error('No refresh token found in localStorage');
  }

  try {
    const response = await axios.post(`${serverUrl}/api/token/refresh/`, {
      refresh: refreshToken,
    });
    const newAccessToken = response.data.access;
    localStorage.setItem('access', newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error('Error refreshing token:', error.response || error.message);
    throw error;
  }
};

// Login API
export const loginApi = async (userDetails) => {
  return await commonAPI("POST", `${serverUrl}/login/`, userDetails, "");
};

// Register API
export const registerApi = async (userDetails) => {
  return await commonAPI("POST", `${serverUrl}/register/`, userDetails, "");
};

// OTP Verification API
export const verifyOtpApi = async (otpDetails) => {
  return await commonAPI("POST", `${serverUrl}/verify_otp/`, otpDetails, "");
};

// Resend OTP API
export const resendOtpApi = async (userDetails) => {
  return await commonAPI("POST", `${serverUrl}/resend_otp/`, userDetails, "");
};
// =====================================================================================================

export const StudentApi = async (token) => {
  try {
    const response = await axios.get(`${serverUrl}/stlist/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include your token here
      },
    });
    return response;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('Token expired, refreshing token...');
      try {
        const newToken = await refreshToken();
        const response = await axios.get(`${serverUrl}/stlist/`, {
          headers: {
            Authorization: `Bearer ${newToken}`, // Use the new token
          },
        });
        return response;
      } catch (refreshError) {
        console.error('Error fetching students after token refresh:', refreshError);
        throw refreshError;
      }
    } else {
      console.error('Error fetching students:', error.response || error.message);
      throw error;
    }
  }
};

// // studentlist -api
// export const StudentApi = async () => {
//   return await commonAPI("GET", `${serverUrl}/stlist/`, "", "");
// };


//addStudentApi
export const addStudentApi = async (FormData, reqHeader) => {
  try {
    const response = await axios.post(`${serverUrl}/stlist/`, formData, {
      headers: {
        ...reqHeader,
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (err) {
    console.error("Error in addStudentApi:", err.response || err.message);
    throw err; // Let the calling function handle errors
  }
};

//delete student api
export const deleteStudentApi = async (id, token) => {
  return await commonAPI("DELETE", `${serverUrl}/stlist/${id}/`, "", {
    Authorization: `Bearer ${token}`,
  });
};

//editstudentapi
export const editStdApi = async (id, studentdetails, token) => {
  return await commonAPI("PUT", `${serverUrl}/stlist/${id}/`, studentdetails, {
    Authorization: `Bearer ${token}`,
  });
};


// ======================================================================================

// department list
export const getDepartmentsApi = async (token) => {
  return await commonAPI("GET", `${serverUrl}/departments/`, null, {
    Authorization: `Bearer ${token}`,
  });
};


// Department API functions
export const addDepartmentApi = async (data, token) => {
  return await commonAPI("POST", `${serverUrl}/departments/`, data, {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data',
  });
};

//delete department

export const deleteDeptApi = async (id, token) => {
  return await commonAPI("DELETE", `${serverUrl}/departments/${id}/`, "", {
    Authorization: `Bearer ${token}`,
  });
};

//edit department
export const editDeptApi = async (id, deptdetails, token) => {
  return await commonAPI(
    "PUT",
    `${serverUrl}/departments/${id}/`,
    deptdetails,
    {
      Authorization: `Bearer ${token}`,
    }
  ); m
};
// dept view
export const departmentApi = async () => {
  return await commonAPI("GET", `${serverUrl}/departments-list/`, "", "");
};

// ================================================================


// HOD API functions
export const HodApi = async (token) => {
  return await commonAPI("GET", `${serverUrl}/hodlist/`, null, {
    Authorization: `Bearer ${token}`,
  });
};

export const deleteHodApi = async (id, token) => {
  return await commonAPI("DELETE", `${serverUrl}/hodlist/${id}/`, null, {
    Authorization: `Bearer ${token}`,
  });
};

export const editHodApi = async (id, hodDetails, token) => {
  return await commonAPI("PUT", `${serverUrl}/hodlist/${id}/`, hodDetails, {
    Authorization: `Bearer ${token}`,
  });
};

// faculty
//Addfacultyapi
export const addFacultyApi = async (formData, reqHeader) => {
  try {
    const response = await axios.post(`${serverUrl}/Faculty/`, formData, {
      headers: {
        ...reqHeader, // Include authorization and other necessary headers
        "Content-Type": "multipart/form-data", // Ensure this matches backend expectations
      },
    });
    return response;
  } catch (err) {
    console.error("Error in addFacultyApi:", err.response || err.message);
    throw err; // Let the calling function handle errors
  }
};

// // faculty list
// export const facultyApi = async (token) => {
//   try {
//     const response = await axios.get(`${serverUrl}/falist/`, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//         Authorization: `Bearer ${token}`,
//         // Pass token in Authorization header
//       },
//     });
//     return response;
//   } catch (error) {
//     console.error("Error fetching faculty data", error);
//     throw error; // Rethrow error for proper handling in the component
//   }
// };

//delete faculty
export const deleteFacultyApi = async (id, token) => {
  return await commonAPI("DELETE", `${serverUrl}/falist/${id}/`, "", {
    Authorization: `Bearer ${token}`,
  });
};

//edit faculty
export const editFacultyApi = async (id, facultydetails, token) => {
  return await commonAPI("PUT", `${serverUrl}/falist/${id}/`, facultydetails, {
    Authorization: `Bearer ${token}`,
  });
};

// faculty list
export const FacultyApi = async () => {
  // Retrieve token from localStorage
  const token = localStorage.getItem("access");

  // Check if token is available
  if (!token) {
    throw new Error("Token is missing");
  }

  // Make API call using commonAPI function
  return await commonAPI("GET", `${serverUrl}/falist/`, null, {
    Authorization: `Bearer ${token}`,
  });
};


//delete_Studentnote
export const delete_Studentnote = async (id, token) => {
  return await commonAPI("DELETE", `${serverUrl}/notes/${id}/`, "", {
    Authorization: `Bearer ${token}`,
  });
};


// -----------------------------------------------------------------
export const addCourseApi = async (data, token) => {
  return await commonAPI("POST", `${serverUrl}/courses-list/`, data, {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  })
}


// profile
export const getUserProfileApi = async (userId, token) => {
  return axios.get(`http://localhost:8000/api/profile/${userId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// notifications
export const getNotificationsApi = async (token) => {
  return await commonAPI("GET", `${serverUrl}/notifications/view/`, null, {
    Authorization: `Bearer ${token}`
  });
};

// export const getNotificationByIdApi = async (id, token) => {
//   return await commonAPI("GET", `${serverUrl}/notifications/${id}/`, null, {
//     Authorization: `Bearer ${token}`
//   });
// };

export const addNotificationApi = async (data, token) => {
  return await commonAPI("POST", `${serverUrl}/notifications/`, data, {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  });
};

export const updateNotificationApi = async (id, data, token) => {
  return await commonAPI("PUT", `${serverUrl}/notifications/${id}/`, data, {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  });
};

export const deleteNotificationApi = async (id, token) => {
  return await commonAPI("DELETE", `${serverUrl}/notifications/${id}/`, null, {
    Authorization: `Bearer ${token}`
  });
};

// export const get_notes = async (token) => {
//   return await commonAPI("GET", `${serverUrl}/notes/`, null, {
//     Authorization: ` Bearer ${token}`
//   });
// };



// add subject
export const addSubjectApi = async (token, subjectData) => {
  return axios.post(`${serverUrl}/subjects/`, subjectData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

// get subject
export const getSubjectApi = async (token, subjectData) => {
  return await commonAPI("GET", `${serverUrl}/subjects/`, subjectData, {
    Authorization: `Bearer ${token}`
  });
};

// delete subject
export const deleteSubjectApi = async (token, id) => {
  return await commonAPI("DELETE", `${serverUrl}/subjects/${id}/`, null, {
    Authorization: `Bearer ${token}`
  });
};

// edit subject
export const editSubjectApi = async (id, subjectData, token) => {
  return await commonAPI("PUT", `${serverUrl}/subjects/${id}/`, subjectData, {
    Authorization: `Bearer ${token}`
  });
}


// add batch
export const addbatchApi = async (formData, token) => {
  return await commonAPI("POST", `${serverUrl}/batches/`, formData, {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  });
};

export const getBatchApi = async (token) => {
  return await commonAPI("GET", `${serverUrl}/batches/`, null, {
    Authorization: `Bearer ${token}`
  });
};


// all courses
export const getCoursesApi = async (token) => {
  return await commonAPI("GET", `${serverUrl}/courses-list/`, "",{
    Authorization: `Bearer ${token}`

  })
}
// ........................................assignment........................................


// Create a new submission for a specific assignment
export const addAssignmentApi = async (token, assignmentData) => {
  return axios.post(`${serverUrl}/assignments/`, assignmentData, {
    headers: {
      Authorization: ` Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

// get subject
export const getAssignmentApi = async (token, assignmentData) => {
  return await commonAPI("GET", `${serverUrl}/assignments/`, assignmentData, {
    Authorization: `Bearer ${token}`
  });
};
// edit assignments
export const editAssignmentApi = async (id, assignD, token) => {
  return await commonAPI("PUT", `${serverUrl}/assignments/${id}/`, assignD, {
    Authorization: `Bearer ${token}`,
  });
};

// Fetch assignments by batch ID
export const getAssignmentsByBatch = async (token, batchId) => {
  return await axios.get(`${serverUrl}/student/assignments/${batchId}/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};


// delete assignments
export const deleteAssignmentApi = async (id, token) => {
  return await commonAPI("DELETE", `${serverUrl}/assignments/${id}/`, null, {
    Authorization: `Bearer ${token}`
  });
};

// get assignment submission
export const getAssignmentSubmissions = async (token, assignmentId) => {
  return await axios.get(`${serverUrl}/assignments/${assignmentId}/submissions/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const createSubmissionApi = async (token, assignmentId, submissionData) => {
  try {
    const response = await commonAPI("POST", `${serverUrl}/assignments/${assignmentId}/submissions/`, submissionData, {
      Authorization: `Bearer ${token}`,
    });
    console.log(response); // Log the response to inspect
    return response;
  } catch (error) {
    console.error("Error submitting assignment:", error);
    throw error; // Propagate the error
  }
};


// Delete a specific submission
export const deleteSubmissionApi = async (token, assignmentId, submissionId) => {
  return await commonAPI("DELETE", `${serverUrl}/assignments/${assignmentId}/submissions/${submissionId}/`, null, {
    Authorization: `Bearer ${token}`
  });
};


// Get only the assignments created by the logged-in teacher
export const getTeacherAssignments = async (token) => {
  return await axios.get(`${serverUrl}/assignments/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};



// upload notes
export const upload_Studentnote = async (formData, reqHeader) => {
  try {
    const response = await axios.post(`${serverUrl}/notes/`, formData, {
      headers: {
        ...reqHeader,
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (err) {
    console.error("Error in upload_Studentnote:", err.response || err.message);
    throw err; // Re-throw to let the caller handle it
  }
};

// get notes
export const getNotes = async (token) => {
  try {
    const response = await axios.get(`${serverUrl}/notes/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};


// notes
export const getNoteDetail = async (noteId, token) => {
  try {
    const response = await axios.get(`${serverUrl}/notes/${noteId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching note detail:', error);
    throw error;
  }
};

// student note by course
export const getStudentNotesByCourse = async (courseId, token) => {
  try {
    const response = await axios.get(`${serverUrl}/notes/course/${courseId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching student notes:', error);
    throw error;
  }
};

// Edit note data
export const editNoteApi = async (id, data, token) => {
  return await commonAPI("PUT", `${serverUrl}/notes/${id}/`, data, {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  });
};

// Delete note data
export const deleteNoteApi = async (id, token) => {
  return await commonAPI("DELETE", `${serverUrl}/notes/${id}/`, null, {
    Authorization: `Bearer ${token}`,
  });
}





// Fetch all faculty attendance records
export const getFacultyAttendanceApi = async (token) => {
  return await commonAPI("GET", `${serverUrl}/faculty-attendance/`, null, {
    Authorization: `Bearer ${token}`
  });
};

// Create a new faculty attendance record
export const createFacultyAttendanceApi = async (token, data) => {
  return await commonAPI("POST", `${serverUrl}/faculty-attendance/`, data, {
    Authorization: `Bearer ${token}`
  });
};

// Update an existing faculty attendance record
export const updateFacultyAttendanceApi = async (token, attendanceId, data) => {
  return await commonAPI("PUT", `${serverUrl}/faculty-attendance/${attendanceId}/`, data, {
    Authorization: `Bearer ${token}`
  });
};



// ------------------------------------------

// Fetch student attendance
export const getStudentAttendanceApi = async (params, token) => {
  return await commonAPI("GET", `${serverUrl}/student_attendance/`, null, {
    Authorization: `Bearer ${token}`,
    ...params, 
  });
};

// Create student attendance
export const createStudentAttendanceApi = async (data, token) => {
  return await commonAPI("POST", `${serverUrl}/student_attendance/`, data, {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  });
};

// Update student attendance
export const updateStudentAttendanceApi = async (id, data, token) => {
  return await commonAPI("PUT", `${serverUrl}/student_attendance/${id}/`, data, {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  });
};

// Fetch specific student attendance record by ID
export const getStudentAttendanceByIdApi = async (id, token) => {
  return await commonAPI(
    "GET",
    `${serverUrl}/student_attendance/${id}/`,
    null,
    {
      Authorization: `Bearer ${token}`,
    }
  );
};





// ==========================

// Post exam result data
export const ExamResultApi = async (examResult, token) => {
  try {
    const response = await axios.post('http://localhost:8000/exam_result/', examResult, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('There was an error posting the exam result!', error);
    throw error;
  }
};


export const uploadExamResultApi = async (token, title, file) => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('file', file);

  return await commonAPI("POST", `${serverUrl}/exam_result/`, formData, {
    Authorization: `Bearer ${token}`,
  });
};



































