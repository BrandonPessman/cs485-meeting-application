import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
//import Button from '@material-ui/core/Button'
import InputBase from '@material-ui/core/InputBase'
import IconButton from '@material-ui/core/IconButton'
import AddCircleIcon from '@material-ui/icons/AddCircle'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
      width: '100%'
    }
  }
}))

export default function SimplePaper () {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <h1 style={{ marginBottom: '0' }}>New Meeting</h1>
      <h2 style={{ marginBottom: '0', marginTop: '0' }}>People</h2>
      <Paper elevation={3} style={{ padding: '10px 30px' }}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <h3>Add a Candidate</h3>
            <span
              style={{
                backgroundColor: 'rgba(0,0,0,.1)',
                padding: '9px',
                borderRadius: '4px'
              }}
            >
              <InputBase
                className={classes.input}
                placeholder='Add a candidate...'
                inputProps={{ 'aria-label': 'search google maps' }}
              />
            </span>
            <IconButton type='submit' aria-label='search'>
              <AddCircleIcon style={{ fill: 'blue', marginBottom: '2px' }} />
            </IconButton>
          </Grid>
          <Grid item xs={6}>
            <h3>Candidates</h3>
            <p>None</p>
          </Grid>

          <Grid item xs={6}>
            <h3>Add a Feedbacker</h3>
            <span
              style={{
                backgroundColor: 'rgba(0,0,0,.1)',
                padding: '9px',
                borderRadius: '4px'
              }}
            >
              <InputBase
                className={classes.input}
                placeholder='Add a feedbacker...'
                inputProps={{ 'aria-label': 'search google maps' }}
              />
            </span>
            <IconButton type='submit' aria-label='search'>
              <AddCircleIcon style={{ fill: 'blue', marginBottom: '2px' }} />
            </IconButton>
          </Grid>
          <Grid item xs={6}>
            <h3>Feedbackers</h3>
            <p>None</p>
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}
