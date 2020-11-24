import React, {useState, useEffect} from "react";
import Paper from '@material-ui/core/Paper'
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from 'axios'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useHistory } from "react-router-dom";


export default function Login({cookies}) {
    const [accountName, setAccountName] = useState(cookies.user.name);
    const [accountEmail, setAccountEmail] = useState(cookies.user.email);
    const [accountPhoneNumber, setAccountPhoneNumber] = useState(cookies.user.phone_number);
    const [accountPassword, setAccountPassword] = useState(cookies.user.u_password);
    const [accountType, setAccountType] = useState(cookies.user.type);
    const [accountTypeDescr, setAccountTypeDescr] = useState('');
    const [userTypes, setUserTypes] = useState([]);
    useEffect(() => {
        axios
        .get("http://localhost:3443/userTypes")
        .then(function (response) {
            setUserTypes(response.data.type);
        });
  }, []);
        const handleNameChange= (event, name) => {
            setAccountName(name);
        };
        const handleEmailChange = (event, email) => {
            setAccountEmail(email);
        };
        const handlePasswordChange = (event, password) => {
            setAccountPassword(password);
        };
        const handlePhoneNumberChange = (event, number) => {
            setAccountPhoneNumber(number);
        };
        const handleSelectType = (event, type) => {
            var chosenType = userTypes.filter(type => {
                return type.type_descr === type;
            });
            const { type_id } = chosenType[0];
            setAccountType(type_id);
        }
        const handleSave = (event) => {
            var updateAccount = {
                name: accountName,
                email: accountEmail,
                phone_number: accountPhoneNumber,
                password: accountPassword,
                type: accountType,
            };
            axios
            .patch("http://localhost:3443/user", updateAccount)
            .then(function (response) {
                console.log(response);
            });
        }
    return (
    <>
                <h2>Welcome, { accountName }</h2>
            <Paper
              container
              xs={12}
              style={{ margin: "50px auto", width: "75%", height:"75%", padding: "40px" }}
              >
              <h1>Manage your Account</h1>
            
            <TextField
              label="Name"
              id="create-candidate-name"
              variant="outlined"
              size="small"
              value = { accountName }
              style={{
                width: "100%",
                marginBottom: "10px",
              }}
              onChange={(event) => handleNameChange(event, document.getElementById('create-candidate-name').value)}
            />
            <TextField
              label="email"
              id="create-candidate-email"
              variant="outlined"
              size="small"
              value={ accountEmail }
              style={{
                width: "100%",
                marginBottom: "10px",
              }}
              onChange={(event) => handleEmailChange(event, document.getElementById('create-candidate-email').value)}
            />
            <TextField
              label="Phone Number"
              id="create-candidate-number"
              variant="outlined"
              size="small"
              value={ accountPhoneNumber }
              style={{
                width: "100%",
                marginBottom: "10px",
              }}
              onChange={(event) => handlePhoneNumberChange(event, document.getElementById('create-candidate-number').value)}
            />
            <TextField
              label="Password"
              id="create-candidate-password"
              variant="outlined"
              size="small"
              value={ accountPassword }
              style={{
                width: "100%",
                marginBottom: "10px",
              }}
              onChange={(event) => handlePasswordChange(event, document.getElementById('create-candidate-password').value)}
            />
            <TextField
              id="existing-candidate-type"
              variant="outlined"
              size="small"
              value={ accountType }
              style={{
                width: "100%",
                marginBottom: "10px",
              }}
              disabled = {true}
              onChange={(event) => handlePasswordChange(event, document.getElementById('create-candidate-password').value)}
            />
            <Autocomplete
              id="create-candidate-type"
              options={userTypes}
              getOptionLabel={(option) => option.type_descr}
              style={{ width: "100%", margin: "10px 0" }}
              defaultValue={accountTypeDescr}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label = "Change Type"
                  variant="outlined"
                  style={{ width: "100%" }}
                />
              )}
            />
            <Button
              variant='contained'
              color='default'
              style={{ marginLeft: '20px', float: 'right' }}
              onClick={ (event) => handleSelectType(event, document.getElementById('create-candidate-type').value) }
            > Select Type</Button>
            <Button
              variant='contained'
              color='default'
              style={{ marginLeft: '20px', float: 'center' }}
              onClick={ handleSave }
            > Save Changes</Button>
          </Paper>
    </>
  );
}