import React, {useState, useEffect} from "react";
import "./Navigation.css";
import SecondaryNavigation from './SecondaryNavigation'
import Login from '../Pages/Login/Login'
import MeetingPage from '../Pages/MeetingPage/MeetingPage'
import FeedbackPage from '../Pages/FeedbackPage/FeedbackPage'
import Account from '../Pages/Account/Account'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { useCookies } from 'react-cookie';

export default function ClippedDrawer() {
  const [user, setUser] = useState({})
  const [cookies, setCookie, removeCookie] = useCookies(['user']);

  useEffect(() => {
    if (cookies.user) {
      setUser(cookies.user);
    }
  }, [])

  return (
    <>
    <Router>
      <ul className="navigation">
        <li style={{ color: "white" }}>
          <p style={{ fontWeight: "600" }}>Meeting Scheduler Application</p>
        </li>

        {Object.keys(user).length !== 0 && user.constructor === Object ? <>
          <li style={{ float: "right" }}>
          <a href="/" onClick={() => {removeCookie('user')}}>Logout</a>
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
            { cookies.user ? <SecondaryNavigation user={user} cookies={cookies} /> : <Login setUser={setUser} setCookie={setCookie} /> }
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
        </Switch>
      </Router>
    </>
  );
}
