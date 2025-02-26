import React, { useEffect, useState } from "react";
import { Table, Button, Container, Row, Col, Spinner, Modal, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { deleteFacultyApi, editFacultyApi, FacultyApi, getSubjectApi, getBatchApi, getCoursesApi, departmentApi } from "../services/allApi";
import "./viewFac.css";

function ViewFaculty() {
  const serverUrl = "http://localhost:8000";
  const [facultyList, setFacultyList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const facultyResponse = await FacultyApi(token);
        console.log(facultyResponse);
        if (Array.isArray(facultyResponse.data)) setFacultyList(facultyResponse.data);

        const deptResponse = await departmentApi(token);
        setDepartments(deptResponse.data);

        const batchResponse = await getBatchApi(token);
        setBatches(batchResponse.data);

        const courseResponse = await getCoursesApi(token);
        setCourses(courseResponse.data);

        const subjectResponse = await getSubjectApi(token);
        setSubjects(subjectResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("An error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [token]);


  useEffect(() => {
    if (selectedDepartment) {
      setFilteredFaculty(facultyList.filter(faculty => String(faculty.department) === String(selectedDepartment)));
    } else {
      setFilteredFaculty(facultyList);
    }
  }, [selectedDepartment, facultyList]);


  const handleEdit = (faculty) => {
    setSelectedFaculty({
      ...faculty,
      course: faculty.course || "",
      batch: faculty.batch || "",
      subject: faculty.subject || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (facultyId) => {
    if (!window.confirm("Are you sure you want to delete this faculty?")) return;
    try {
      const response = await deleteFacultyApi(facultyId, token);
      console.log(response);  // Log the response to check the status and data
      if (response.status === 204) {
        setFacultyList(facultyList.filter((faculty) => faculty.id !== facultyId));
        toast.success("Faculty deleted successfully.");
      } else {
        toast.error("Failed to delete faculty.");
      }
    } catch (error) {
      console.error("Error deleting faculty:", error);
      toast.error("An error occurred while deleting.");
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedFaculty((prevFaculty) => ({ ...prevFaculty, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFaculty((prevFaculty) => ({
        ...prevFaculty,
        photo: file, // Store file object
      }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const formData = new FormData();
    formData.append("id", selectedFaculty.id);
    formData.append("full_name", selectedFaculty.full_name);
    formData.append("email", selectedFaculty.email);
    formData.append("phone", selectedFaculty.phone);
    formData.append("department", selectedFaculty.department);
    formData.append("gender", selectedFaculty.gender);
    formData.append("dob", selectedFaculty.dob || ""); // Keep DOB to avoid errors
  
    if (selectedFaculty.photo instanceof File) {
      formData.append("photo", selectedFaculty.photo);
    }
  
    try {
      const response = await editFacultyApi(selectedFaculty.id, formData, token, true);
  
      if (response.status === 200) {
        setFacultyList((prevList) =>
          prevList.map((faculty) =>
            faculty.id === selectedFaculty.id ? response.data : faculty
          )
        );
        setShowModal(false);
        toast.success("Faculty details updated!");
      } else {
        toast.error("Failed to update faculty details.");
      }
    } catch (error) {
      console.error("Error updating faculty:", error);
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };
  


  return (
    <Container>
      <Row className="justify-content-center my-4">
        <Col lg={10}>
          <Form.Select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
            <option value="">All Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.department_name}</option>
            ))}

          </Form.Select>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col lg={10}>
          {isLoading ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" size="lg" />
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Dob</th>
                  <th>Phone</th>
                  <th>Department</th>
                  {/* <th>Course</th>
                  <th>Batch</th>
                  <th>Subject</th> */}
                  <th>Gender</th>
                  <th>Photo</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFaculty.map((faculty, index) => (
                  <tr key={faculty.id}>
                    <td>{index + 1}</td>
                    <td>{faculty.id}</td>
                    <td>{faculty.full_name}</td>
                    <td>{faculty.email}</td>
                    <td>{faculty.dob}</td>
                    <td>{faculty.phone}</td>
                    <td>{departments.find((dept) => dept.id === faculty.department)?.department_name || "Unknown"}</td>
                    {/* <td>{courses.find((course) => course.id === faculty.course)?.course_name || "Unknown"}</td>
                    <td>{batches.find((batch) => batch.id === faculty.batch)?.batch_name || "Unknown"}</td>
                    <td>{subjects.find((subject) => subject.id === faculty.subject)?.name || "Unknown"}</td> */}
                    <td>{faculty.gender}</td>
                    <td>
                      {faculty.photo ? (
                        <img src={`${serverUrl}${faculty.photo}`} alt={faculty.full_name} style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
                      ) : "No Photo"}
                    </td>
                    <td>
                      <Button variant="outline-primary" size="sm" onClick={() => handleEdit(faculty)}>
                        <FaEdit />
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(faculty.id)}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </Table>
          )}
        </Col>
      </Row>

      {/* Edit Faculty Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Faculty Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFaculty && (
            <Form onSubmit={handleSubmit} encType="multipart/form-data">
              {/* Full Name */}
              <Form.Group>
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="full_name"
                  value={selectedFaculty.full_name || ""}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* Email */}
              <Form.Group className="mt-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={selectedFaculty.email || ""}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* dob */}
              <Form.Group className="mt-3">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="dob"
                  value={selectedFaculty.dob || ""}
                  onChange={handleChange}
                  required
                />
              </Form.Group>


              {/* Phone */}
              <Form.Group className="mt-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={selectedFaculty.phone || ""}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* Department Dropdown */}
              <Form.Group className="mt-3">
                <Form.Label>Department</Form.Label>
                <Form.Select
                  name="department"
                  value={selectedFaculty.department || ""}
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>{dept.department_name}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Course Dropdown */}
              {/* <Form.Group className="mt-3">
                <Form.Label>Course</Form.Label>
                <Form.Select
                  name="course"
                  value={selectedFaculty.course || ""}
                  onChange={handleChange}
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>{course.course_name}</option>
                  ))}
                </Form.Select>
              </Form.Group> */}

              {/* Batch Dropdown */}
              {/* <Form.Group className="mt-3">
                <Form.Label>Batch</Form.Label>
                <Form.Select
                  name="batch"
                  value={selectedFaculty.batch || ""}
                  onChange={handleChange}
                >
                  <option value="">Select Batch</option>
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>{batch.batch_name}</option>
                  ))}
                </Form.Select>
              </Form.Group> */}

              {/* Subject */}
              {/* <Form.Group className="mt-3">
                <Form.Label>Subject</Form.Label>
                <Form.Select
                  name="subject"
                  value={selectedFaculty.subject || ""}
                  onChange={handleChange}
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </Form.Select>
              </Form.Group> */}

              {/* Gender Dropdown */}
              <Form.Group className="mt-3">
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  name="gender"
                  value={selectedFaculty.gender || ""}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>

              {/* Photo Upload */}
              <Form.Group className="mt-3">
                <Form.Label>Current Photo</Form.Label>
                <div>
                  {selectedFaculty?.photo && (
                    <img
                      src={selectedFaculty.photo instanceof File
                        ? URL.createObjectURL(selectedFaculty.photo)
                        : `${serverUrl}${selectedFaculty.photo}`} // Removed extra space
                      alt="Faculty"
                      style={{ width: "80px", height: "80px", borderRadius: "50%", marginBottom: "10px" }}
                    />
                  )}

                </div>
                <Form.Control type="file" name="photo" onChange={handlePhotoChange} />
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-4 w-100" disabled={isSubmitting}>
                {isSubmitting ? <Spinner animation="border" size="sm" /> : "Save Changes"}
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      <ToastContainer />
    </Container>
  );
}

export default ViewFaculty;
