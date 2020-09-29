import React from 'react'
import Grid from '@material-ui/core/Grid'
import MeetingsTable from './MeetingsTable'

export default function Department({ setShowNextStep }) {
    return (
        <div>
            <Grid container spacing={12}>
                <MeetingsTable />
            </Grid>
        </div>
    )
}
