import React, { useState, useEffect } from "react";
import "./Navigation.css";
import SecondaryNavigation from './SecondaryNavigation'
import Login from '../Pages/Login/Login'
import MeetingPage from '../Pages/MeetingPage/MeetingPage'
import FeedbackPage from '../Pages/FeedbackPage/FeedbackPage'
import Account from '../Pages/Account/Account'
import Notification from '../Pages/Notifications/Notification'
import axios from "axios";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { useCookies } from 'react-cookie';

var schedule = require('node-schedule');

export default function ClippedDrawer() {
  const [user, setUser] = useState({})
  const [meeting, setMeeting] = useState({})
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const [meetingUsers, setMeetingUsers] = useState([]);
  const [completedRun, setCompletedRun] = React.useState(false);


  useEffect(() => {
    if (cookies.user) {
      setUser(cookies.user);
    }
    if (cookies.user) {
    axios
      .get(`http://104.131.115.65:3443/userMeetings/${cookies.user.u_id}`)
      .then(function (response) {
        setMeetingUsers(response.data.meeting);
        console.log(response.data.meeting);
      });
    }
  }, [])
  window.setInterval(function () {
    if (cookies.user.notification == 1) {
      scheduledJob();
    }
  }, 60000)
  const scheduledJob = (event) => {
    if (completedRun != true) {
      setCompletedRun(true);
      console.log("Schedule Job");
      console.log("meetingUsers: " + meetingUsers);
      for (var i = 0; i < meetingUsers.length; i++) {
        var starttime = (new Date(meetingUsers[i].start_date_time)).getTime();
        const meeting_id = meetingUsers[i].meeting_id;
        const meeting_title = meetingUsers[i].meeting_title;
        console.log("title: " + meetingUsers[i].meeting_title);
        console.log("start: " + starttime);
        var currentDateTime = (new Date()).getTime() - 20700000;
        console.log("cdt: " + currentDateTime);
        console.log("diff: " + (Math.abs((starttime - currentDateTime))));
        if (Math.abs((starttime - currentDateTime)) < 60000) {
          window.open("http://104.131.115.65:3000/Notification/" + meeting_title, "Interviewer Reminder", "height=500,width=500")
          console.log(meetingUsers[i].meeting_title + " starts in 15 minutes");
        }
      }
    }
  }
  return (
    <>
      <Router>
        <ul className="navigation">
          <li style={{ color: "white" }}>
            <p style={{ fontWeight: "600" }}>Meeting Scheduler Application</p>
          </li>

          {Object.keys(user).length !== 0 && user.constructor === Object ? <>
            <li style={{ float: "right" }}>
              <a href="/" onClick={() => { removeCookie('user'); }}>Logout</a>
            </li>
            {/* <li style={{ float: "right" }}>
          <a href="/">Help</a>
        </li> */}
            <li style={{ float: "right" }}>
              <Link to="/Account">Account</Link>
            </li>
            <li className="active" style={{ float: "right" }}>
              <a href="/">Home</a>
            </li>
          </> : ''}
        </ul>

        <Switch>
          <Route exact path="/">
            {cookies.user ? <SecondaryNavigation user={user} cookies={cookies} /> : <Login setUser={setUser} setCookie={setCookie} />}
          </Route>
          <Route path="/meeting/:id">
            <MeetingPage user={user} />
          </Route>
          <Route path="/feedback/:id">
            <FeedbackPage user={user} />
          </Route>
          <Route path="/Account">
            <Account cookies={cookies} />
          </Route>
          <Route path="/Notification/:title">
            <Notification meeting={meeting} />
          </Route>
        </Switch>
      </Router>
    </>
  );
}
