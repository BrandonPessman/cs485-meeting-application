import React, { useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import axios from 'axios'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'

export default function GenerateUser() {
    useEffect(() => {

    }, [])

    const handleGenerateUser = () => {
        let name = document.getElementById('create-candidate-name').value
        let email = document.getElementById('create-candidate-email').value
        let password = document.getElementById('create-candidate-password').value
        let phone_number = document.getElementById('create-candidate-phone').value

        let data = {
            name,
            email,
            u_password: password,
            phone_number,
            type: 2
        }
        axios.post("http://104.131.115.65:3443/insertUser", data)
        handleReset();
        console.log(name + " " + email + " " + password)
    }

    const handleReset = () => {
        document.getElementById('create-candidate-name').value = ""
        document.getElementById('create-candidate-email').value = ""
        document.getElementById('create-candidate-password').value = ""
        document.getElementById('create-candidate-phone').value = ""
    }

    return (
        <div>
            <h1>Let's create generate a user...</h1>
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