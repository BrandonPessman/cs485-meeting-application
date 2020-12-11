import React, { useState, useEffect, Component } from "react";
import Paper from '@material-ui/core/Paper'
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from 'axios'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useHistory } from "react-router-dom";
import { useCookies } from 'react-cookie';
import Modal from "@material-ui/core/Modal";
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default function Login({ cookies }) {
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
  const [notification, setNotifications] = useState(cookies.user.notification);
  const [editAccount, setEditAccount] = React.useState(false);
  const [editPassword, setEditPassword] = React.useState(false);
  const [passedSecurity, setPassedSecurity] = React.useState(false);
  const [wrongOldPassword, setWrongOldPassword] = React.useState(false);
  const [mismatchedPassword, setMismatchedPassword] = React.useState(false);

  useEffect(() => {
    console.log("notification: " + cookies.user.notification);
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
  const toggleNotifications = (event) => {
    if (notification == 1) {
      console.log("notifications true!");
      setNotifications(0);
      cookies.user.notification = 0;
    } else {
      console.log("notifications false!");
      setNotifications(1);
      cookies.user.notification = 1;
    }
  }
  const handleEditAccount = (event) => {
    setEditAccount(true);
  }
  const handleNameChange = (event, name) => {
    setAccountName(name);
    cookies.user.name = name;
  };
  const handleEmailChange = (event, email) => {
    setAccountEmail(email);
    cookies.user.email = email;
  };
  const handlePasswordChange = (event, password) => {
    setAccountPassword(password);
    cookies.user.u_password = password
  };
  const handlePhoneNumberChange = (event, number) => {
    setAccountPhoneNumber(number);
    cookies.user.phone_number = number;
  };
  const handleSelectType = (event, type) => {
    setAccountTypeDescr(type);
    console.log("handleSelectType: " + type);
    for (var i = 0; i < userTypes.length; i++) {
      console.log("UTT: " + userTypes[i].type_id);
      var type_id = userTypes[i].type_id;
      if (userTypes[i].type_descr == type) {
        console.log("In if: " + type_id);
        setAccountType(userTypes[i].type_id);
        cookies.user.type = userTypes[i].type_id;
      }
    }
    console.log("AT: " + accountType);
  }
  const handleSave = (event) => {
    var updateAccount = {
      u_id: accountID,
      name: accountName,
      email: accountEmail,
      phone_number: accountPhoneNumber,
      u_password: accountPassword,
      type: accountType,
    };
    axios
      .patch("http://104.131.115.65:3443/updateUser", updateAccount)
      .then(function (response) {
        console.log(response);
        axios
          .patch(`http://104.131.115.65:3443/updateUserNotification/${accountID}/${notification}`)
          .then(function (response) {
            console.log(response);
          });
      });
    setEditAccount(false);
  }

  const checkForDelete = (event) => {
    setOpenCheck(true);
  }
  const handleDeleteAccount = (event) => {
    axios
      .delete(`http://104.131.115.65:3443/deleteUser/${accountID}`,)
      .then(function (response) {
        console.log(response);
        setOpenCheck(false);
        removeCookie('user')
        history.push("/");
      })
  }
  const handleCloseCheck = (event) => {
    setOpenCheck(false);
  }
  const handleEditPassword = (event) => {
    setEditPassword(true);
  }
  const handlePasswordSubmit = (value) => {
    if (value === accountPassword) {
      setPassedSecurity(true);
      setWrongOldPassword(false);
    } else {
      setWrongOldPassword(true);
    }
  }
  const updatePassword = () => {
    if (document.getElementById('create-candidate-password-one').value === document.getElementById('create-candidate-password-one-confirm').value) {
      setAccountPassword(document.getElementById('create-candidate-password-one').value);
      setPassedSecurity(false);
      setEditPassword(false);
      setMismatchedPassword(false);
    }else{
      setMismatchedPassword(true);
    }
  }
  return (
    <>
      <h2>Welcome, {accountName}</h2>
      <Paper
        container
        xs={12}
        style={{ margin: "50px auto", width: "75%", height: "75%", padding: "40px" }}
      >
        <Button
          variant="contained"
          color="primary"
          disabled={editAccount ? true : false}
          style={{ width: "25%" }}
          onClick={handleEditAccount}
        > Edit Account </Button>
        <h1>Manage your Account</h1>
        <Button
          variant="contained"
          color="default"
          style={{ float: 'left', height: "30px", marginBottom: "30px" }}
          disabled={editAccount ? false : true}
          onClick={handleEditPassword}
        >Change Password</Button>
        <Modal
          open={editPassword}
          onClose={() => {
            setEditPassword(false);
          }}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <Paper
            container
            xs={12}
            style={{ margin: "50px auto", width: "300px", padding: "40px" }}
          >
            <h1>Change password</h1>
            {editPassword ? <div><TextField
              label="Enter Old Password"
              id="create-candidate-password"
              disabled={editAccount ? false : true}
              variant="outlined"
              type="password"
              size="small"
              style={{
                width: "100%",
                marginBottom: "10px",
              }}
            />
            {wrongOldPassword ? <p>Incorrect Password - try again</p>: <></>}
              <Button
                variant="contained"
                color="default"
                style={{ float: 'left', height: "30px", marginBottom: "30px" }}
                disabled={editAccount ? false : true}
                onClick={(event) => handlePasswordSubmit(document.getElementById('create-candidate-password').value)}
              >Submit</Button></div> : <div></div>}
            {(editPassword && passedSecurity) ? <div><TextField
              label="New Password"
              id="create-candidate-password-one"
              disabled={editAccount ? false : true}
              variant="outlined"
              size="small"
              type="password"
              style={{
                width: "100%",
                marginBottom: "10px",
              }}
            />
              <TextField
                label="Confirm New Password"
                id="create-candidate-password-one-confirm"
                disabled={editAccount ? false : true}
                variant="outlined"
                type="password"
                size="small"
                style={{
                  width: "100%",
                  marginBottom: "10px",
                }} />
                {mismatchedPassword ? <p>Passwords do not match.</p> : <></>}
              <Button
                variant="contained"
                color="default"
                style={{ float: 'left', height: "30px", marginBottom: "30px" }}
                disabled={editAccount ? false : true}
                onClick={updatePassword}
              >Submit Password</Button>
            </div> : <div></div>}
          </Paper>
        </Modal>
        <TextField
          label="Meeting Notification"
          id="create-candidate-notification"
          disabled={editAccount ? false : true}
          variant="outlined"
          size="small"
          value={notification == 1 ? 'On' : 'Off'}
          style={{
            width: "100%",
            marginBottom: "10px",
          }}
          onChange={(event) => handleNameChange(event, document.getElementById('create-candidate-name').value)}
        />
        <Button
          variant="contained"
          color="default"
          style={{ float: 'left', height: "30px", marginBottom: "30px" }}
          disabled={editAccount ? false : true}
          onClick={toggleNotifications}
        >Toggle Notifications</Button><br></br>
        <i>*For this change to activate notifications, you must logout and log back in. </i>
        <TextField
          label="Name"
          id="create-candidate-name"
          disabled={editAccount ? false : true}
          variant="outlined"
          size="small"
          value={accountName}
          style={{
            width: "100%",
            marginBottom: "10px",
          }}
          onChange={(event) => handleNameChange(event, document.getElementById('create-candidate-name').value)}
        />
        <TextField
          label="email"
          id="create-candidate-email"
          disabled={editAccount ? false : true}
          variant="outlined"
          size="small"
          value={accountEmail}
          style={{
            width: "100%",
            marginBottom: "10px",
          }}
          onChange={(event) => handleEmailChange(event, document.getElementById('create-candidate-email').value)}
        />
        <TextField
          label="Phone Number"
          id="create-candidate-number"
          disabled={editAccount ? false : true}
          variant="outlined"
          size="small"
          value={accountPhoneNumber}
          style={{
            width: "100%",
            marginBottom: "10px",
          }}
          onChange={(event) => handlePhoneNumberChange(event, document.getElementById('create-candidate-number').value)}
        />
        <TextField
          id="existing-candidate-type"
          variant="outlined"
          size="small"
          label="User Type"
          value={accountTypeDescr}
          style={{
            width: "100%",
            marginBottom: "10px",
          }}
          disabled={true}
          onChange={(event) => handlePasswordChange(event, document.getElementById('create-candidate-password').value)}
        />
        {((accountType > 2) && editAccount) ? <div><Autocomplete
          id="create-candidate-type"
          options={userTypes}
          getOptionLabel={(option) => option.type_descr}
          style={{ width: "100%", margin: "10px 0" }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Change Type"
              variant="outlined"
              style={{ width: "100%" }}
            />
          )}
        />
          <Button
            variant='contained'
            color='default'
            style={{ marginLeft: '20px', float: 'right' }}
            onClick={(event) => handleSelectType(event, document.getElementById('create-candidate-type').value)}
          > Select Type</Button><p>Please click "Select Type" before clicking "Save Changes" if you're attempting to change your user type.</p></div> : <></>}
          {(accountType<3 && editAccount) ? <p>You do not have the permissions to change your User Type. </p>:<></>}
        <Button
          variant='contained'
          color='primary'
          disabled={editAccount ? false : true}
          style={{ marginLeft: '20px', float: 'center' }}
          onClick={handleSave}
        > Save Changes</Button>
        <Button
          variant='contained'
          color='default'
          disabled={editAccount ? false : true}
          style={{ marginLeft: '20px', float: 'center' }}
          onClick={(event) => setEditAccount(false)}
        >Cancel</Button>
        <br></br><br></br>
        <Button
          variant="contained"
          color="secondary"
          style={{ marginLeft: '25%', float: 'center', width: "50%" }}
          onClick={checkForDelete}
        >Delete my Account</Button>
      </Paper>
      <Modal
        open={openCheck}
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
            onClick={handleDeleteAccount}
          >Delete Account</Button>
            <Button
              variant="contained"
              color="secondary"
              style={{ marginleft: '20px', float: 'right' }}
              onClick={handleCloseCheck}
            >Cancel</Button></div><br></br>
        </Paper>
      </Modal>
    </>
  );
}