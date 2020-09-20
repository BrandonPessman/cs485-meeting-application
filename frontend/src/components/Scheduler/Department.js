import React from 'react'
import Grid from '@material-ui/core/Grid'
import DepartmentTable from './DepartmentTable'

export default function Department ({ setShowNextStep }) {
  return (
    <div>
      <Grid container spacing={12}>
        <DepartmentTable setShowNextStep={setShowNextStep} />
      </Grid>
    </div>
  )
}
