import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import SignUp from './components/SignUp'
import AdminHome from './components/AdminHome'
import AddHod from './components/AddHod'
import AddStudent from './components/AddStudent'
import Otp from './components/Otp'
import Home from './pages/Home'
import StudentDashboard from './components/StudentDashboard'
import EditStudent from './components/EditSudent'
import AddCourse from './components/AddCourse'

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
      <Route path="/student-dashboard" element={<StudentDashboard />}></Route>
      <Route path="/edit-student" element={<EditStudent />}></Route>


      </Routes>

    </div>
  )
}

export default App 