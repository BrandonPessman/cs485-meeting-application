import React, { useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import axios from 'axios'

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

export default function UpcomingMeetings() {
    const [data, setData] = useState([])

    useEffect(() => {
        let list = [];

        axios.get('http://104.131.115.65:3443/meetings')
            .then(function (response) {
                let t = response.data.meeting;
                for (let i = 0; i < t.length; i++) {
                    let z = t[i];
                    let added = false

                    let meeting = {
                        title: z.meeting_title,
                        starttime: new Date(z.start_date_time),
                        endtime: new Date(z.end_date_time),
                        location: z.location_id,
                        candidate: "Bob Bobkins",
                        users: [{ name: "Steve", role: '1' }],
                        date: ''
                    }

                    meeting.date = months[meeting.starttime.getMonth()] + ' ' + meeting.starttime.getDate() + ', ' + meeting.starttime.getFullYear()

                    for (let j = 0; j < list.length; j++) {
                        if (list[j].date === meeting.date) {
                            list[j].meetings.push(meeting);
                            added = true;
                        }
                    }

                    if (!added) {
                        let t = {
                            date: meeting.date,
                            meetings: [meeting]
                        }
                        list.push(t)
                    }
                }
                setData(list)
            })
    }, [])

    return (
        <div style={{ margin: '40px 0px' }}>
            <h2 style={{ marginBottom: '0', marginTop: '0', fontWeight: '300' }}>
                Upcoming Meetings
        </h2>


            {data.map(inst => {
                return (
                    <div>
                        <Paper elevation={3} style={{ padding: '10px 30px 30px 30px', margin: '20px 0' }}>
                            <Grid container spacing={12}>
                                <Grid item xs={12}>
                                    <h2>{inst.date}</h2>
                                </Grid>
                                {inst.meetings.map(meetings => {
                                    return (
                                        <Grid item xs={12}>
                                            <h4 style={{ fontWeight: '300', margin: '5px', borderBottom: 'dotted 1px rgba(0,0,0,.3)' }}><span style={{ fontWeight: '600' }}>{meetings.candidate}</span> - {meetings.title}<span style={{ float: 'right' }}>{meetings.starttime.getUTCHours()}:{meetings.starttime.getMinutes() == 0 ? '00' : meetings.starttime.getMinutes()} to {meetings.endtime.getUTCHours()}:{meetings.endtime.getMinutes() == 0 ? '00' : meetings.endtime.getMinutes()} - {' '}<span style={{ fontWeight: '600' }}> {meetings.location}</span></span></h4>
                                        </Grid>
                                    )
                                })
                                }
                            </Grid>
                        </Paper>
                    </div>
                )
            })}

        </div>
    )
}
