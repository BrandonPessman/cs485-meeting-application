import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles' // light, withTheme
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
import Button from '@material-ui/core/Button';
import Modal from "@material-ui/core/Modal";
import axios from "axios";
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from "@material-ui/core/TextField";

// import IconButton from '@material-ui/core/IconButton'
// import Tooltip from '@material-ui/core/Tooltip'
// import FormControlLabel from '@material-ui/core/FormControlLabel'
// import Switch from '@material-ui/core/Switch'
// import DeleteIcon from '@material-ui/icons/Delete'
// import FilterListIcon from '@material-ui/icons/FilterList'

function createData(
  positionId,
  positionTitle,
  department,
  totalCandidates,
  totalMeetings
) {
  return {
    positionId,
    positionTitle,
    department,
    totalCandidates,
    totalMeetings
  }
}

/*const rows = [
  createData('39285', 'Associate Professor', 'Computer Science', 5, 10),
  createData('29395', 'Associate Professor', 'Computer Science', 3, 10),
  createData('84824', 'Associate Professor', 'Computer Science', 5, 10),
  createData('95021', 'Associate Professor', 'Computer Science', 3, 10),
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
    id: 'positionTitle',
    numeric: false,
    disablePadding: true,
    label: 'Position'
  },
  {
    id: 'department_name',
    numeric: true,
    disablePadding: false,
    label: 'Department'
  },
  {
    id: 'totalMeetings',
    numeric: true,
    disablePadding: false,
    label: 'Total Meetings'
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
            inputProps={{ 'aria-label': 'select all positions' }}
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
            Select a Position
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
  const [orderBy, setOrderBy] = React.useState('positionId')
  const [selected, setSelected] = React.useState([])
  const [page, setPage] = React.useState(0)
  const [dense] = React.useState(true)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [positions, setPositions] = useState([])
  const [newPosition, openNewPosition] = React.useState(false)
  const [departments, setDepartments] = useState([])
  const [chosenTitle, setChosenTitle] = useState([])
  const [chosenDept, setChosenDept] = useState([])
  const [chosenId, setChosenId] = useState()
  const [editPosition, openEditPosition] = React.useState(false)

  useEffect(() => {
    axios.get("http://104.131.115.65:3443/positions").then(function (response) {
      setPositions(response.data.position);
    });
    axios.get("http://104.131.115.65:3443/department").then(function (response) {
      console.log(response.data.department);
      setDepartments(response.data.department);
    });
  }, []);

  const handleEditPosition = (event) => {
    openEditPosition(true);
  }
  const handleOpenPosition = (event) => {
    setChosenTitle(null);
    setChosenDept(null);
    openNewPosition(true);
  }
  const handleTitleChange = (event, title) => {
    console.log("TITLE: " + title);
    if (title != null) {
      setChosenTitle(title);
    }
    console.log(chosenTitle);
  }
  const handleDeptChange = (event, deptVal) => {
    if (deptVal != "") {
      var dept = departments.filter(department => {
        return department.dept_title === deptVal;
      })
      const { dept_id } = dept[0];
      setChosenDept(dept_id);
      console.log(chosenDept);
    } 
  }
  const handleCreatePosition = () => {
    const newPosition = {
      title: chosenTitle,
      dept_id: chosenDept,
    };
    console.log(newPosition);
    if (chosenTitle.length>0 && chosenDept>0) {
      axios.post("http://104.131.115.65:3443/insertPosition", newPosition)
        .then(result => {
          console.log(result);
        })
      openNewPosition(false);
      axios.get("http://104.131.115.65:3443/positions").then(function (response) {
        console.log(response.data.position);
        setPositions(response.data.position);
      });
      axios.get("http://104.131.115.65:3443/department").then(function (response) {
        console.log(response.data.department);
        setDepartments(response.data.position);
      })
  }
  };
  const handleDeletePosition = () => {
    if (selected != "") {
      var pos = positions.filter(position => {
        return position.title === selected;
      });
      const { position_id } = pos[0];
      axios.delete(`http://104.131.115.65:3443/deletePosition/${position_id}`)
      .then(result=> {
        console.log("Delete result: " + result);
      });
    }
    axios.get("http://104.131.115.65:3443/positions").then(function (response) {
      console.log(response.data.position);
      setPositions(response.data.position);
    });
  }
  const handleUpdatePosition = () => {
    var updatePosition = {
      title: chosenTitle,
      dept_id: chosenDept,
      position_id: chosenId,
    }
    axios.patch("http://104.131.115.65:3443/updatePosition", updatePosition)
    .then(function (response) {
      console.log(response);
    });
    openEditPosition(false);
  }
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }
  const handleSelectAllClick = event => {
    // if (event.target.checked) {
    //   const newSelecteds = rows.map(n => n.positionId)
    //   setSelected(newSelecteds)
    //   return
    // }
    setSelected([])
    setShowNextStep(false)
  }

  const handleClick = (event, name, id) => {
    const selectedIndex = selected.indexOf(name)

    if (selected === name) {
      setSelected([])
      setShowNextStep(false)
    } else {
      console.log("select id: " + id);
      var pos = positions.filter(position => {
        return position.position_id == id;
      })
      const { title } = pos[0];
      setChosenTitle(title);
      const { dept_title } = pos[0];
      setChosenDept(dept_title);
      const { position_id } = pos[0];
      setChosenId(position_id);
      setSelected(name)
      setShowNextStep(true)
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
    rowsPerPage - Math.min(rowsPerPage, positions.length - page * rowsPerPage)

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
              rowCount={positions.length}
            />
            <TableBody>
              {stableSort(positions, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((position, index) => {
                  const isItemSelected = isSelected(position.title)
                  const labelId = `enhanced-table-checkbox-${index}`

                  return (
                    <TableRow
                      hover
                      onClick={event => handleClick(event, position.title, position.position_id)}
                      role='checkbox'
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={position.title}
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
                        scope='position'
                        padding='none'
                      >
                        {position.title}
                      </TableCell>
                      <TableCell align='right'>{position.dept_title}</TableCell>
                      <TableCell align='right'>{position.meeting_count}</TableCell>
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
          count={positions.length}
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
        onClick = { handleOpenPosition }
        >
        Create a Position
      </Button>
      <Modal
        open={ newPosition }
        onClose={() => {
          openNewPosition(false);
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Paper
          container
          xs={12}
          style={{ margin: "50px auto", width: "300px", height: "300px", padding: "40px" }}
        >
          <h1> Create a Position </h1>
        <TextField
            label="Title"
            id="create-position-title"
            variant="outlined"
            size="small"
            style={{
              width: "100%",
              marginBottom: "10px",
            }}
            onChange = {(event) => handleTitleChange(event, document.getElementById('create-position-title').value) }
          />
        <Autocomplete
            id="create-position-dept"
            options={ departments }
            getOptionLabel={(option) => option.dept_title}
            style={{ width: "100%", margin: "10px 0" }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Add a Department"
                variant="outlined"
                style={{ width: "100%" }}
              />
            )}
          />
        <Button
        variant='contained'
        color='default'
        style={{ marginLeft: '20px', float: 'right' }}
        onClick = { (event) => handleDeptChange(event, document.getElementById('create-position-dept').value) }
      >
        Add Department
      </Button>
      <Button
      variant = 'contained'
      color = 'default'
      style={{ marginleft: '20px', float: 'right' }}
      onClick = { handleCreatePosition }
      >
        Create Position
      </Button>
        </Paper>
      </Modal>
      <Button
        variant='contained'
        color='default'
        style={{ marginLeft: '20px' }}
        disabled={selected.length > 0 ? false : true}
        onClick = { handleEditPosition }
      >
        Edit Position
      </Button>
      <Modal
        open={ editPosition }
        onClose={() => {
          openEditPosition(false);
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Paper
          container
          xs={12}
          style={{ margin: "50px auto", width: "300px", height: "400px", padding: "40px" }}
        >
          <h1>Edit Position</h1>
          <h2> { chosenTitle } </h2>
        <TextField
            label="Title"
            id="edit-position-title"
            variant="outlined"
            value = { chosenTitle }
            size="small"
            style={{
              width: "100%",
              marginBottom: "10px",
            }}
            onChange = { (event) => handleTitleChange(event, document.getElementById('edit-position-title').value) }
          />
          <TextField
            id="existing-dept-title"
            value = { chosenDept }
            style={{
              width: "100%",
              marginBottom: "10px"
            }}
            disabled = {true}
            />
        <Autocomplete
            id="edit-position-dept"
            options={ departments }
            getOptionLabel={(option) => option.dept_title}
            style={{ width: "100%", margin: "10px 0" }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Change Department"
                variant="outlined"
                style={{ width: "100%" }}
              />
            )}
          />
        <Button
        variant='contained'
        color='default'
        style={{ marginLeft: '20px', float: 'right' }}
        onClick = { (event) => handleDeptChange(event, document.getElementById('edit-position-dept').value) }
      >
        Save Department
      </Button>
      <Button
      variant = 'caontained'
      color = 'default'
      style={{ marginleft: '20px', float: 'right' }}
      onClick = { handleUpdatePosition }
      >
        Save Changes
      </Button>
        </Paper>
      </Modal>
      <Button
        variant='contained'
        color='default'
        style={{ marginLeft: '20px', float: 'right' }}
        disabled={selected.length > 0 ? false : true}
        onClick = { handleDeletePosition }
      >
        Delete Position
      </Button>
    </div>
  )
}
