import React, { useState, useEffect } from "react";
import "./SecondaryNavigation.css";
import MeetingScheduler from "./Tabs/MeetingScheduler";
import UpcomingMeetings from "./Tabs/UpcomingMeetings";
import PastMeetings from "./Tabs/PastMeetings";
import Users from "./Tabs/Users";
import { useHistory } from "react-router-dom";
import Button from '@material-ui/core/Button'
import Modal from "@material-ui/core/Modal";
import axios from "axios";
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from "@material-ui/core/TextField";
import Paper from '@material-ui/core/Paper';

export default function SecondaryNavigation({user}) {
  let history = useHistory();
  const [tab, setTab] = useState(user.type == 1 ? 0 : 1);
  const [u] = useState(user)
  const [chosenName, setChosenName] = useState(user.name);
  const [chosenPassword, setChosenPassword] = useState(user.u_password);
  const [chosenEmail, setChosenEmail] = useState(u.email);
  const [chosenNumber, setChosenNumber] = useState(u.phone_number);
  const [chosenType, setChosenType] = useState('');
  const [chosenPosition, setChosenPosition] = useState([]);
  const [chosenID, setChosenID] = useState(u.u_id)
  const [openAccount, setOpenAccount] = React.useState(false);
  const [users, setUsers] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  
  useEffect(() => {
    axios.get("http://localhost:3443/userTypes").then(function (response) {
      setUserTypes(response.data.type);
    });
    axios.get("http://localhost:3443/users").then(function (response) {
      setUsers(response.data.user);
    })
  }, []);

  const handleCloseAccount = (event) => {
    setOpenAccount(false);
  }
  const handleNameChange = (event, name) => {
    setChosenName(name);
  }
  const handleEmailChange = (event, email) => {
    setChosenEmail(email);
  }
  const handlePasswordChange = (event,password) =>{
    setChosenPassword(password);
  }
  const handleSelectType = (event, type) => {
    var chosType = userTypes.filter(type => {
      return type.type_id = type;
    })
    const { type_descr } = chosType[0];
    setChosenType(type_descr);
  }
  const handlePhoneNumberChange = (event, number) => {
    setChosenNumber(number);
  }
  const handleSave = (event) => {
    var myAccount = {
      name: chosenName,
      email: chosenEmail,
      u_password: chosenPassword,
      type: chosenType,
      phone_number:chosenNumber,
    }
    axios.patch("http://localhost:3443/user", myAccount)
      .then(function (response) {
        console.log(response);
      });
  }
  const handleOpenAccount = (event) => {
    console.log(user + "\n");
    console.log(u.email + "\n");
    console.log(u.name + "\n");
    console.log("chosenType: " + u.type);
    var getType = userTypes.filter(type => {
      return type.type_id = u.type;
    })
    const { type_descr } = getType[0];
    setChosenType(type_descr);
    setOpenAccount(true)
  }
  const handleManageAccount = (event) => {
    history.push(`/Account/${u.u_id}`);
  }
  return (
    <>
      <ul
        className="navigation"
        style={{
          backgroundColor: "white",
          boxShadow: "0 4px 16px rgba(0,0,0,.1)",
          padding: "0px 200px",
        }}
      >
        <h2
          style={{
            marginBottom: "0",
            fontWeight: "300",
            padding: "10px 0",
            width: "100%",
          }}
        >
          Scheduling Center{" "}
          <span
            style={{
              float: "right",
              color: "rgb(100,100,100)",
              fontWeight: "200",
              fontSize: "14px",
              color: "rgb(27, 14, 83)",
              fontWeight: "600",
            }}
          >
            <span style={{ fontWeight: "100" }}>Welcome, {u.name}</span>
          </span>
          <Button 
            variant='contained'
            color='default'
            style={{ marginLeft: '20px', float: 'right' }}
            onClick = { handleManageAccount }
          >
            Edit Account
            </Button>
        </h2>
 
        {u.type == 1 ? <>
          <li
          className={
            tab === 0 ? "secondary-li secondary-li-active" : "secondary-li"
          }
        >
          <a href="#management" onClick={() => setTab(0)}>
            Management
          </a>
        </li>
        </>
        :
        ''
        }
       
        <li
          className={
            tab === 1 ? "secondary-li secondary-li-active" : "secondary-li"
          }
        >
          <a href="#upcomingmeetings" onClick={() => setTab(1)}>
            Upcoming Meetings
          </a>
        </li>
        <li
          className={
            tab === 2 ? "secondary-li secondary-li-active" : "secondary-li"
          }
        >
          <a href="#pastmeetings" onClick={() => setTab(2)}>
            Past Meetings
          </a>
        </li>

        {u.type == 1 ? <>
          <li
          className={
            tab === 3 ? "secondary-li secondary-li-active" : "secondary-li"
          }
        >
          <a href="#users" onClick={() => setTab(3)}>
            Users
          </a>
        </li>
        </>
        :
        ''
        }

      </ul>

      <div style={{ padding: "10px 200px" }}>
        {tab === 0 ? <MeetingScheduler /> : ""}
        {tab === 1 ? <UpcomingMeetings user={user} /> : ""}
        {tab === 2 ? <PastMeetings user={user} /> : ""}
        {tab === 3 ? <Users /> : ""}
      </div>
    </>
  );
}