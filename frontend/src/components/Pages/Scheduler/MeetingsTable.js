import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles"; // lighten, withTheme
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const months = {
  0: "January",
  1: "February",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "September",
  9: "October",
  10: "November",
  11: "December",
};

// id, location, users, start_time, end_time
function createData(title, location, startTime, endTime, date) {
  return {
    title,
    location,
    startTime,
    endTime,
    date:
      months[date.getMonth()] +
      " " +
      date.getDate() +
      ", " +
      date.getFullYear(),
  };
}

/*const rows = [
  createData("Meeting with Dr. Johnson", "Phillips 116", 10, 10, new Date()),
  createData("Meeting with Dr. Tan", "Phillips 115", 5, 5, new Date()),
  createData("Research Talk to CS 252 Class", "Phillips 115", 5, 5, new Date()),
];*/

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "title",
    numeric: false,
    disablePadding: true,
    label: "Title",
  },
  {
    id: "location",
    numeric: true,
    disablePadding: false,
    label: "Location",
  },
  {
    id: "date",
    numeric: true,
    disablePadding: false,
    label: "Date",
  },
  {
    id: "startTime",
    numeric: true,
    disablePadding: false,
    label: "Start Time",
  },
  {
    id: "endTime",
    numeric: true,
    disablePadding: false,
    label: "End Time",
  },
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all meetings" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight: {
    color: "white",
    backgroundColor: "rgb(27, 14, 83)",
  },
  title: {
    flex: "1 1 100%",
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
          <Typography
            className={classes.title}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Select a Meeting
          </Typography>
        )}

      {/* {numSelected > 0 ? (
        <Tooltip title='Delete'>
          <IconButton aria-label='delete'>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title='Filter list'>
          <IconButton aria-label='filter list'>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )} */}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));
