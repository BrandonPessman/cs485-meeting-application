import React from 'react'
import './App.css'
import { CookiesProvider } from 'react-cookie';

import Navigation from './components/Navigation/Navigation'

export default function ClippedDrawer () {
  return (
    <div>
      <CookiesProvider>
        <Navigation />
      </CookiesProvider>
    </div>
  )
}

/*
  1. Department
  2. Positions
  3. Canidates
  4. Schedules
*/
