import React from 'react'
import './Navigation.css'

export default function ClippedDrawer () {
  return (
    <>
      <ul>
        <li style={{ color: 'white' }}>
          <p style={{ fontWeight: '600' }}>Meeting Scheduler Application</p>
        </li>
        <li style={{ float: 'right' }}>
          <a href='#home'>Logout</a>
        </li>
        <li style={{ float: 'right' }}>
          <a href='#news'>Help</a>
        </li>
        <li style={{ float: 'right' }}>
          <a href='#contact'>Account</a>
        </li>
        <li className='active' style={{ float: 'right' }}>
          <a href='#about'>Home</a>
        </li>
      </ul>
    </>
  )
}
