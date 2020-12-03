import React, { useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import axios from 'axios'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Autocomplete from "@material-ui/lab/Autocomplete";

export default function GenerateUser() {

    const [userTypes, setUserTypes] = useState([]);  
    useEffect(() => {
      axios.get("http://104.131.115.65:3443/userTypes").then(function (response) {
      setUserTypes(response.data.type);
    });
    }, [])

    const nodemailer = require("nodemailer");

    const handleGenerateUser = () => {
        let name = document.getElementById('create-candidate-name').value
        let email = document.getElementById('create-candidate-email').value
        let password = document.getElementById('create-candidate-password').value
        let phone_number = document.getElementById('create-candidate-phone').value
        var chosenType = userTypes.filter(type => {
          return type.type_descr === document.getElementById('create-candidate-type').value;
        });
        const { type_id } = chosenType[0];

        let data = {
            name,
            email,
            u_password: password,
            phone_number,
            type: type_id,
        }
        axios.post("http://104.131.115.65:3443/insertUser", data)
        .then(function (results) {
          console.log(results);
        });
        console.log(name + " " + email + " " + password + " " + phone_number + " " + type_id);
        var to = email;
        var subject = "Welcome to Interviewer";
        var text = "Please accept your Interviewer account by using the following password, with your email: " + password;
        axios
        .post(`http://localhost:3443/sendEmail/${email}/${subject}/${text}`)
        .then(function (results) {
          console.log("results: " + results);
        });
        //handleReset();
    }

    const handleReset = () => {
        document.getElementById('create-candidate-name').value = ""
        document.getElementById('create-candidate-email').value = ""
        document.getElementById('create-candidate-password').value = ""
        document.getElementById('create-candidate-phone').value = ""
        document.getElementById('create-candidate-type').value = ""
    }

    return (
        <div>
            <h1>Create a User</h1>
            <p>An email will be sent to the email address given for the user providing their password that is created below.</p>
            <h2>Name</h2>
            <TextField
              label="Name"
              id="create-candidate-name"
              variant="outlined"
              size="small"
              style={{
                width: "100%",
                marginBottom: "10px",
              }}
              />
            <h2>Email</h2> 
            <TextField
              label="Email"
              id="create-candidate-email"
              variant="outlined"
              size="small"
              style={{
                width: "100%",
                marginBottom: "10px",
              }}
               />
            <h2>Password</h2>
            <TextField
              label="Password"
              id="create-candidate-password"
              variant="outlined"
              size="small"
              style={{
                width: "100%",
                marginBottom: "30px",
              }}
            />
            <h2>Phone</h2>
            <TextField
              label="Phone"
              id="create-candidate-phone"
              variant="outlined"
              size="small"
              style={{
                width: "100%",
                marginBottom: "30px",
              }}
            />
            <h2>User Type</h2>
            <p>Determines the capabilities/permissions of the user.</p>
            <Autocomplete
            id="create-candidate-type"
            options={userTypes.map(u => ({ value: u.type_id, label: u.type_descr }))}
            getOptionLabel={(option) => String(option.label)}
            style={{ width: "100%", margin: "10px 0" }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select a Type"
                variant="outlined"
                style={{ width: "100%" }}
              />
            )}
          />
            <Button 
                variant='contained'
                color='primary'
                onClick = { handleGenerateUser }
            >
                Generate User
            </Button>
            <Button 
                variant='contained'
                color='default'
                onClick = { handleReset }
                style={{marginLeft: "20px"}}
            >
                Reset
            </Button>
        </div>
    )
}