import React, { useState, useEffect, useReducer } from "react";
import axios from 'axios'
import { useParams } from "react-router";
import Grid from '@material-ui/core/Grid'
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useHistory } from "react-router-dom";

export default function Notification({ meeting }) {
    let history = useHistory();
    var { title } = useParams();


    useEffect(() => {
        console.log("title: " + title);
    })
    return (
        <div>
            <h1>Meeting Reminder</h1>
            <p>You have a meeting, {title} in 15 minutes.</p>
            <p>Please exit out of this window to dismiss the reminder.</p>
        </div>
    )
}