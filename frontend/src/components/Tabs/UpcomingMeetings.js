import React, {useState, useEffect} from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

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

const fakeData = 
{
    meetings: [
        {
            title: 'Meeting with Steve',
            starttime: new Date(2020, 10, 10, 3, 30, 0),
            endtime: new Date(2020, 10, 10, 4, 30, 0),
            location: 'Phillips 007',
            candidate: 'Bob Bobkins',
            users: [{name: "Steve", role: '1'}, { name: "Bob", role: '0'}]
        },
        {
            title: 'Meeting with Sarah',
            starttime: new Date(2020, 10, 10, 5, 30, 0),
            endtime: new Date(2020, 10, 10, 6, 30, 0),
            location: 'Phillips 007',
            candidate: 'Bob Bobkins',
            users: [{name: "Sarah", role: '1'},  { name: "Bob", role: '0'}]
        },
        {
            title: 'Research Talk to Class',
            starttime: new Date(2020, 10, 10, 7, 30, 0),
            endtime: new Date(2020, 10, 10, 8, 30, 0),
            location: 'Phillips 007',
            candidate: 'Bob Bobkins',
            users: [{name: "Steve", role: '1'}, { name: "Sarah", role: '1'},  { name: "Bob", role: '0'}]
        },
        {
            title: 'Research Talk to Class',
            starttime: new Date(2020, 10, 11, 7, 30, 0),
            endtime: new Date(2020, 10, 11, 8, 30, 0),
            location: 'Phillips 007',
            candidate: 'Bob Bobkins',
            users: [{name: "Steve", role: '1'}, { name: "Sarah", role: '1'},  { name: "Bob", role: '0'}]
        }
    ]
}

export default function UpcomingMeetings () {
    const [data, setData] = useState([])

    useEffect(() => {
        let list = [];
        for (let i = 0; i < fakeData.meetings.length; i++) {
            let z = fakeData.meetings[i];
            let added = false

            let meeting = {
                title: z.title,
                starttime: z.starttime,
                endtime: z.endtime,
                location: z.location,
                candidate: z.candidate,
                users: z.users,
                date: months[z.starttime.getMonth()] + ' ' + z.starttime.getDate() + ', ' + z.starttime.getFullYear()
            }

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
                        {inst.meetings.map(meetings => { return (
                            <Grid item xs={12}>
                                <h4 style={{fontWeight: '300', margin: '0', borderBottom: 'solid 1px black'}}><span style={{fontWeight: '600'}}>{meetings.candidate}</span> - {meetings.title}<span style={{float: 'right', fontWeight: '600'}}>{meetings.location}</span></h4>
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
