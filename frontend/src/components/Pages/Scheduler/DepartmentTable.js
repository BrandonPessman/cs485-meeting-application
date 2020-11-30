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
import axios from "axios";
import Modal from "@material-ui/core/Modal";
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from "@material-ui/core/TextField";

// import IconButton from '@material-ui/core/IconButton'
// import Tooltip from '@material-ui/core/Tooltip'
// import FormControlLabel from '@material-ui/core/FormControlLabel'
// import Switch from '@material-ui/core/Switch'
// import DeleteIcon from '@material-ui/icons/Delete'
// import FilterListIcon from '@material-ui/icons/FilterList'

// function createData (
//   department,
//   shortName,
//   openPositionTotal,
//   upcomingMeetings
// ) {
//   return { department, shortName, openPositionTotal, upcomingMeetings }
// }

// const rows = [
//   createData('Computer Science', 'CS', 10, 10),
//   createData('Physics', 'PHYS', 5, 5)
// ]

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
    id: "department",
    numeric: false,
    disablePadding: true,
    label: "Department",
  },
  {
    id: "shortName",
    numeric: true,
    disablePadding: false,
    label: "Short Name",
  },
  {
    id: "totalOpenPositions",
    numeric: true,
    disablePadding: false,
    label: "Total Open Positions",
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
            inputProps={{ "aria-label": "select all departments" }}
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
          Select a Department
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
  const [orderBy, setOrderBy] = React.useState("department");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [departments, setDepartments] = useState([]);
  const [openNewDepartment, setOpenNewDepartment] = React.useState(false);
  const [openEditDepartment, setOpenEditDepartment] = React.useState(false);
  const [chosenShort, setChosenShort] = useState([]);
  const [chosenTitle, setChosenTitle] = useState([]);
  const [chosenID, setChosenID] = useState([]);
  const [selectedDept, setSelectedDept] = useState([]);



  useEffect(() => {
    axios
      .get("http://104.131.115.65:3443/department")
      .then(function (response) {
        setDepartments(response.data.department);
      });
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleOpenNewDepartment = (event) => {
    setChosenShort(null);
    setChosenTitle(null);
    setChosenID(null);
    setOpenNewDepartment(true);
  }
  const handleCloseNewDepartment = (event) => {
    setOpenNewDepartment(false);
  }
  const handleEditClick = (event) => {
    setOpenEditDepartment(true);
  }
  const handleSelectAllClick = (event) => {
    // if (event.target.checked) {
    //   const newSelecteds = rows.map(n => n.department)
    //   setSelected(newSelecteds)
    //   return
    // }
    setSelected([]);
    setShowNextStep(false);
  };
  const handleShortChange = (event, short) => {
    if (short != null) {
      setChosenShort(short);
    }
    console.log(chosenShort);
  }
  const handleTitleChange = (event, title) => {
    if (title != null) {
      setChosenTitle(title);
    }
  }
  const handleDeptInfo = (event, updateType) => {
    const dept = 
    {
      dept_title: chosenTitle,
      dept_short: chosenShort,
      dept_id: chosenID,
    }
    console.log(dept);
    if (chosenTitle.length>0 || chosenShort.length>0) {
      if (updateType == 1) {
      axios
        .post("http://104.131.115.65:3443/insertDepartment", dept)
        .then(function (response) {
          console.log(response);
          axios
          .get("http://104.131.115.65:3443/department")
          .then(function (response) {
            setDepartments(response.data.department);
          });
        });
        setOpenNewDepartment(false);
      }else if (updateType == 2) {
        axios.patch( `http://104.131.115.65:3443/updateDepartment/${chosenTitle}/${chosenShort}/${chosenID}`)
        .then(function (response) {
          console.log(response);
          axios
          .get("http://104.131.115.65:3443/department")
          .then(function (response) {
            setDepartments(response.data.department);
          });
        });
        setOpenEditDepartment(false);
      }
    }
    else{
      console.log("Invalid");
    }
  }
  const handleDeleteDepartment = (event) => {
    if (selected != "") {
      var dept = departments.filter(department => {
        return department.dept_title === selected;
      });
      const { dept_id } = dept[0];
      axios.delete(`http://104.131.115.65:3443/deleteDepartment/${dept_id}`)
      .then(result=> {
        console.log("Delete result: " + result);
      });
    }
    axios
      .get("http://104.131.115.65:3443/department")
      .then(function (response) {
        setDepartments(response.data.department);
      });
  }
  const handleClick = (event, name, id) => {
    console.log("id: " + id);
    // SEND ID TO PARENT
    if (selected === name) {
      setSelected([]);
      setShowNextStep(false);
    } else {
      const dept = departments.filter(department => {
        return department.dept_id == id;
      });
      const { dept_title } = dept[0];
      const { dept_short } = dept[0];
      const { dept_id } = dept[0];
      setSelected(dept_title);
      setChosenTitle(dept_title);
      setChosenShort(dept_short);
      setChosenID(dept_id);
      setShowNextStep(true);
    }
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
    rowsPerPage - Math.min(rowsPerPage, departments.length - page * rowsPerPage);

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
              rowCount={departments.length}
            />
            <TableBody>
              {stableSort(departments, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((department, index) => {
                  const isItemSelected = isSelected(department.dept_title);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) =>
                        handleClick(event, department.dept_title, department.dept_id)
                      }
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={department.dept_id}
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
                        scope="department"
                        padding="none"
                      >
                        {department.dept_title}
                      </TableCell>
                      <TableCell align="right">{department.dept_short}</TableCell>
                      <TableCell align="right">{department.openPositions}</TableCell>
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
          count={departments.length}
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
      onClick = { handleOpenNewDepartment }
      >
        Create a Department
      </Button>
      <Modal
        open={ openNewDepartment }
        onClose={() => {
          setOpenNewDepartment(false);
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Paper
          container
          xs={12}
          style={{ margin: "50px auto", width: "300px", height: "300px", padding: "40px" }}
        >
          <h1>Create a Department</h1>
        <TextField
            label="Title"
            id="create-dept-title"
            variant="outlined"
            size="small"
            style={{
              width: "100%",
              marginBottom: "10px",
            }}
            onChange = {(event) => handleTitleChange(event, document.getElementById('create-dept-title').value)}
          />
        <TextField
            label="Short"
            id="create-dept-short"
            variant="outlined"
            size="small"
            style={{
              width: "100%",
              marginBottom: "10px",
            }}
            onChange = {(event) => handleShortChange(event, document.getElementById('create-dept-short').value) }
          />
      <Button
      variant = 'caontained'
      color = 'default'
      style={{ marginleft: '20px', float: 'center' }}
      onClick = {(event) => handleDeptInfo(event, 1) }
      >
        Create Department
      </Button>
      <Button 
      variant="contained" 
      color="secondary"
      style={{ marginleft: '20px', float: 'right' }}
      onClick = { handleCloseNewDepartment }
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
        onClick = { handleEditClick }
      >
        Edit Department
      </Button>
      <Modal
        open={ openEditDepartment }
        onClose={() => {
          setOpenEditDepartment(false);
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Paper
          container
          xs={12}
          style={{ margin: "50px auto", width: "300px", height: "300px", padding: "40px" }}
        >
          <h1>{ selected }</h1>
        <TextField
            label="Title"
            id="edit-dept-title"
            variant="outlined"
            size="small"
            style={{
              width: "100%",
              marginBottom: "10px",
            }}
            onChange = {(event) => handleTitleChange(event, document.getElementById('edit-dept-title').value) }
            value = {chosenTitle}
          />
        <TextField
            label="Short"
            id="edit-dept-short"
            variant="outlined"
            size="small"
            style={{
              width: "100%",
              marginBottom: "10px",
            }}
            onChange = {(event) => handleShortChange(event, document.getElementById('edit-dept-short').value) }
            value = { chosenShort }
          />
      <Button
      variant = 'caontained'
      color = 'default'
      style={{ marginleft: '20px', float: 'center' }}
      onClick = {(event) => handleDeptInfo(event, 2) }
      >
        Save Changes
      </Button>
      <Button 
      variant="contained" 
      color="secondary"
      style={{ marginleft: '20px', float: 'right' }}
      onClick = { handleCloseNewDepartment }
      >
        Cancel
      </Button>
        </Paper>
      </Modal>
      <Button
        variant="contained"
        color="default"
        disabled={selected.length > 0 ? false : true}
        style={{ marginLeft: "20px", float: "right" }}
        onClick = { handleDeleteDepartment }
      >
        Delete Department
      </Button>
    </div>
  );
}