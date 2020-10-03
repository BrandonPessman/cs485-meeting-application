import React from 'react'
import Grid from '@material-ui/core/Grid'
import UsersTable from './UsersTable'

export default function Department({ setShowNextStep }) {
  return (
    <div>
      <Grid container spacing={12} style={{ marginTop: '10px' }}>
        <h1>Test</h1>
        <UsersTable />
      </Grid>
    </div>
  )
}
