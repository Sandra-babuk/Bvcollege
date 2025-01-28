import React, { useEffect, useState } from "react";
import { Table, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FacultyApi } from "../services/allApi";

function ViewFaculty() {
  const [facultyList, setFacultyList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch faculty data
  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        const response = await FacultyApi();
        if (response.status === 200) {
          setFacultyList(response.data); // Assuming data contains the list of faculty
        } else {
          toast.error("Failed to fetch faculty list. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching faculty data:", error);
        toast.error("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacultyData();
  }, []);

  // Handle edit or view faculty details
  const handleEdit = (facultyId) => {
    navigate(`/edit-faculty/${facultyId}`);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <h1 className="text-center mb-4">Faculty List</h1>
          
          {isLoading ? (
            <div className="d-flex justify-content-center">
              <Spinner animation="border" size="lg" />
            </div>
          ) : (
            <Table striped bordered hover responsive className="bg-white shadow-sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Gender</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {facultyList.length > 0 ? (
                  facultyList.map((faculty, index) => (
                    <tr key={faculty.id}>
                      <td>{index + 1}</td>
                      <td>{faculty.full_name}</td>
                      <td>{faculty.email}</td>
                      <td>{faculty.phone}</td>
                      <td>{faculty.department}</td>
                      <td>{faculty.gender}</td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleEdit(faculty.id)}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No faculty members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
}

export default ViewFaculty;
