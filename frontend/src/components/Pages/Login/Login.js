import React, {useState, useEffect} from "react";
import Paper from '@material-ui/core/Paper'
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from 'axios'
import { useHistory } from "react-router-dom";


export default function Login({setUser, setCookie}) {
    let history = useHistory();

    const handleClick = () => {
        const username = document.getElementById('login-email').value
        const password = document.getElementById('login-password').value

        axios
        .get(`http://localhost:3443/users/${username}/${password}`)
        .then(function (response) {
            console.log(response)
            const user = response.data.user;
            if (user.length != 0) {
                console.log(user)
                setCookie('user', user[0], { path: '/' });
                setUser(user[0])
                history.push("/dashboard");
            }
        });
    }

    return (
    <>
            <Paper elevation={3} style={{ padding: '10px 30px', width: '300px', margin: '100px auto 10px auto' }}>
                <h2>Login</h2>
                <TextField
                    label="Email"
                    id="login-email"
                    variant="outlined"
                    size="small"
                    style={{
                    width: "100%",
                    marginBottom: "10px",
                    }}
                />
                <TextField
                    label="Password"
                    id="login-password"
                    variant="outlined"
                    size="small"
                    type="password"
                    style={{
                    width: "100%",
                    marginBottom: "10px",
                    }}
                />
                <Button
                    variant="contained"
                    color="secondary"
                    style={{ width: "100%", marginBottom: '20px' }}
                    onClick={handleClick}
                >
                    Login
                </Button>
            </Paper>
            <center>
                {/*<p>
                    Need to create an account? <a href="#">Click here.</a>
                </p>
                */} 
            </center>
    </>
  );
}
