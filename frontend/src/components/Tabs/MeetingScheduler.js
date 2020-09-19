import React from 'react'

import Departments from '../Scheduler/Department'
import Positions from '../Scheduler/Positions'
// import People from '../Scheduler/People'
import Paper from '../Scheduler/Paper'

export default function MeetingScheduler () {
  return (
    <div>
      <Paper Comp={Departments} Title='Departments' noPaper={true} />
      <Paper Comp={Positions} Title='Open Positions' noPaper={true} />
      {/* <Paper Comp={People} Title='People' /> */}
    </div>
  )
}
