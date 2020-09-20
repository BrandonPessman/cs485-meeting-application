import React, { useState } from 'react'

import Departments from '../Scheduler/Department'
import Positions from '../Scheduler/Positions'
import Candidates from '../Scheduler/Candidates'
// import People from '../Scheduler/People'
import Paper from '../Scheduler/Paper'

export default function MeetingScheduler () {
  const [showPositions, setShowPositions] = useState(false)
  const [showCandidates, setShowCandidates] = useState(false)

  if (showCandidates && !showPositions) {
    setShowCandidates(false)
  }

  return (
    <div>
      <Paper
        Comp={Departments}
        Title='Departments'
        noPaper={true}
        setShowNextStep={setShowPositions}
      />
      {showPositions ? (
        <Paper
          Comp={Positions}
          Title='Open Positions'
          noPaper={true}
          setShowNextStep={setShowCandidates}
        />
      ) : (
        ''
      )}
      {showCandidates && showPositions ? (
        <Paper Comp={Candidates} Title='Candidates' noPaper={true} />
      ) : (
        ''
      )}
      {/* <Paper Comp={People} Title='People' /> */}
    </div>
  )
}
