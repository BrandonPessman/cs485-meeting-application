import React from 'react'
import Grid from '@material-ui/core/Grid'
import PositionsTable from './PostionsTable'

export default function Positions () {
  return (
    <div>
      <Grid container spacing={12}>
        <PositionsTable />
      </Grid>
    </div>
  )
}
