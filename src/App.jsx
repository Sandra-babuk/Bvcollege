import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import SignUp from './components/SignUp'
import AdminHome from './components/AdminHome'
import AddHod from './components/AddHod'
import AddStudent from './components/AddStudent'
import Otp from './components/Otp'
import Home from './pages/Home'
// import StudentDashboard from './components/StudentDashboard'
import AddCourse from './components/AddCourse'
import StudentDash from './pages/StudentDash'
import HodDash from './pages/HodDash'
import FacultyDash from './pages/FacultyDash'

const App = () => {
  return (
    <div>
      <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/signup" element={<SignUp />}></Route>
      <Route path="/admin-home" element={<AdminHome />}></Route>
      <Route path="/add-hod" element={<AddHod />}></Route>
      <Route path="/add-courses" element={<AddCourse />}></Route>

      <Route path="/add-student" element={<AddStudent />}></Route>
      <Route path="/admin-home" element={<AdminHome />}></Route>
      <Route path="/Otp" element={<Otp />}></Route>
      <Route path="/home" element={<Home />}></Route>
      <Route path="/studentDash" element={<StudentDash />}></Route>
      <Route path="/hodDash" element={<HodDash />}></Route>
      <Route path="/facultyDash" element={<FacultyDash />}></Route>


      </Routes>

    </div>
  )
}

export default App 