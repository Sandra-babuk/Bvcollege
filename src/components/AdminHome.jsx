import React, { useState } from 'react';
import {
  Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar,
  Toolbar, Typography, CssBaseline, Container, Collapse
} from '@mui/material';
import {
  Add, Visibility, ExitToApp, ExpandLess, ExpandMore,
  Notifications, Assessment
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AddHod from '../components/AddHod';  
import AddFaculty from '../components/AddFaculty';
import AddStudent from './AddStudent';
// import AddBatch from './AddBatch';
import AddDepartment from './AddDepartment';
import AddCourse from './AddCourse';
import ViewDepartment from './ViewDepartment';
import ViewStudent from './ViewStudent';
import ViewHod from './ViewHod';
import ViewFaculty from './ViewFaculty';
import Notification from './Notification';
import ExamResult from './ExamResult';
import './AdminHome.css';
import AddSubject from './AddSubject'
import ViewCourse from './ViewCourses';
import ViewSubject from './ViewSubject';

function AdminHome() {
  const navigate = useNavigate();
  const [openAdd, setOpenAdd] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);

  const handleAddClick = () => {
    setOpenAdd(!openAdd);
  };

  const handleViewClick = () => {
    setOpenView(!openView);
  };

  const renderComponent = (component) => {
    setSelectedComponent(component);
  };

  return (
    <div className="admin-home">
      <CssBaseline />
      {/* <AppBar position="fixed" className="admin-appbar">
        <Toolbar>
          <Typography variant="h6" noWrap>
            Admin Portal
          </Typography>
        </Toolbar>
      </AppBar> */}
      <Drawer className="admin-drawer" variant="permanent">
        <div className="toolbar-spacer" />
        <div className="sidebar-header">Admin Controls</div>
        <List>
          {/* Add Section */}
          <ListItem button className="list-item" onClick={handleAddClick}>
            <ListItemIcon><Add /></ListItemIcon>
            <ListItemText primary="Add" />
            {openAdd ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openAdd} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button className="nested-item" onClick={() => renderComponent(<AddHod />)}>
                <ListItemText primary="Add HOD" />
              </ListItem>
              <ListItem button className="nested-item" onClick={() => renderComponent(<AddFaculty />)}>
                <ListItemText primary="Add Faculty" />
              </ListItem>
              <ListItem button className="nested-item" onClick={() => renderComponent(<AddStudent />)}>
                <ListItemText primary="Add Student" />
              </ListItem>
              <ListItem button className="nested-item" onClick={() => renderComponent(<AddCourse />)}>
                <ListItemText primary="Add Course" />
              </ListItem>
              <ListItem button className="nested-item" onClick={() => renderComponent(<AddSubject />)}>
                <ListItemText primary="Add Subject" />
              </ListItem>
              <ListItem button className="nested-item" onClick={() => renderComponent(<AddDepartment />)}>
                <ListItemText primary="Add Department" />
              </ListItem>
            </List>
          </Collapse>

          {/* View Section */}
          <ListItem button className="list-item" onClick={handleViewClick}>
            <ListItemIcon><Visibility /></ListItemIcon>
            <ListItemText primary="View" />
            {openView ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openView} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button className="nested-item" onClick={() => renderComponent(<ViewHod />)}>
                <ListItemText primary="View HOD" />
              </ListItem>
              <ListItem button className="nested-item" onClick={() => renderComponent(<ViewFaculty />)}>
                <ListItemText primary="View Faculty" />
              </ListItem>
              <ListItem button className="nested-item" onClick={() => renderComponent(<ViewStudent />)}>
                <ListItemText primary="View Student" />
              </ListItem>
              <ListItem button className="nested-item" onClick={() => renderComponent(<ViewDepartment />)}>
                <ListItemText primary="View Department" />
              </ListItem>
              <ListItem button className="nested-item" onClick={() => renderComponent(<ViewCourse />)}>
                <ListItemText primary="View Courses" />
              </ListItem>
              <ListItem button className="nested-item" onClick={() => renderComponent(<ViewSubject />)}>
                <ListItemText primary="View Subject" />
              </ListItem>
            </List>
          </Collapse>

          {/* Notifications & Exam Results */}
          <ListItem button className="list-item" onClick={() => renderComponent(<Notification />)}>
            <ListItemIcon><Notifications /></ListItemIcon>
            <ListItemText primary="Notification" />
          </ListItem>

          <ListItem button className="list-item" onClick={() => renderComponent(<ExamResult />)}>
            <ListItemIcon><Assessment /></ListItemIcon>
            <ListItemText primary="Exam Result" />
          </ListItem>

          {/* Logout */}
          <ListItem button className="list-item" onClick={() => navigate('/')}>
            <ListItemIcon><ExitToApp /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
      <main className="admin-content">
        <div className="toolbar-spacer" />
        <Container>
          {selectedComponent}
        </Container>
      </main>
    </div>
  );
}

export default AdminHome;
