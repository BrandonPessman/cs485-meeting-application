import React from 'react'
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
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const months = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
}

// id, location, users, start_time, end_time
function createData(
    title,
    location,
    startTime,
    endTime,
    date
) {
    return { title, location, startTime, endTime, date: months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() }
}

const rows = [
    createData('Meeting with Dr. Johnson', 'Phillips 116', 10, 10, new Date()),
    createData('Meeting with Dr. Tan', 'Phillips 115', 5, 5, new Date()),
    createData('Research Talk to CS 252 Class', 'Phillips 115', 5, 5, new Date())
]

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
        id: 'title',
        numeric: false,
        disablePadding: true,
        label: 'Title'
    },
    {
        id: 'location',
        numeric: true,
        disablePadding: false,
        label: 'Location'
    },
    {
        id: 'date',
        numeric: true,
        disablePadding: false,
        label: 'Date'
    },
    {
        id: 'startTime',
        numeric: true,
        disablePadding: false,
        label: 'Start Time'
    },
    {
        id: 'endTime',
        numeric: true,
        disablePadding: false,
        label: 'End Time'
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
                        inputProps={{ 'aria-label': 'select all meetings' }}
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
    const [orderBy, setOrderBy] = React.useState('title')
    const [selected, setSelected] = React.useState([])
    const [page, setPage] = React.useState(0)
    const [dense] = React.useState(true)
    const [rowsPerPage, setRowsPerPage] = React.useState(5)
    const [newMeetingOpen, setNewMeetingOpen] = React.useState(false)
    const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleSelectAllClick = event => {
        setSelected([])
        setShowNextStep(false)
    }

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name)

        if (selected === name) {
            setSelected([])
        } else {
            setSelected(name)
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
        rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage)

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
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.title)
                                    const labelId = `enhanced-table-checkbox-${index}`

                                    return (
                                        <TableRow
                                            hover
                                            onClick={event => handleClick(event, row.title)}
                                            role='checkbox'
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.title}
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
                                                {row.title}
                                            </TableCell>
                                            <TableCell align='right'>{row.location}</TableCell>
                                            <TableCell align='right'>
                                                {row.date}
                                            </TableCell>
                                            <TableCell align='right'>
                                                {row.startTime}
                                            </TableCell>
                                            <TableCell align='right'>
                                                {row.endTime}
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
                    count={rows.length}
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
            <Button variant='contained' color='secondary' onClick={() => { setNewMeetingOpen(true) }}>
                Create a Meeting
            </Button>
            <Modal
                open={newMeetingOpen}
                onClose={() => { setNewMeetingOpen(false) }}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <Paper container xs={12} style={{ margin: '50px auto', width: '300px', padding: '40px' }}>
                    <h1>New Meeting</h1>
                    <TextField
                        label="Title"
                        id="outlined-size-small"
                        variant="outlined"
                        size="small"
                        style={{
                            width: '100%',
                            marginBottom: '10px'
                        }}
                    />
                    <TextField
                        label="Location"
                        id="outlined-size-small"
                        variant="outlined"
                        size="small"
                        style={{
                            width: '100%',
                            marginBottom: '10px'
                        }}
                    />
                    <TextField
                        label="Feedbackers"
                        id="outlined-size-small"
                        variant="outlined"
                        size="small"
                        style={{
                            width: '100%'
                        }}
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            style={{ width: '100%' }}
                        />
                        <KeyboardTimePicker
                            margin="normal"
                            id="time-picker"
                            label="Start Time"
                            value={selectedDate}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change time',
                            }}
                            style={{ width: '45%' }}
                        />
                        <KeyboardTimePicker
                            margin="normal"
                            id="time-picker"
                            label="End Time"
                            value={selectedDate}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change time',
                            }}
                            style={{ float: 'right', width: '45%' }}
                        />
                    </MuiPickersUtilsProvider>
                    <Button variant='contained' color='secondary' style={{ width: '45%' }}>
                        Create
                    </Button>
                    <Button
                        variant='contained'
                        color='default'
                        style={{ float: 'right', width: '45%' }}
                        onClick={() => { setNewMeetingOpen(false) }}
                    >
                        Cancel
                    </Button>
                </Paper>
            </Modal>
            <Button
                variant='contained'
                color='default'
                disabled={selected.length > 0 ? false : true}
                style={{ marginLeft: '20px' }}
            >
                Edit Meeting
      </Button>
            <Button
                variant='contained'
                color='default'
                disabled={selected.length > 0 ? false : true}
                style={{ marginLeft: '20px', float: 'right' }}
            >
                Delete Meeting
      </Button>
        </div>
    )
}
