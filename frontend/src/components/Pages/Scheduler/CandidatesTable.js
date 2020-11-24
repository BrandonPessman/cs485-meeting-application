import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles' // lighten, withTheme
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox'
import Button from '@material-ui/core/Button'
import Modal from "@material-ui/core/Modal";
import axios from "axios";
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from "@material-ui/core/TextField";
import candidates from '../../Navigation/Tabs/MeetingScheduler';
import setCandidates from '../../Navigation/Tabs/MeetingScheduler';
import refreshPage from '../../Navigation/Tabs/MeetingScheduler';

// import IconButton from '@material-ui/core/IconButton'
// import Tooltip from '@material-ui/core/Tooltip'
// import FormControlLabel from '@material-ui/core/FormControlLabel'
// import Switch from '@material-ui/core/Switch'
// import DeleteIcon from '@material-ui/icons/Delete'
// import FilterListIcon from '@material-ui/icons/FilterList'

function createData(name, email, positionId, documentsId, scheduleId) {
  return { name, email, positionId, documentsId, scheduleId }
}

/*const rows = [
  createData('Steve Stevenson', 'steve@gmail.com', 48289, 14134, 29593),
  createData('Sarah Sally', 'sarah@gmail.com', 48489, 12134, 21593)
]*/

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map(el => el[0])
}

const headCells = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Full Name'
  },
  {
    id: 'email',
    numeric: true,
    disablePadding: false,
    label: 'Email Address'
  },
  {
    id: 'phone_number',
    numeric: true,
    disablePadding: false,
    label: 'Phone Number'
  },
  {
    id: 'documentsId',
    numeric: true,
    disablePadding: false,
    label: 'Documents'
  },
  {
    id: 'num_meetings',
    numeric: true,
    disablePadding: false,
    label: 'Number of Meetings'
  }
]

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort
  } = props
  const createSortHandler = property => event => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding='checkbox'>
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all departments' }}
          />
        </TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
}

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  highlight: {
    color: 'white',
    backgroundColor: 'rgb(27, 14, 83)'
  },
  title: {
    flex: '1 1 100%'
  }
}))

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles()
  const { numSelected } = props

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color='inherit'
          variant='subtitle1'
          component='div'
        >
          {numSelected} selected
        </Typography>
      ) : (
          <Typography
            className={classes.title}
            variant='h6'
            id='tableTitle'
            component='div'
          >
            Select a Candidate
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
  )
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 750
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1
  }
}))

