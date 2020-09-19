import React from 'react'
import './App.css'

import Navigation from './components/Navigation'
import SecondaryNavigation from './components/SecondaryNavigation'

export default function ClippedDrawer () {
  return (
    <div>
      <Navigation />
      <SecondaryNavigation />
    </div>
  )
}

/*
  1. Department
  2. Positions
  3. Canidates
  4. Schedules
*/
