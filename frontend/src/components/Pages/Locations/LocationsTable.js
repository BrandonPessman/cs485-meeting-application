import React, { useEffect, useState } from 'react'
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
import TextField from "@material-ui/core/TextField";
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useHistory } from "react-router-dom";


const axios = require('axios');
// import IconButton from '@material-ui/core/IconButton'
// import Tooltip from '@material-ui/core/Tooltip'
// import FormControlLabel from '@material-ui/core/FormControlLabel'
// import Switch from '@material-ui/core/Switch'
// import DeleteIcon from '@material-ui/icons/Delete'
// import FilterListIcon from '@material-ui/icons/FilterList'

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

// function stableSort(array, comparator) {
//   const stabilizedThis = array.map((el, index) => [el, index])
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0])
//     if (order !== 0) return order
//     return a[1] - b[1]
//   })
//   return stabilizedThis.map(el => el[0])
// }

const headCells = [
  {
    id: 'Name',
    numeric: false,
    disablePadding: true,
    label: 'Name'
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
            inputProps={{ 'aria-label': 'select all users' }}
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
            Select a User
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

export default function EnhancedTable() {
  let history = useHistory();
  const classes = useStyles()
  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState('email')
  const [selected, setSelected] = React.useState([])
  const [page, setPage] = React.useState(0)
  const [dense] = React.useState(true)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [data, setData] = useState([])
  const [openEditLocation, setOpenEditLocation] = React.useState(false);
  const [openNewLocation, setOpenNewLocation] = React.useState(false);
  const [locationName, setLocationName] = useState("");
  const [locationID, setLocationID] = useState("");


  useEffect(() => {

    axios.get('http://104.131.115.65:3443/locations')
      .then(function (response) {
        // handle success
        console.log(response);
        setData(response.data.location);
    });
  }, [])

  const handleCreateLocation = (event) => {
    var newLocation = {
        name: locationName,
    }
        axios
        .post('http://104.131.115.65:3443/insertLocation', newLocation)
        .then(function (response) {
          console.log(response);
          axios
          .get('http://104.131.115.65:3443/locations')
          .then(function (response) {
            setData(response.data.location);
          })
        });
    }
  const handleUpdateLocation = (event) => {
        var newLocation = {
          name: locationName,
        }
        axios.patch("http://104.131.115.65:3443/location", newLocation)
          .then(function (response) {
            console.log(response);
            setOpenEditLocation(false);
            axios.get("http://104.131.115.65:3443/locations")
            .then(function (response) {
              setData(response.data.location);
            })
        });
    }

  const handleOpenNewLocation = (event) => {
    setLocationName(null);
    setSelected("");
    setOpenNewLocation(true);
  }
  const handleCloseNewLocation = (event) => {
    setOpenNewLocation(false);
  }
  const handleOpenEditLocation = (event) => {
    setOpenEditLocation(true);
  }
  const handleCloseEditLocation = (event) => {
    setOpenEditLocation(false);
  }
  const handleNameChange = (event, name) => {
    setLocationName(name);
  }
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }
  const handleSelectAllClick = event => {
    // if (event.target.checked) {
    //   const newSelecteds = rows.map(n => n.department)
    //   setSelected(newSelecteds)
    //   return
    // }
    setSelected([])
  }

  const handleDeleteLocation = (event) => {
    axios
    .delete(`http://104.131.115.65:3443/deleteLocation/${locationID}`)
    .then(function (result) {
      console.log(result);
      axios
      .get("http://104.131.115.65:3443/loations")
      .then(function (result) {
        setData(result.data.location);
      });
    });
  }

  const handleClick = (event, chosenName, id) => {
    const selectedIndex = selected.indexOf(chosenName)

    if (selected === chosenName) {
      setSelected([])
    } else {
      setSelected(chosenName);
      const selLocation = data.filter(location => {
        return location.location_id === id;
      });
      const { name, location_id } = selLocation[0];
      setLocationID(location_id);
      setLocationName(name);
    }
  }

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

  const isSelected = name => selected.indexOf(name) !== -1

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)

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
              rowCount={data.length}
            />
            <TableBody>
              {data.map((row, index) => {
                const isItemSelected = isSelected(row.name)
                const labelId = `enhanced-table-checkbox-${index}`

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.name, row.location_id)}
                    role='checkbox'
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={data.name}
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
                      scope='row'
                      padding='none'
                    >
                      {row.name}
                    </TableCell>
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
          count={data.length}
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
        setOpenNewLocation(true);
    }}
      >
        Create a Location
      </Button>
    <Modal
        open={openNewLocation}
        onClose={() => {
          setOpenNewLocation(false);
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Paper
          container
          xs={12}
          style={{ margin: "50px auto", width: "300px", height:"auto", padding: "40px" }}
        >
          <h1>Create a New Location</h1>
          <TextField
            label="Name"
            id="create-location-name"
            variant="outlined"
            size="small"
            style={{
              width: "100%",
              marginBottom: "10px",
            }}
            defaultValue = { selected }
            onChange={(event) => handleNameChange(event, document.getElementById('create-location-name').value)}
          />
          <div><Button
            variant='contained'
            color='default'
            style={{ marginLeft: '20px', float: 'center' }}
            onClick={ handleCreateLocation }
          > Create Location</Button>
          <Button 
            variant="contained" 
            color="secondary"
            style={{ marginleft: '20px', float: 'right' }}
            onClick = { handleCloseNewLocation }
            >
              Cancel
          </Button></div>
        </Paper>
      </Modal>
      <Button
        variant='contained'
        color='default'
        disabled={selected.length > 0 ? false : true}
        style={{ marginLeft: '20px' }}
        onClick = { handleOpenEditLocation }
      >
        Edit Location
      </Button>
      <Modal
        open={openEditLocation}
        onClose={() => {
          setOpenEditLocation(false);
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Paper
          container
          xs={12}
          style={{ margin: "50px auto", width: "300px", height:"auto", padding: "40px" }}
        >
          <h1>{selected}</h1>
          <TextField
            label="Name"
            id="edit-location-name"
            variant="outlined"
            size="small"
            style={{
              width: "100%",
              marginBottom: "10px",
            }}
            defaultValue = { selected }
            onChange={(event) => handleNameChange(event, document.getElementById('edit-location-name').value)}
          />
          <div><Button
            variant='contained'
            color='default'
            style={{ marginLeft: '20px', float: 'center' }}
            onClick={ handleUpdateLocation }
          > Save Changes</Button>
          <Button 
            variant="contained" 
            color="secondary"
            style={{ marginleft: '20px', float: 'right' }}
            onClick = { handleCloseEditLocation }
            >
              Cancel
          </Button></div>
        </Paper>
      </Modal>
      <Button
        variant='contained'
        color='default'
        disabled={selected.length > 0 ? false : true}
        style={{ marginLeft: '20px', float: 'right' }}
        onClick = { handleDeleteLocation }
      >
        Delete Location
      </Button>
    </div>
  )
}
