import "./App.css";
import { useState, useEffect, createContext, useContext } from "react";
import React from "react";
import { useHistory } from "react-router";
import { Route, Switch } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
const drawerWidth = 240;
const mentorContext = createContext(null);
function App(props) {
  const [mentorData, setMentorData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const history = useHistory();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {['Create Mentor', 'Create Student'].map((text, index) => (
          <ListItem button key={text} onClick={() => history.push(`/${text}`)}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['Assign Mentor', 'Assign Students'].map((text, index) => (
          <ListItem button key={text} onClick={() => history.push(`/${text}`)}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['Mentees'].map((text, index) => (
          <ListItem button key={text} onClick={() => history.push(`/${text}`)}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Mentors and Students
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <mentorContext.Provider value={{
          mentorData: mentorData, setMentorData: setMentorData,
          studentData: studentData, setStudentData: setStudentData
        }}>
          <Routes />
        </mentorContext.Provider>
      </Box>
    </Box>
  );
}
function Routes() {
  return (
    <>
      <Switch>
        <Route path="/Create Mentor">
          <CreateMentor />
        </Route>
        <Route path="/Create Student">
          <CreateStudent />
        </Route>
        <Route path="/Assign Mentor">
          <SelectStudent />
        </Route>
        <Route path="/addMentor">
          <AddMentor />
        </Route>
        <Route path="/Assign Students">
          <SelectMentor />
        </Route>
        <Route path="/Mentees">
          <Mentees />
        </Route>
        <Route path="/selectStudents">
          <SelectStudents />
        </Route>
        <Route path="/displayMentees">
          <DisplayMentees />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </>
  )
}
function Home() {
  return (
    <div>
      This is an app for creating, assigning of mentors and students
    </div>
  )
}
function CreateMentor() {
  const history = useHistory();
  const addMentor = (mentor) => {
    fetch("https://assign-mentor-2425.herokuapp.com/createMentor", {
      method: "POST",
      body: JSON.stringify(mentor),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then(() => history.push("/Home"));
  };
  const formik = useFormik({
    initialValues: {
      name: "",
      pic: "",
      mobile: "",
      email: "",
    },
    validationSchema: yup.object({
      name: yup.string()
        .min(3, "please enter longer Mentor name")
        .required("please provide Mentor name"),
      pic: yup.string()
        .min(3, "please enter longer image url")
        .required("please provide image url"),
      mobile: yup.number()
        .min(10, "please enter ten digit number")
        .required("please provide mobile number "),
      email: yup.string()
        .min(3, "please enter valid email")
        .required("please provide email id ")
    }),
    onSubmit: (mentor) => {
      addMentor(mentor);
      history.push("/Home");
    },
  });
  return (
    <div>
      <div className="heading">Create mentor</div>
      <form onSubmit={formik.handleSubmit}>
        <input className="name-input" placeholder="Mentor name..."
          name="name" onChange={formik.handleChange} value={formik.values.name} /><br />
        {formik.touched.name && formik.errors.name ? (
          <p className="errors">{formik.errors.name}</p>
        ) : ("")
        }
        <input className="name-input" placeholder="Mentor mobile..."
          name="mobile" onChange={formik.handleChange} value={formik.values.mobile} /><br />
        {formik.touched.mobile && formik.errors.mobile ? (
          <p className="errors">{formik.errors.mobile}</p>
        ) : ("")
        }
        <input className="name-input" placeholder="Mentor email..."
          name="email" onChange={formik.handleChange} value={formik.values.email} /><br />
        {formik.touched.email && formik.errors.email ? (
          <p className="errors">{formik.errors.email}</p>
        ) : ("")
        }
        <input className="name-input pic-input" placeholder="Mentor image..."
          name="pic" onChange={formik.handleChange} value={formik.values.pic} /><br />
        {formik.touched.pic && formik.errors.pic ? (
          <p className="errors">{formik.errors.pic}</p>
        ) : ("")
        }
        <button className="final-button" type="submit" >Add Mentor</button><br />
      </form>
    </div>
  )
}
function CreateStudent() {
  const history = useHistory();
  const addStudent = (student) => {
    fetch("https://assign-mentor-2425.herokuapp.com/createStudent", {
      method: "POST",
      body: JSON.stringify(student),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json());
  };
  const formik = useFormik({
    initialValues: {
      name: "",
      pic: "",
      mobile: "",
      email: "",
    },
    validationSchema: yup.object({
      name: yup.string()
        .min(3, "please enter longer Student name")
        .required("please provide Student name"),
      pic: yup.string()
        .min(3, "please enter longer image url")
        .required("please provide image url"),
      mobile: yup.number()
        .min(10, "please enter ten digit number")
        .required("please provide mobile number "),
      email: yup.string()
        .min(3, "please enter valid email")
        .required("please provide email id ")
    }),
    onSubmit: (student) => {
      addStudent(student);
      history.push("/Home");
    },
  });
  return (
    <div>
      <div className="heading">Create student</div>
      <form onSubmit={formik.handleSubmit}>
        <input className="name-input" placeholder="Student name..."
          name="name" onChange={formik.handleChange} value={formik.values.name} /><br />
        {formik.touched.name && formik.errors.name ? (
          <p className="errors">{formik.errors.name}</p>
        ) : ("")
        }
        <input className="name-input" placeholder="Student mobile..."
          name="mobile" onChange={formik.handleChange} value={formik.values.mobile} /><br />
        {formik.touched.mobile && formik.errors.mobile ? (
          <p className="errors">{formik.errors.mobile}</p>
        ) : ("")
        }
        <input className="name-input" placeholder="Student email..."
          name="email" onChange={formik.handleChange} value={formik.values.email} /><br />
        {formik.touched.email && formik.errors.email ? (
          <p className="errors">{formik.errors.email}</p>
        ) : ("")
        }
        <input className="name-input pic-input" placeholder="Student image..."
          name="pic" onChange={formik.handleChange} value={formik.values.pic} /><br />
        {formik.touched.pic && formik.errors.pic ? (
          <p className="errors">{formik.errors.pic}</p>
        ) : ("")
        }
        <button className="final-button" type="submit">Add Student</button><br />
      </form>
    </div>
  )
}
function SelectMentor() {
  const { setMentorData } = useContext(mentorContext);
  const history = useHistory();
  const [mentors, setMentors] = useState([]);
  function getMentors() {
    fetch("https://assign-mentor-2425.herokuapp.com/mentors", {
      method: "GET",
    })
      .then((data) => data.json())
      .then((data) => setMentors(data));

  }
  useEffect(() => {
    getMentors();
  }, []);
  return (
    <div className="container">
      <div className="heading">Mentors</div>
      {mentors.map((mentor) =>
        <div className="card">
          <img src={mentor.pic} alt="" />
          <div className="name">{mentor.name}</div>
          <div className="mobileNo">{mentor.mobileNo}</div>
          <div className="email">{mentor.email}</div>
          <button className="submit-button" onClick={() => { history.push("/selectStudents"); setMentorData(mentor) }}>Select Mentor</button>
        </div>
      )}
    </div>
  )
}
function SelectStudents() {
  const [newMentees, setnewMentees] = useState([]);
  const history = useHistory();
  const [nonMentees, setNonMentees] = useState([]);
  const { mentorData } = useContext(mentorContext);
  function getNonMentees() {
    fetch("https://assign-mentor-2425.herokuapp.com/students", {
      method: "GET",
    })
      .then((data) => data.json())
      .then((data) => data.filter((people) => !people.hasOwnProperty("mentor")))
      .then((mentorLess) => setNonMentees(mentorLess));
  }
  function assignNewMentees() {
    fetch("https://assign-mentor-2425.herokuapp.com/assignStudents", {
      method: "PUT",
      body: JSON.stringify({ mentor: mentorData, newMentees: newMentees }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json());
  };
  useEffect(() => {
    getNonMentees();
  }, []);
  return (
    <div className="container">
      <div className="heading">Students </div>
      {nonMentees.map((nonMentee) => (
        <AddMentees nonMentee={nonMentee} newMentees={newMentees} setnewMentees={setnewMentees} />
      ))
      }
      <button className=" final-button" onClick={() => { assignNewMentees(); history.push("/Home") }}>Assign Students</button>
    </div>
  )
}
function AddMentees({ nonMentee, newMentees, setnewMentees }) {
  const [select, setSelect] = useState(false);

  return (
    <div className="card">

      <img src={nonMentee.pic} alt="" />
      <div className="name">{nonMentee.name}</div>
      <div className="mobileNo">{nonMentee.mobileNo}</div>
      <div className="email">{nonMentee.email}</div>
      <button className="submit-button" onClick={() => {
        setSelect(!select);
        !select ? setnewMentees([...newMentees, nonMentee]) :
          setnewMentees(newMentees.filter((student) => student !== nonMentee))

      }}>
        {select ? "Remove student" : "Add student"}

      </button>

    </div>
  )
}
function SelectStudent() {
  const history = useHistory();
  const { setStudentData } = useContext(mentorContext);
  const [students, setStudents] = useState([]);
  function getStudents() {
    fetch("https://assign-mentor-2425.herokuapp.com/students", {
      method: "GET",
    })
      .then((data) => data.json())
      .then((data) => setStudents(data))
  }
  useEffect(() => {
    getStudents();
  }, []);
  return (
    <div className="container">
      <div className="heading">Students</div>
      {students.map((student) => (
        <div className="card">
          <img src={student.pic} alt="" />
          <div className="name">{student.name}</div>
          <div className="mobileNo">{student.mobileNo}</div>
          <div className="email">{student.email}</div>
          <button className="submit-button" onClick={() => { setStudentData(student); history.push("/addMentor") }}>Select student</button>
        </div>
      )
      )}

    </div>
  )
}
function AddMentor() {
  const history = useHistory();
  const { studentData } = useContext(mentorContext);
  const [mentors, setMentors] = useState([]);
  const { email, mobileNo, name, pic } = studentData
  function getMentors() {
    fetch("https://assign-mentor-2425.herokuapp.com/mentors", {
      method: "GET",
    })
      .then((data) => data.json())
      .then((data) => setMentors(data))
  }
  useEffect(() => {
    getMentors();
  }, []);
  function assignMentor(mentor) {
    fetch("https://assign-mentor-2425.herokuapp.com/assignMentor", {
      method: "PUT",
      body: JSON.stringify({
        student: { email: email, mobileNo: mobileNo, name: name, pic: pic },
        oldMentor: studentData.mentor, newMentor: mentor
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json());
  }
  return (
    <div className="container">
      <div className="heading">Mentors</div>
      {mentors.map((mentor) =>
      (
        <div className="card">
          <img src={mentor.pic} alt="" />
          <div className="name">{mentor.name}</div>
          <div className="mobileNo">{mentor.mobileNo}</div>
          <div className="email">{mentor.email}</div>
          <button className="submit-button" onClick={() => { assignMentor(mentor); history.push("/Home") }}>Assign mentor</button>
        </div>
      )
      )}
    </div>
  )
}
function Mentees() {
  const history = useHistory();
  const { setMentorData } = useContext(mentorContext);
  const [mentors, setMentors] = useState([]);
  function getMentors() {
    fetch("https://assign-mentor-2425.herokuapp.com/mentors", {
      method: "GET",
    })
      .then((data) => data.json())
      .then((data) => setMentors(data))
  }
  useEffect(() => {
    getMentors();
  }, []);
  return (
    <div className="container">
      <div className="heading">Mentors</div>
      {mentors.map((mentor) =>
      (
        <div className="card">
          <img src={mentor.pic} alt="" />
          <div className="name">{mentor.name}</div>
          <div className="mobileNo" >{mentor.mobileNo}</div>
          <div className="email" >{mentor.email}</div>
          <button className="submit-button" onClick={() => { setMentorData(mentor); history.push("/displayMentees") }}>Display Mentees</button>
        </div>
      )
      )}
    </div>
  )
}
function DisplayMentees() {
  const { mentorData } = useContext(mentorContext);
  let mentorEmail = mentorData.email
  const [mentees, setMentees] = useState([]);
  function getMentees() {
    fetch(`https://assign-mentor-2425.herokuapp.com/mentees/${mentorEmail}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((data) => setMentees(data))
  }
  useEffect(() => {
    getMentees();
     // eslint-disable-next-line
  }, []);
  return (
    <div className="container">
      <div className="heading">Mentees</div>
      {mentees[0] !== undefined && mentees[0].assigned !== undefined ?
        mentees[0].assigned.map((mentee) => (
          <div className="card">
            <img src={mentee.pic} alt="" />
            <div className="name">{mentee.name}</div>
            <div className="mobileNo">{mentee.mobileNo}</div>
            <div className="email">{mentee.email}</div>
          </div>
        )) : ""}
    </div>
  )
}
export default App;