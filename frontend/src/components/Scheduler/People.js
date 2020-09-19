import React from 'react'
import Grid from '@material-ui/core/Grid'
import InputBase from '@material-ui/core/InputBase'
import IconButton from '@material-ui/core/IconButton'
import AddCircleIcon from '@material-ui/icons/AddCircle'

export default function People () {
  return (
    <div>
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
    </div>
  )
}
