import React, { useState, useEffect } from "react";
import "./SecondaryNavigation.css";
import MeetingScheduler from "./Tabs/MeetingScheduler";
import UpcomingMeetings from "./Tabs/UpcomingMeetings";
import PastMeetings from "./Tabs/PastMeetings";
import MyFiles from './Tabs/MyFiles';
import LastLocation from './Tabs/LastLocation';
import Users from "./Tabs/Users";
import { useHistory } from "react-router-dom";
import Button from '@material-ui/core/Button'
import Modal from "@material-ui/core/Modal";
import axios from "axios";
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from "@material-ui/core/TextField";
import Paper from '@material-ui/core/Paper';
import GenerateUser from './Tabs/GenerateUser';

export default function SecondaryNavigation({user, cookies}) {
  let history = useHistory();
  const [tab, setTab] = useState(cookies.user.type == 1 ? 0 : 1);
  const [users, setUsers] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    axios.get("http://104.131.115.65:3443/userTypes").then(function (response) {
      setUserTypes(response.data.type);
    });
    axios.get("http://104.131.115.65:3443/users").then(function (response) {
      setUsers(response.data.user);
    })
    axios
    .get("http://104.131.115.65:3443/department")
    .then(function (response) {
      setDepartments(response.data.department);
    });
  }, []);
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
              marginTop: '8px'
            }}
          >
            <span style={{ fontWeight: "100" }}>Welcome,</span> {user.name}
          </span>

        </h2>
 
        {user.type == 1 ? <>
          <li
          className={
            tab === 0 ? "secondary-li secondary-li-active" : "secondary-li"
          }
        >
          <a onClick={() => setTab(0)}>
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
          <a onClick={() => setTab(1)}>
            Upcoming Meetings
          </a>
        </li>
        <li
          className={
            tab === 2 ? "secondary-li secondary-li-active" : "secondary-li"
          }
        >
          <a onClick={() => setTab(2)}>
            Past Meetings
          </a>
        </li>

        {user.type == 1 ? <>
          <li
          className={
            tab === 3 ? "secondary-li secondary-li-active" : "secondary-li"
          }
        >
          <a onClick={() => setTab(3)}>
            Users
          </a>
        </li>
        </>
        :
        ''
        }
        <li
          className={
            tab === 5 ? "secondary-li secondary-li-active" : "secondary-li"
          }
        >
          <a onClick={() => setTab(5)}>
            My Files
          </a>
        </li>
        <li
          className={
            tab === 4 ? "secondary-li secondary-li-active" : "secondary-li"
          }
        >
          <a onClick={() => setTab(4)}>
            Last Location
          </a>
        </li>
        {user.type == 1 ? <>
          <li
          className={
            tab === 6 ? "secondary-li secondary-li-active" : "secondary-li"
          }
        >
          <a onClick={() => setTab(6)}>
            Generate User
          </a>
        </li>
        </>
        :
        ''
        }
      </ul>

      <div style={{ padding: "10px 200px" }}>
        {tab === 0 ? <MeetingScheduler /> : ""}
        {tab === 1 ? <UpcomingMeetings user={user} cookies={cookies} /> : ""}
        {tab === 2 ? <PastMeetings user={user} cookies={cookies} /> : ""}
        {tab === 3 ? <Users /> : ""}
        {tab === 4 ? <LastLocation /> : ""}
        {tab === 5 ? <MyFiles /> : ""}
        {tab === 6 ? <GenerateUser /> : ""}
      </div>
    </>
  );
}