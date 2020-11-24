import React, { useState, useEffect } from "react";
import axios from 'axios'
import { useParams } from "react-router";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useHistory } from "react-router-dom";

export default function MeetingPage({ user }) {
  let { id } = useParams();
  const [users, setUsers] = useState([]);
  const [meeting, setMeeting] = useState({})
  const [selectedUsers, setSelectedUsers] = useState([])
  const [positions, setPositions] = useState([])
  const [locations, setLocations] = useState([])
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [chosenUsers, setChosenUsers] = useState([])
  const [warning, openWarning] = React.useState(false);
  const [warningContent, setWarningContent] = useState([]);
  const [chosenLocation, setChosenLocation] = useState("");
  const [chosenPosition, setChosenPosition] = useState({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("")
  const [availableLocations, setAvailableLocations] = useState([]);
  const [finished, setFinished] = React.useState(false);

  let history = useHistory();

  useEffect(() => {
    console.log(user)
    var meeting_id = id;
    axios
    .get(`http://localhost:3443/meetingUser/${meeting_id}`)
    .then(function (userData) {
        console.log("DATA: " + userData.data.user)
        setSelectedUsers(userData.data.user)
        axios
        .post(`http://localhost:3443/getSpecificMeeting/`, {meeting_id: id})
        .then(function (meetingResponse) {
            console.log(meetingResponse.data.Meeting[0])
            setMeeting(meetingResponse.data.Meeting[0])
            const initData = meetingResponse.data.Meeting[0];

            let start = initData.start_date_time
            let end = initData.end_date_time
            start = start.slice(0, start.indexOf("."))
            end = end.slice(0, end.indexOf("."))

            setStartDate(start);
            setEndDate(end);
            setTitle(initData.meeting_title);
            setDescription(initData.meeting_descr);
            console.log("looking")
            axios
            .get("http://localhost:3443/locations")
            .then(function (locationData) {
            console.log(locationData.data)
              setLocations(locationData.data.location)
              for (let i = 0; i < locationData.data.location.length; i++) {
                  console.log("location_id: " + initData.location_id);
                  if (initData.location_id == locationData.data.location[i].location_id) {
                      setChosenLocation(locationData.data.location[i].name)
                  }
              }
            });
            axios.get("http://localhost:3443/positions").then(function (response) {
              setPositions(response.data.positions);
              for (let i = 0; i<response.data.position.length; i++) {
                if (initData.position_id == response.data.position[i].position_id) {
                  setChosenPosition(response.data.position[i].title)
                }
              }
              });
        });
    });

    axios.get("http://localhost:3443/users").then(function (response) {
        setUsers(response.data.user);
      });

      axios.get("http://localhost:3443/positions").then(function (response) {
        setPositions(response.data.positions);
      });
}, [])

  const handleDeleteUser = (event) => {
    const selectedIndex = event.nativeEvent.target.selectedIndex;
    let list = selectedUsers.splice(selectedIndex, 1);
    setSelectedUsers(list)
    console.log(selectedUsers)
  }

  const handleStartDate = (event, newDate) => {
    console.log(users);
    setStartDate(document.getElementById("create-event-starttime").value);
    console.log("Start Date" + document.getElementById("create-event-starttime").value);
    if (startDate > endDate) {
      setWarningContent("Invalid time combination.");
      openWarning(true);
      setTimeout(() => { openWarning(false); }, 15000);
    }
  };
  const handleEndDate = (event, newDate) => {
    console.log("handleEndDate");
    setEndDate(document.getElementById("create-event-endtime").value);
    console.log("End date" + document.getElementById("create-event-endtime").value);
    /*if (endDate>startDate) {
      setWarningContent("Invalid time combination.");
      openWarning(true);
      setTimeout(() => { openWarning(false);}, 15000);
    }*/
    if (startDate != null) {
      console.log("GetAvailableLocations");
      const availableLocationData = { start_date_time: startDate, end_date_time: endDate };
      console.log(availableLocationData);
      if (startDate && endDate) {
        axios
          .get("http://localhost:3443/availableLocations", { data: availableLocationData })
          .then(function (results) {
            console.log(results)
            setLocations(results.data.location)
          });
      }
    }
  };
  const handleAddUser = () => {
    var userVal = document.getElementById("adding-user-textfield").value;
    if (userVal != "") {
      var selectedUser = users.filter(user => {
        return user.name === userVal;
      })
      const { u_id } = selectedUser[0];
      setSelectedUsers(selectedUsers.concat({ user: userVal, role: 0 }));
      setChosenUsers(chosenUsers.concat({ u_id: u_id }));
      let userData = { u_id: u_id, start_date_time: startDate, end_date_time: endDate };
      axios
        .get("http://localhost:3443/userAvailability", { data: userData })
        .then(function (results) {
          console.log("results: " + results.data);
          if (results.data.userAvailability == 0) {
            setWarningContent("Availability conflict with user: " + userVal + ". They're attending " + results.data.meeting_title + " at that time.");
            openWarning(true);
            setTimeout(() => { openWarning(false); }, 30000);
          }
        });
      userVal = null;
    } else {
      setWarningContent("No user selected.");
      openWarning(true);
      setTimeout(() => { openWarning(false); }, 2000);
    }
    console.log("selectedUsers: " + selectedUsers);
  };
  const handleChosenLocation = () => {
    var locationVal = document.getElementById("create-event-location").value;
    if (locationVal != "") {
      console.log("handleChosenLocation");
      var chosenLoc = locations.filter(location => {
        return location.name === locationVal;
      })
      const { location_id } = chosenLoc[0];
      setChosenLocation(location_id);
      console.log(location_id);
    } else {
      setWarningContent("No position chosen");
      openWarning(true);
      setTimeout(() => { openWarning(false); }, 2000);
    }
  }
  const handleChosenPosition = () => {
    var positionVal = document.getElementById("create-event-position").value;
    if (positionVal != "") {
      var chosenPos = positions.filter(position => {
        return position.title === positionVal;
      })
      const { position_id } = chosenPos[0];
      setChosenPosition(position_id);
      console.log(position_id);
    }
    else {
      setWarningContent("No position chosen");
      openWarning(true);
      setTimeout(() => { openWarning(false); }, 2000);
    }
  }
  const handleUpdateMeeting = () => {
  for (let i = 0; i < locations.length; i++) {   
    if (chosenLocation === locations[i].name) {
        setChosenLocation(locations[i].location_id);
    }
  }
  /*
  
  for (let i = 0; i<positions.length; i++) {
    if (chosenPosition === positions[i].title) {
      setChosenPosition(positions[i].position_id);
    }
  }*/
    const newMeeting = {
      meeting_title: title,
      meeting_descr: description,
      location_id: chosenLocation,
      position_id: chosenPosition,
      start_date_time: startDate,
      end_date_time: endDate,
    }
    axios.patch("http://localhost:3443/updateMeeting", newMeeting)
    .then(function (response) {
      console.log(response);
    });
  };

  return (
    <>{title === "" || description === "" ? '' || startDate === "" || endDate === "" || chosenLocation === "" :
      <Paper
        container
        xs={12}
        style={{ margin: "50px auto", width: "600px", padding: "40px" }}
      >
        <h1>Edit Meeting</h1>
        <h2>{title}</h2>
        <TextField
          label="Title"
          id="create-event-title"
          variant="outlined"
          size="small"
          defaultValue={title}
          style={{
            width: "100%",
            marginBottom: "10px",
          }}
        />
        <TextField
          label="Description"
          id="create-event-desc"
          variant="outlined"
          defaultValue={description}
          size="small"
          style={{
            width: "100%",
            marginBottom: "10px",
          }}
        />
        <TextField
          id="create-event-starttime"
          label="Start Time"
          type="datetime-local"
          defaultValue={startDate}
          onChange={handleStartDate}
          InputLabelProps={{
            shrink: true,
          }}
          style={{ margin: "10px 0", width: "100%" }}
        />
        <TextField
          id="create-event-endtime"
          label="End Time"
          type="datetime-local"
          defaultValue={endDate}
          onChange={handleEndDate}
          InputLabelProps={{
            shrink: true,
          }}
          style={{ margin: "10px 0", width: "100%" }}
        />
        {/* Adding Users fields
               1. Autocomplete field for users
               2. List of added users
               3. Role selector for each user
               4. Clicking on users to remove them
               5. Have it so when you hit enter it adds a users
          */}
        <TextField
          id="existing-location"
          disabled={true}
          value={chosenLocation}
          InputLabelProps={{
            shrink: true,
          }}
          style={{ margin: "10px 0", width: "100%" }}
        />
        <Autocomplete
          id="create-event-location"
          options={availableLocations.map(l => ({ value: l.location_id, label: l.name }))}
          getOptionLabel={(option) => String(option.label)}
          style={{ width: "100%", margin: "10px 0" }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Add a Location"
              variant="outlined"
              defaultValue={chosenLocation}
              style={{ width: "100%" }}
            />
          )}
        />
        <Button
          id="create-location-button"
          onClick={handleChosenLocation}
          variant="contained"
          color="primary"
          style={{ width: "100%" }}
        >
          Add Location
            </Button>
        <TextField
          disabled={true}
          id="existing-position"
          value={chosenPosition}
          InputLabelProps={{
            shrink: true,
          }}
          style={{ margin: "10px 0", width: "100%" }}
        />
        <Autocomplete
          id="create-event-position"
          options={positions}
          getOptionLabel={(option) => option.title}
          style={{ width: "100%", margin: "10px 0" }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Add a Position"
              variant="outlined"
              style={{ width: "100%" }}
            />
          )}
        />
        <Button
          id="create-location-button"
          onClick={handleChosenPosition}
          variant="contained"
          color="primary"
          style={{ width: "100%" }}
        >
          Add Position
            </Button>
        <p>
          Users:{" "} {selectedUsers.length == 0 ? "None" : ""}
          {selectedUsers.map((u, i) => {
            return <button 
            variant = 'contained'x
            color = 'default'
            style={{ width: "45%" }}
            key={i} onClick={handleDeleteUser}>{u.name}</button>;
          })}
        </p>
        <Autocomplete
          id="adding-user-textfield"
          options={users}
          getOptionLabel={(option) => option.name}
          style={{ width: "100%", margin: "10px 0" }}
          renderInput={(params) => (
            <TextField
              {...params}
              defaultValue={users}
              label="Add a User"
              variant="outlined"
              style={{ width: "100%" }}
            />
          )}
        />
        <Button
          variant="contained"
          color="primary"
          style={{ width: "100%" }}
          onClick={handleAddUser}
        >
          Add User
          </Button>
        <Button
          variant="contained"
          color="secondary"
          style={{ width: "45%" }}
          onClick={handleUpdateMeeting}
        >
          Update
          </Button>
        <Button
          variant="contained"
          color="default"
          style={{ float: "right", width: "45%" }}
          onClick={() => {
            history.goBack();
          }}
        >
          Cancel
          </Button>
      </Paper>
    }
    </>
  );
}
