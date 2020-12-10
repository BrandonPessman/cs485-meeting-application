import React, { useState, useEffect, useReducer } from "react";
import axios from 'axios'
import { useParams } from "react-router";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useHistory } from "react-router-dom";

export default function Notification({ user }) {
    let history = useHistory();
    var { id } = useParams();
    const [meetings, setMeetings] = useState([]);
    useEffect(() => {
        console.log("id: " + id);
        axios
        .get("http://104.131.115.65:3443/meetingUsers", {u_id: id })
        .then(function (response) {
            console.log(response.data);
            setMeetings(response.data.meeting);
        })
    })
    return (
       <div>
           <h1>Meeting Reminder</h1>
           <p>You have a meeting in 15 minutes. {id}</p>
           <p>Please exit out of this window to dismiss the reminder.</p>
       </div> 
    )
}