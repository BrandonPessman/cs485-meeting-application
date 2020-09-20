import React from 'react'
import Grid from '@material-ui/core/Grid'
import CandidatesTable from './CandidatesTable'

export default function Department () {
  return (
    <div>
      <Grid container spacing={12}>
        <CandidatesTable />
      </Grid>
    </div>
  )
}
