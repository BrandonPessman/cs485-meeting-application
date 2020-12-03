import React from 'react'
import Grid from '@material-ui/core/Grid'
import LocationsTable from './LocationsTable'

export default function Department({ setShowNextStep }) {
  return (
    <div>
      <Grid container spacing={12} style={{ marginTop: '10px' }}>
        <LocationsTable />
      </Grid>
    </div>
  )
}
