import React, {useState, useEffect} from "react";
import "./Navigation.css";
import SecondaryNavigation from './SecondaryNavigation'
import Login from '../Pages/Login/Login'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation
} from "react-router-dom";


export default function ClippedDrawer() {
  const [logged, setLogged] = useState(false)
  const [user, setUser] = useState({})

  return (
    <>
    <Router>
      <ul className="navigation">
        <li style={{ color: "white" }}>
          <p style={{ fontWeight: "600" }}>Meeting Scheduler Application</p>
        </li>

        {Object.keys(user).length !== 0 && user.constructor === Object ? <>
          <li style={{ float: "right" }}>
          <a href="/">Logout</a>
        </li>
        <li style={{ float: "right" }}>
          <a href="#news">Help</a>
        </li>
        <li style={{ float: "right" }}>
          <a href="#contact">Account</a>
        </li>
        <li className="active" style={{ float: "right" }}>
          <a href="#about">Home</a>
        </li> 
        </> : ''}
      </ul>

        <Switch>
          <Route exact path="/">
            <Login setUser={setUser} />
          </Route>
          <Route path="/dashboard">
            <SecondaryNavigation user={user} />
          </Route>
        </Switch>
      </Router>
    </>
  );
}