export default function EnhancedTable({ setShowNextStep }) {
  const classes = useStyles()
  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState('name')
  const [selected, setSelected] = React.useState([])
  const [page, setPage] = React.useState(0)
  const [dense] = React.useState(true)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [openEditCandidate, setOpenEditCandidate] = React.useState(false);
  const [candidateName, setCandidateName] = useState([]);
  const [candidateEmail, setCandidateEmail] = useState([]);
  const [candidatePhoneNumber, setCandidatePhoneNumber] = useState([]);
  const [candidateType, setCandidateType] = useState([]);
  const [candidatePassword, setCandidatePassword] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [candidateId, setCandidateId] = useState([]);
  const [candidateTypeId, setCandidateTypeId] = useState([]);
  const [openNewCandidate, setOpenNewCandidate] = React.useState(false);
  const [candidates, setCandidates] = useState([]);


  useEffect(() => {
    axios.get("http://localhost:3443/userTypes").then(function (response) {
      setUserTypes(response.data.type);
    });
    axios.get("http://localhost:3443/candidates").then(function (response) {
      setCandidates(response.data.user);
    })
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = event => {
    // if (event.target.checked) {
    //   const newSelecteds = rows.map(n => n.name)
    //   setSelected(newSelecteds)
    //   return
    // }
    setSelected([])
  }

  const handleEditCandidate = (event) => {
    setOpenEditCandidate(true);
  }
  const handleNameChange = (event, name) => {
    setCandidateName(name);
    console.log("name: " + name);
  }
  const handleEmailChange = (event,email) => {
    setCandidateEmail(email);
  }
  const handlePhoneNumberChange = (event, number) => {
    setCandidatePhoneNumber(number);
  }
  const handleSelectType = (event, type) => {
    console.log("type given: " + type);
    setCandidateType(type);
    const selectedType = userTypes.filter(usertype => {
      return usertype.type_descr === type;
    });
    const { type_id } = selectedType[0];
    setCandidateTypeId(type_id);
    console.log("CandidateType: " + type_id);
  }
  const handlePasswordChange = (event, password) => {
    setCandidatePassword(password);
  }
  const handleCandidateInfo = (event,insertType) => {
    console.log("candidateTypeID: " + candidateTypeId);
    var candidate = 
    {
      u_password: candidatePassword,
      u_id: candidateId,
      name: candidateName,
      email: candidateEmail,
      phone_number: candidatePhoneNumber,
      type: candidateTypeId,
    }

    if (insertType == 2) {
      axios.patch("http://localhost:3443/user", candidate)
      .then(function (response) {
        console.log(response);
      });
      setOpenEditCandidate(false);
    } else if (insertType == 1) {
        axios.post("http://localhost:3443/insertuser", candidate)
        .then(result => {
          console.log(result);
          });
        setOpenNewCandidate(false);
    }
    axios.get("http://localhost:3443/candidates").then(function (response) {
      setCandidates(response.data.user);
      console.log(response)
    });
  }
  const handleDeleteCandidate = (event) => {
    axios.delete(`http://localhost:3443/deleteUser/${candidateId}`)
      .then(result=> {
        console.log("Delete result: " + result);
      });
      axios.get("http://localhost:3443/candidates").then(function (response) {
        setCandidates(response.data.user);
        console.log(response)
      });
  }
  const handleOpenNewCandidate = (event) => {
    setCandidateEmail(null);
    setCandidateName(null);
    setCandidatePhoneNumber(null);
    setCandidateType(null);
    setOpenNewCandidate(true);
  }
  const handleClick = (event, chosenName, id) => {
    const selectedIndex = selected.indexOf(chosenName)

    if (selected === chosenName) {
      setSelected([])
      setShowNextStep(false)
    } else {
      setShowNextStep(true)
      const selectedCand = candidates.filter(candidate => {
        return candidate.u_id === id;
      });
      const { u_id, name, email, phone_number, type_descr, password } = selectedCand[0];
      console.log("u_id: " + u_id);
      setCandidateId(u_id);
      setCandidateName(name);
      setCandidateEmail(email);
      setCandidatePhoneNumber(phone_number);
      setCandidateType(type_descr);
      setCandidatePassword(password);
      setSelected(chosenName);
      console.log("Password: " + candidatePassword);
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
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  //   const handleChangeDense = event => {
  //     setDense(event.target.checked)
  //   }

  const isSelected = chosenName => selected.indexOf(chosenName) !== -1

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, candidates.length - page * rowsPerPage)

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length > 0 ? 1 : 0} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby='tableTitle'
            size={dense ? 'small' : 'medium'}
            aria-label='enhanced table'
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={candidates.length}
            />
            <TableBody>
              {stableSort(candidates, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((candidate, index) => {
                  const isItemSelected = isSelected(candidate.name)
                  const labelId = `enhanced-table-checkbox-${index}`

                  return (
                    <TableRow
                      hover
                      onClick={event => handleClick(event, candidate.name, candidate.u_id)}
                      role='checkbox'
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={candidate.name}
                      selected={isItemSelected}
                    >
                      <TableCell padding='checkbox'>
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell
                        component='th'
                        id={labelId}
                        scope='candidate'
                        padding='none'
                      >
                        {candidate.name}
                      </TableCell>
                      <TableCell align='right'>{candidate.email}</TableCell>
                      <TableCell align='right'>{candidate.phone_number}</TableCell>
                      <TableCell align='right'>{candidate.documentsId}</TableCell>
                      <TableCell align='right'>{candidate.meeting_count}</TableCell>
                    </TableRow>
                  )
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
          component='div'
          count={candidates.length}
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
        variant='contained' 
        color='secondary'
        onClick = { handleOpenNewCandidate }
        >
        Create Candidate
      </Button>
      <Modal
        open={openNewCandidate}
        onClose={() => {
          setOpenNewCandidate(false);
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Paper
          container
          xs={12}
          style={{ margin: "50px auto", width: "300px", height:"400px", padding: "40px" }}
        >
          <h1>Create Candidate</h1>
          <TextField
            label="Name"
            id="create-candidate-name"
            variant="outlined"
            size="small"
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
            style={{
              width: "100%",
              marginBottom: "10px",
            }}
            onChange={(event) => handlePasswordChange(event, document.getElementById('create-candidate-password').value)}
          />
          <Autocomplete
            id="create-candidate-type"
            options={userTypes}
            getOptionLabel={(option) => option.type_descr}
            style={{ width: "100%", margin: "10px 0" }}
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
            onClick={(event) => handleCandidateInfo(event, 1) }
          > Create Candidate</Button>
        </Paper>
      </Modal>
      <Button
        variant='contained'
        color='default'
        disabled={selected.length > 0 ? false : true}
        style={{ marginLeft: '20px' }}
        onClick={handleEditCandidate}
      >
        Edit Candidate
      </Button>
      <Modal
        open={openEditCandidate}
        onClose={() => {
          setOpenEditCandidate(false);
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Paper
          container
          xs={12}
          style={{ margin: "50px auto", width: "300px", height:"500px", padding: "40px" }}
        >
          <h1>{selected}</h1>
          <TextField
            label="Name"
            id="edit-candidate-name"
            variant="outlined"
            size="small"
            style={{
              width: "100%",
              marginBottom: "10px",
            }}
            defaultValue = { selected }
            onChange={(event) => handleNameChange(event, document.getElementById('edit-candidate-name').value)}
          />
          <TextField
            label="email"
            id="edit-candidate-email"
            variant="outlined"
            size="small"
            style={{
              width: "100%",
              marginBottom: "10px",
            }}
            defaultValue={ candidateEmail }
            onChange={(event) => handleEmailChange(event, document.getElementById('edit-candidate-email').value)}
          />
          <TextField
            label="Phone Number"
            id="edit-candidate-number"
            variant="outlined"
            size="small"
            style={{
              width: "100%",
              marginBottom: "10px",
            }}
            onChange={(event) => handlePhoneNumberChange(event, document.getElementById('edit-candidate-number').value)}
            defaultValue = { candidatePhoneNumber }
          />
          <TextField
            label="Password"
            id="edit-candidate-password"
            variant="outlined"
            size="small"
            style={{
              width: "100%",
              marginBottom: "10px",
            }}
            onChange={(event) => handlePasswordChange(event, document.getElementById('edit-candidate-password').value)}
            defaultValue = { candidatePassword }
          />
          <TextField
          label="Current Type "
            style={{
              width: "100%",
              maringBottom: "10px",
              color: "black",
            }}
            disabled = { true }
            value = { candidateType }
            />
          <Autocomplete
            id="edit-candidate-type"
            options={userTypes}
            getOptionLabel={(option) => option.type_descr}
            style={{ width: "100%", margin: "10px 0" }}
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
            onClick={ (event) => handleSelectType(event, document.getElementById('edit-candidate-type').value) }
          > Select Type</Button>
          <Button
            variant='contained'
            color='default'
            style={{ marginLeft: '20px', float: 'center' }}
            onClick={ (event) => handleCandidateInfo(event, 2) }
          > Save Changes</Button>
        </Paper>
      </Modal>
      <Button
        variant='contained'
        color='default'
        disabled={selected.length > 0 ? false : true}
        style={{ marginLeft: '20px', float: 'right' }}
        onClick = { handleDeleteCandidate }
      >
        Delete Candidate
      </Button>
    </div>
  )
}
