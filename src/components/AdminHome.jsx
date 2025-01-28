import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, CssBaseline, Container, Collapse } from '@mui/material';
import { Add, Visibility, ExitToApp, ExpandLess, ExpandMore } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AddHod from '../components/AddHod';  
import AddFaculty from '../components/AddFaculty'
import './AdminHome.css';
import AddStudent from './AddStudent';
import AddBatch from './AddBatch';
import AddDepartment from './AddDepartment';
import AddCourse from './AddCourse';
import ViewDepartment from './ViewDepartment';
import ViewStudent from './ViewStudent';
import ViewHod from './ViewHod';
import ViewFaculty from './ViewFaculty'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: 240,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 240,
    backgroundColor: '#f0f0f0',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  sidebarHeader: {
    textAlign: 'center',
    padding: theme.spacing(2),
    fontWeight: 'bold',
  },
  listItem: {
    '&:hover': {
      backgroundColor: '#d0e6f7',
    },
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

function AdminHome() {
  const classes = useStyles();
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
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Admin Portal
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar} />
        <div className={classes.sidebarHeader}>Admin Controls</div>
        <List>
          <ListItem button className={classes.listItem} onClick={handleAddClick}>
            <ListItemIcon><Add /></ListItemIcon>
            <ListItemText primary="Add" />
            {openAdd ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openAdd} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button className={classes.nested} onClick={() => renderComponent(<AddHod />)}>
                <ListItemText primary="Add HOD" />
              </ListItem>
              <ListItem button className={classes.nested} onClick={() => renderComponent(<div><AddFaculty/></div>)}>
                <ListItemText primary="Add Faculty" />
              </ListItem>
              <ListItem button className={classes.nested} onClick={() => renderComponent(<div><AddStudent/></div>)}>
                <ListItemText primary="Add Student" />
              </ListItem>
              <ListItem button className={classes.nested} onClick={() => renderComponent(<div><AddCourse/> </div>)}>
                <ListItemText primary="Add Course" />
              </ListItem>
              <ListItem button className={classes.nested} onClick={() => renderComponent(<div><AddBatch/></div>)}>
                <ListItemText primary="Add Batch" />
              </ListItem>
              <ListItem button className={classes.nested} onClick={() => renderComponent(<div><AddDepartment/></div>)}>
                <ListItemText primary="Add Department" />
              </ListItem>
            </List>
          </Collapse>

          <ListItem button className={classes.listItem} onClick={handleViewClick}>
            <ListItemIcon><Visibility /></ListItemIcon>
            <ListItemText primary="View" />
            {openView ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openView} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button className={classes.nested} onClick={() => renderComponent(<div><ViewHod/></div>)}>
                <ListItemText primary="View HOD" />
              </ListItem>
              <ListItem button className={classes.nested} onClick={() => renderComponent(<div><ViewFaculty/> </div>)}>
                <ListItemText primary="View Faculty" />
              </ListItem>
              <ListItem button className={classes.nested} onClick={() => renderComponent(<div><ViewStudent/></div>)}>
                <ListItemText primary="View Student" />
              </ListItem>
              <ListItem button className={classes.nested} onClick={() => renderComponent(<div>View Course</div>)}>
                <ListItemText primary="View Course" />
              </ListItem>
              <ListItem button className={classes.nested} onClick={() => renderComponent(<div><ViewDepartment/></div>)}>
                <ListItemText primary="View Department" />
              </ListItem>
              <ListItem button className={classes.nested} onClick={() => renderComponent(<div>View Subject</div>)}>
                <ListItemText primary="View Subject" />
              </ListItem>
            </List>
          </Collapse>

          <ListItem button className={classes.listItem} onClick={() => navigate('/logout')}>
            <ListItemIcon><ExitToApp /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Container>
          {selectedComponent}
        </Container>
      </main>
    </div>
  );
}

export default AdminHome;
