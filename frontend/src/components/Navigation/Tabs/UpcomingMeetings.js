import React, { useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import axios from 'axios'
import Button from '@material-ui/core/Button'
import { useHistory } from "react-router-dom";

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
    let history = useHistory();

    useEffect(() => {
        let list = [];

        axios.get('http://localhost:3443/meetings')
            .then(function (response) {
                let t = response.data.meeting;

                t.sort((a, b) => new Date(a.start_date_time) - new Date(b.start_date_time));

                for (let i = 0; i < t.length; i++) {
                    let z = t[i];
                    let added = false
              
                    let meeting = {
                        meeting_id: z.meeting_id,
                        title: z.meeting_title,
                        starttime: new Date(z.start_date_time),
                        endtime: new Date(z.end_date_time),
                        location: z.location_id,
                        candidate: "Bob Bobkins",
                        users: [{ name: "Steve", role: '1' }],
                        date: ''
                    }

                    if (new Date() < meeting.starttime) {
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
                }

                setData(list)
            })
    }, [])

    const handleView = (meetingId) => {
        history.push("/meeting/" + meetingId.meeting_id);
    }

    return (
        <div style={{ margin: '40px 0px' }}>
            <h2 style={{ marginBottom: '0', marginTop: '0', fontWeight: '300' }}>
                Upcoming Meetings
                <span style={{ float: 'right' }}><Button variant='contained' color='secondary' onClick={() => { document.body.style.zoom = .75; window.print(); document.body.style.zoom = 1; }}>
                    Print Itinarary
            </Button></span>
            </h2>


            {data.map(inst => {
                return (
                    <div>
                      
                            <Grid container spacing={12} style={{marginLeft: '20px', marginBottom: '20px'}}>
                                <Grid item xs={12}>
                                    <h2>{inst.date}</h2>
                                </Grid>
                                {inst.meetings.map(meetings => {
                                    return (
                                        <Grid item xs={6} style={{backgroundColor: 'white', borderRadius: '4px', boxShadow: '4px 4px 10px rgba(0,0,0,.3)', padding: '20px', marginRight: '15px'}}>
                                            <h4 style={{ fontWeight: '300', margin: '5px', borderBottom: 'dotted 1px rgba(0,0,0,.3)' }}>{meetings.title}<span style={{ float: 'right' }}>{meetings.starttime.getUTCHours()}:{meetings.starttime.getMinutes() == 0 ? '00' : meetings.starttime.getMinutes()} to {meetings.endtime.getUTCHours()}:{meetings.endtime.getMinutes() == 0 ? '00' : meetings.endtime.getMinutes()}</span></h4>
                                            <Button size="small" variant='contained' color='primary' onClick={() => handleView(meetings)}>View/Edit</Button>
                                            <Button size="small" variant='contained' color='secondary' onClick={() => history.push("/feedback/" + meetings.meeting_id)}>Add Feedback</Button>
                                        </Grid>
                                    )
                                })
                                }
                            </Grid>
                       
                    </div>
                )
            })}

        </div>
    )
}
