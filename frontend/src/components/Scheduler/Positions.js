import React from 'react'
import Grid from '@material-ui/core/Grid'
import PositionsTable from './PostionsTable'

export default function Positions ({ setShowNextStep }) {
  return (
    <div>
      <Grid container spacing={12}>
        <PositionsTable setShowNextStep={setShowNextStep} />
      </Grid>
    </div>
  )
}
