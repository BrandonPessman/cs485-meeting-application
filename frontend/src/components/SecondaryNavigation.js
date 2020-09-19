import React from 'react'
import './SecondaryNavigation.css'
import MeetingScheduler from './Tabs/MeetingScheduler'

export default function ClippedDrawer () {
  return (
    <>
      <ul
        style={{
          backgroundColor: 'white',
          boxShadow: '0 4px 16px rgba(0,0,0,.1)',
          padding: '0px 200px'
        }}
      >
        <h2
          style={{
            marginBottom: '0',
            fontWeight: '300',
            padding: '10px 0',
            width: '100%'
          }}
        >
          Meeting Scheduler Center{' '}
          <span
            style={{
              float: 'right',
              color: 'rgb(100,100,100)',
              fontWeight: '200',
              fontSize: '14px'
            }}
          >
            <span style={{ color: 'rgb(27, 14, 83)', fontWeight: '600' }}>
              User:
            </span>{' '}
            Brandon Pessman
            <br />
            <span style={{ color: 'rgb(27, 14, 83)', fontWeight: '600' }}>
              Role:
            </span>{' '}
            Administrator
          </span>
        </h2>
        <li className='secondary-li secondary-li-active'>
          <a href='#home'>Meeting Scheduler</a>
        </li>
        <li className='secondary-li'>
          <a href='#news'>Upcoming Meetings</a>
        </li>
        <li className='secondary-li'>
          <a href='#news'>Past Meetings</a>
        </li>
        <li className='secondary-li'>
          <a href='#news'>Administrator</a>
        </li>
      </ul>

      <div style={{ padding: '10px 200px' }}>
        <MeetingScheduler />
      </div>
    </>
  )
}
