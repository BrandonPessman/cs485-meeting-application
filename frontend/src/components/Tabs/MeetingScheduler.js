import React, { useState } from 'react'

import Departments from '../Scheduler/Department'
import Positions from '../Scheduler/Positions'
import Candidates from '../Scheduler/Candidates'
import Meetings from '../Scheduler/Meetings'
import Paper from '../Scheduler/Paper'

export default function MeetingScheduler() {
  const [showPositions, setShowPositions] = useState(false)
  const [showCandidates, setShowCandidates] = useState(false)
  const [showMeetings, setShowMeetings] = useState(false)

  if ((showCandidates && !showPositions) || (showMeetings && !showCandidates)) {
    setShowCandidates(false)
    setShowMeetings(false)
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
        <Paper Comp={Candidates} Title='Candidates' noPaper={true} setShowNextStep={setShowMeetings} />
      ) : (
          ''
        )}
      {showCandidates && showPositions && showMeetings ? (
        <Paper Comp={Meetings} Title='Meetings' noPaper={true} />
      ) : (
          ''
        )}

    </div>
  )
}
