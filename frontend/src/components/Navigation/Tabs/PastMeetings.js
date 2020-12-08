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

export default function UpcomingMeetings({user, cookies}) {
  const [data, setData] = useState([])
  let history = useHistory();

  useEffect(() => {
    let list = [];
    axios.get("http://104.131.115.65:3443/userMeetings/" + cookies.user.u_id).then(res => {
        let d = res.data.meeting;
        let meetingIds = [d.length];
        for (let i = 0; i < d.length; i++) {
            meetingIds[i] = d[i].meeting_id;
        }

        axios.get('http://104.131.115.65:3443/meetings')
        .then(function (response) {
            let t = response.data.meeting;
            console.log(t)
            t.sort((a, b) => new Date(b.start_date_time) - new Date(a.start_date_time));

            for (let i = 0; i < t.length; i++) {
                let z = t[i];
                let added = false
                let meeting = {
                    meeting_id: z.meeting_id,
                    title: z.meeting_title,
                    starttime: new Date(z.start_date_time),
                    endtime: new Date(z.end_date_time),
                    enddatetime: new Date(z.end_date_time).toLocaleTimeString([], {timeStyle: 'short'}),
                    location: z.location_id,
                    candidate: "Bob Bobkins",
                    users: [{ name: "Steve", role: '1' }],
                    date: '',
                    currentDateTime: ((new Date()).getTime())-21600000,
                }
                console.log(meeting.title);
                console.log("Meeting: " + z.end_date_time + " " + z.start_date_time);
                console.log("Start: " + ((meeting.starttime).getTime()));
                console.log("End: " + ((meeting.endtime).getTime()));
                console.log("Current: " + meeting.currentDateTime);
                console.log(meeting.currentDateTime - ((meeting.starttime).getTime()));
                console.log((meeting.endtime).getTime()-meeting.currentDateTime)
                console.log(((meeting.endtime).getTime()-meeting.currentDateTime)>0);
                console.log((meeting.currentDateTime - ((meeting.starttime).getTime()))>0);
                if (cookies.user.type < 3) {
                  for (let q = 0; q < meetingIds.length; q++) {
                      if (meetingIds[q] == meeting.meeting_id) {
                          if (new Date() >= meeting.starttime) {
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
                  }
                } else {
                  if (new Date() > meeting.starttime) {
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
              }

            setData(list)
        })
    })
}, [])

  const handleView = (meetingId) => {
    history.push("/meeting/" + meetingId.meeting_id);
}

  return (
    <div style={{ margin: '40px 0px' }}>
      <h2 style={{ marginBottom: '0', marginTop: '0', fontWeight: '500' }}>
        Past Meetings - <span style={{fontWeight: '100', fontStyle: 'italic'}}>{cookies.user.type != 1 ? "Your Meetings" : "All Meetings"}</span>
        <span style={{ float: 'right' }}><Button variant='contained' color='primary' onClick={() => { document.body.style.zoom = .75; window.print(); document.body.style.zoom = 1; }}>
          Print Past Meetings
            </Button></span>
      </h2>


      {data.map(inst => {
        return (
          <div>
            <Grid container spacing={12} style={{marginLeft: '20px', marginBottom: '20px'}}>
              <Grid item xs={12}>
                <h2>{inst.date}</h2>
              </Grid>
              <Grid container spacing={12}>
              {inst.meetings.map(meetings => {
                return (
                    <Grid item xs={3} style={{backgroundColor: 'white', borderRadius: '4px', boxShadow: '4px 4px 10px rgba(0,0,0,.3)', padding: '20px', marginRight: '15px'}}>
                      <h4 style={{ fontWeight: '300', margin: '0px', borderBottom: 'dotted 1px rgba(0,0,0,.3)' }}>{meetings.title}</h4>
                      <p>Status: <span style={{ float: 'right' }}>{(((meetings.currentDateTime - (meetings.starttime).getTime())>0) && (((meetings.endtime).getTime()-meetings.currentDateTime)>0)) ? "In Progress - Finishes at " + meetings.enddatetime :  "Completed"}</span></p>
                      <p>Starting Time: <span style={{ float: 'right' }}>{meetings.starttime.toLocaleTimeString([], {timeStyle: 'short'})}</span></p>
                      <p>End Time: <span style={{ float: 'right' }}>{meetings.endtime.toLocaleTimeString([], {timeStyle: 'short'})}</span></p>
                      <Button size="small" variant='contained' color='primary' onClick={() => handleView(meetings)} style={{width: '50%'}}>Manage</Button>
                      {cookies.user.type == 1 ? <Button size="small" variant='contained' onClick={() => history.push("/feedback/" + meetings.meeting_id)} style={{width: '50%'}}>Feedback</Button> : <></>}
                    </Grid>
                ) 
              })
              }
               </Grid>
            </Grid>
          </div>
        )
      })}
            {data && data.length == 0 ? 
                <h4 style={{fontStyle: 'italic', fontWeight: '300'}}>You have no upcoming meetings. Please check back later.</h4>
            : <></>}
    </div>
  )
}
