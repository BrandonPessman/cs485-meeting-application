import React, {useState, useEffect} from "react";
import Paper from '@material-ui/core/Paper'
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from 'axios'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useHistory } from "react-router-dom";
import { useCookies } from 'react-cookie';
import Modal from "@material-ui/core/Modal";

export default function Login({cookies}) {
    let history = useHistory();
    const [removeCookie] = useCookies(['user']);
    const [accountName, setAccountName] = useState(cookies.user.name);
    const [accountEmail, setAccountEmail] = useState(cookies.user.email);
    const [accountPhoneNumber, setAccountPhoneNumber] = useState(cookies.user.phone_number);
    const [accountPassword, setAccountPassword] = useState(cookies.user.password);
    const [accountType, setAccountType] = useState(cookies.user.type);
    const [accountID, setAccountID] = useState(cookies.user.u_id);
    const [accountTypeDescr, setAccountTypeDescr] = useState('');
    const [userTypes, setUserTypes] = useState([]);
    const [openCheck, setOpenCheck] = React.useState(false);
    useEffect(() => {
      console.log("useEffect");
        axios
        .get("http://104.131.115.65:3443/userTypes")
        .then(function (response) {
            console.log(response.data);
            setUserTypes(response.data.type);
            var chosenType = response.data.type.filter(type => {
              return type.type_id == cookies.user.type;
            })
            const { type_descr } = chosenType[0];
            setAccountTypeDescr(type_descr)
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
            .patch("http://104.131.115.65:3443/user", updateAccount)
            .then(function (response) {
                console.log(response);
            });
        }

        const checkForDelete = (event) => {
          setOpenCheck(true);
        }
        const handleDeleteAccount = (event) => {
          axios
          .delete(`http://104.131.115.65:3443/deleteUser/${accountID}`, )
          .then(function (response) {
            console.log(response);
            setOpenCheck(false);
            removeCookie('user')
            history.push("/login");
          })
        }
        const handleCloseCheck = (event) => {
          setOpenCheck(false);
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
              label="User Type"
              value={ accountTypeDescr }
              style={{
                width: "100%",
                marginBottom: "10px",
              }}
              disabled = {true}
              onChange={(event) => handlePasswordChange(event, document.getElementById('create-candidate-password').value)}
            />
            {(accountType != 2) ? <div><Autocomplete
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
            > Select Type</Button></div> : <p>You do not have the permissions to change your User Type. </p>}
            <Button
              variant='contained'
              color='default'
              style={{ marginLeft: '20px', float: 'center' }}
              onClick={ handleSave }
            > Save Changes</Button>
            <br></br><br></br>
            <Button
            variant="contained" 
            color="secondary"
            style={{marginLeft:'25%', float:'center', width:"50%" }}
            onClick = { checkForDelete }
            >Delete my Account</Button>
          </Paper>
          <Modal
            open={ openCheck }
            onClose={() => {
              setOpenCheck(false);
            }}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            <Paper
              container
              xs={12}
              style={{ margin: "50px auto", width: "300px", height: "auto", padding: "40px" }}
            >
            Are you sure you want to delete your account? <br></br>This is an irreversible action, and your account will have to be created by an Interviewer admin.<br></br><br></br>
              <div><Button
              variant="contained"
              color="secondary"
              style={{ marginleft: '20px', float: 'left' }}
              onClick={ handleDeleteAccount }
              >Delete Account</Button>
              <Button 
              variant="contained" 
              color="secondary"
              style={{ marginleft: '20px', float: 'right' }}
              onClick = { handleCloseCheck }
              >Cancel</Button></div><br></br>
        </Paper>
      </Modal>
    </>
  );
}