export default function EnhancedTable({ setShowNextStep }) {

  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("title");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [newMeetingOpen, setNewMeetingOpen] = React.useState(false);
  const [users, setUsers] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [selectedUsers, setselectedUsers] = useState([]);
  const [locations, setLocations] = useState([])
  const [availableLocations, setAvailableLocations] = useState([])
  const [startDate, setStartDate] = useState([])
  const [endDate, setEndDate] = useState([])
  const [positions, setPositions] = useState([]);
  const [warning, openWarning] = React.useState(false);
  const [warningContent, setWarningContent] = useState([]);
  const [chosenLocation, setChosenLocation] = useState([]);
  const [chosenPosition, setChosenPosition] = useState([]);
  const [chosenUsers, setChosenUsers] = useState([]);


  useEffect(() => {
    axios.get("http://localhost:3443/users").then(function (response) {
      setUsers(response.data.user);
    });

    axios.get("http://localhost:3443/meetingsExtra").then(function (response) {
      setMeetings(response.data.meeting);
    });
    axios.get("http://localhost:3443/positions").then(function (response) {
      setPositions(response.data.position);
    });
    axios
      .get("http://localhost:3443/locations")
      .then(function (locationData) {
        setLocations(locationData.data.location)
      });
  }, []);
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
    const t = document.getElementById("create-event-endtime").value;
    console.log("ENDDATE: " + t);
    setEndDate(t);
    if (startDate && endDate) {
      console.log("Start date" + startDate + "end date" + t);
      axios
        .get(`http://localhost:3443/availableLocations/${startDate}/${t}`)
        .then(function (results) {
          console.log("result: " + results.data.sql)
          setAvailableLocations(results.data.location)
        }); 
    }
  };
  const handleAddUser = () => {
    console.log(meetings);
    var userVal = document.getElementById("adding-user-textfield").value;
    if (userVal != "") {
      var selectedUser = users.filter(user => {
        return user.name === userVal;
      })
      const { u_id } = selectedUser[0];
      setselectedUsers(selectedUsers.concat({ user: userVal, role: 0 }));
      setChosenUsers(chosenUsers.concat({ u_id: u_id }));
      let userData = { u_id: u_id, start_date_time: startDate, end_date_time: endDate };
      axios
        .get(`http://localhost:3443/userAvailability/${u_id}/${startDate}/${endDate}`)
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
      var chosenLoc = availableLocations.filter(location => {
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
  const handleCreateMeeting = () => {
    const newMeeting = {
      meeting_title: document.getElementById("create-event-title").value,
      meeting_descr: document.getElementById("create-event-desc").value,
      location_id: chosenLocation,
      start_date_time: startDate,
      end_date_time: endDate,
      position_id: chosenPosition,
      users: chosenUsers,
    };
    if (endDate<=startDate) {
      setWarningContent("Invalid time combination.");
      openWarning(true);
      setTimeout(() => { openWarning(false);}, 15000);
    }else{
    console.log(newMeeting);
    axios.post("http://localhost:3443/insertMeeting", newMeeting)
      .then(result => {
        console.log(result);
        if (result.data.error != null) {
          setWarningContent("Some information needed, meeting not created");
          openWarning(true);
          setTimeout(() => { openWarning(false); }, 2000);
        }
        else{
          setNewMeetingOpen(false);
        }
        });
    axios.get("http://localhost:3443/meetingsExtra").then(function (response) {
      setMeetings(response.data.meeting);
    });
  }
  };
  const handleDeleteMeeting = () => {
    if (selected != "") {
      var selectedMeeting = meetings.filter(meeting => {
        return meeting.meeting_title === selected;
      })
      const { meeting_id } = selectedMeeting[0];
      console.log(meeting_id);
      axios.delete(`http://localhost:3443/meeting/${meeting_id}`)
        .then(result => {
          console.log(result);
        });
      axios.get("http://localhost:3443/meetingsExtra").then(function (response) {
        setMeetings(response.data.meeting);
      });
    }
  };
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    setSelected([]);
    setShowNextStep(false);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);

    if (selected === name) {
      setSelected([]);
    } else {
      setSelected(name);
    }

    // if (selectedIndex === -1) {
    //   newSelected = newSelected.concat(selected, name)
    // } else if (selectedIndex === 0) {
    //   newSelected = newSelected.concat(selected.slice(1))
    // } else if (selectedIndex === selected.length - 1) {
    //   newSelected = newSelected.concat(selected.slice(0, -1))
    // } else if (selectedIndex > 0) {
    //   newSelected = newSelected.concat(
    //     selected.slice(0, selectedIndex),
    //     selected.slice(selectedIndex + 1)
    //   )
    // }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //   const handleChangeDense = event => {
  //     setDense(event.target.checked)
  //   }

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, meetings.length - page * rowsPerPage);


  const handleDeleteUser = (event) => {
    const selectedIndex = event.nativeEvent.target.selectedIndex;
    let list = selectedUsers.splice(selectedIndex, 1);
    setselectedUsers(list)
    console.log(selectedUsers)
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length > 0 ? 1 : 0} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={meetings.length}
            />
            <TableBody>
              {stableSort(meetings, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((meeting, index) => {
                  const isItemSelected = isSelected(meeting.meeting_title);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, meeting.meeting_title)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={meeting.meeting_title}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="meeting"
                        padding="none"
                      >
                        {meeting.meeting_title}
                      </TableCell>
                      <TableCell align="right">{meeting.name}</TableCell>
                      <TableCell align="right">{meeting.start_date_time.split("T")[0]}</TableCell>
                      <TableCell align="right">{meeting.start_date_time.split("T")[1].substr(0, 5)}</TableCell>
                      <TableCell align="right">{meeting.end_date_time.split("T")[1].substr(0, 5)}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={meetings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label='Dense padding'
      /> */}

      <Button
        variant="contained"
        color="secondary"
        onClick={() => {
          setNewMeetingOpen(true);
        }}

      >
        Create a Meeting
      </Button>
      <Modal
        open={warning}
        onClose={() => {
          openWarning(false);
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Paper
          container
          xs={12}
          style={{ margin: "50px auto", width: "300px", padding: "40px", background: "white", position: "fixed", top: "0", right: "0" }}
        >
          <h2>*Warning*</h2>
          <p>{warningContent}</p>
        </Paper>
      </Modal>
      <Modal
        open={newMeetingOpen}
        onClose={() => {
          setNewMeetingOpen(false);
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Paper
          container
          xs={12}
          style={{ margin: "50px auto", width: "300px", padding: "40px" }}
        >
          <h1>New Meeting</h1>
          <TextField
            label="Title"
            id="create-event-title"
            variant="outlined"
            size="small"
            style={{
              width: "100%",
              marginBottom: "10px",
            }}
          />
          <TextField
            label="Description"
            id="create-event-desc"
            variant="outlined"
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
            value={startDate}
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
            value={endDate}
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
          <Autocomplete
            id="adding-user-textfield"
            options={users}
            getOptionLabel={(option) => option.name}
            style={{ width: "100%", margin: "10px 0" }}
            renderInput={(params) => (
              <TextField
                {...params}
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

          <p>
            Users:{" "} {selectedUsers.length == 0 ? "None" : ""}
            {selectedUsers.map((u, i) => {
              return <button key={i} onClick={handleDeleteUser}>{u.user}</button>;
            })}
          </p>
          <Button
            variant="contained"
            color="secondary"
            style={{ width: "45%" }}
            onClick={handleCreateMeeting}
          >
            Create
          </Button>
          <Button
            variant="contained"
            color="default"
            style={{ float: "right", width: "45%" }}
            onClick={() => {
              setNewMeetingOpen(false);

            }}
          >
            Cancel
          </Button>
        </Paper>
      </Modal>
      <Button
        variant="contained"
        color="default"
        disabled={selected.length > 0 ? false : true}
        style={{ marginLeft: "20px" }}
      >
        Edit Meeting
      </Button>
      <Button
        variant="contained"
        color="default"
        disabled={selected.length > 0 ? false : true}
        style={{ marginLeft: "20px", float: "right" }}
        onClick={handleDeleteMeeting}
      >
        Delete Meeting
      </Button>
    </div>
  );
}