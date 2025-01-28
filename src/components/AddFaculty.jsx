import React, { useState } from "react";
import { registerApi } from "../services/allApi";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Form, Button, Container, Row, Col, Spinner } from "react-bootstrap";

function AddFaculty() {
  const [userData, setUserData] = useState({
    full_name: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    password: "",
    department: "",
    photo: null,
    role: "faculty",
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      const file = files[0];
      if (file) {
        if (file.type.startsWith("image/")) {
          if (file.size <= 2 * 1024 * 1024) {
            setUserData({ ...userData, photo: file });
          } else {
            toast.error("Image size must be less than 2MB.");
          }
        } else {
          toast.error("Please upload a valid image file (JPEG, PNG, etc.)");
        }
      }
    } else {
      setUserData({ ...userData, [name]: value.trim() });
    }
  };

  const validateInputs = () => {
    const { full_name, dob, gender, email, phone, password, department, photo } = userData;

    if (!full_name.trim()) return "Full Name is required.";
    if (!dob) return "Date of Birth is required.";
    if (!gender) return "Gender is required.";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Invalid email format.";
    if (!/^\d{10}$/.test(phone)) return "Phone number must be 10 digits.";
    if (password.length < 6) return "Password must be at least 6 characters long.";
    if (!department) return "Department is required.";
    if (!photo) return "Photo is required.";

    return null;
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    const error = validateInputs();
    if (error) {
      toast.warning(error);
      return;
    }

    const formData = new FormData();
    formData.append("full_name", userData.full_name);
    formData.append("dob", userData.dob);
    formData.append("gender", userData.gender);
    formData.append("email", userData.email);
    formData.append("phone", userData.phone);
    formData.append("password", userData.password);
    formData.append("department", userData.department);
    formData.append("role", userData.role);
    formData.append("photo", userData.photo);

    setIsLoading(true);
    try {
      const response = await registerApi(formData);

      if (response.status === 200) {
        toast.success("OTP sent successfully.");
        setUserData({
          full_name: "",
          dob: "",
          gender: "",
          email: "",
          phone: "",
          password: "",
          department: "",
          photo: null,
          role: "faculty",
        });
        navigate("/Otp", { state: { email: userData.email } });
      } else {
        toast.error("Registration failed! Please try again.");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.photo?.[0] ||
        error.response?.data?.error ||
        "An unexpected error occurred. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <h1 className="text-center mb-4">Add Faculty Details</h1>
          <Form onSubmit={handleRegistration} className="p-4 border rounded bg-white shadow-sm">
            {/* Full Name */}
            <Form.Group controlId="full_name" className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="full_name"
                placeholder="Enter your full name"
                value={userData.full_name}
                onChange={handleChange}
                disabled={isLoading}
              />
            </Form.Group>

            {/* Date of Birth */}
            <Form.Group controlId="dob" className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="dob"
                value={userData.dob}
                onChange={handleChange}
                disabled={isLoading}
              />
            </Form.Group>

            {/* Gender */}
            <Form.Group controlId="gender" className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select
                name="gender"
                value={userData.gender}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>

            {/* Phone */}
            <Form.Group controlId="phone" className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={userData.phone}
                onChange={handleChange}
                disabled={isLoading}
              />
            </Form.Group>

            {/* Email */}
            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                value={userData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </Form.Group>

            {/* Password */}
            <Form.Group controlId="password" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter password"
                value={userData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
            </Form.Group>

            {/* Photo */}
            <Form.Group controlId="photo" className="mb-3">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control
                type="file"
                name="photo"
                onChange={handleChange}
                disabled={isLoading}
              />
            </Form.Group>

            {/* Department */}
            <Form.Group controlId="department" className="mb-3">
              <Form.Label>Department</Form.Label>
              <Form.Select
                name="department"
                value={userData.department}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="">Select Department</option>
                <option value="1">B.Tech</option>
                <option value="2">M.Tech</option>
              </Form.Select>
            </Form.Group>

            {/* Buttons */}
            <div className="d-flex justify-content-end gap-3">
              <Button
                variant="secondary"
                onClick={() => navigate("/")}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? <Spinner animation="border" size="sm" /> : "Create"}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
}

export default AddFaculty;
