import React, { useEffect, useState } from 'react'

import Departments from '../../Pages/Scheduler/Department'
import Positions from '../../Pages/Scheduler/Positions'
import Candidates from '../../Pages/Scheduler/Candidates'
import Meetings from '../../Pages/Scheduler/Meetings'
import Paper from '../../Utilities/Paper'
import axios from 'axios'

export default function MeetingScheduler() {
  const [showPositions, setShowPositions] = useState(false)
  const [showCandidates, setShowCandidates] = useState(false)
  const [showMeetings, setShowMeetings] = useState(false)
  const [departments, setDepartments] = useState([]);
  useEffect(() => {
    axios.get("http://104.131.115.65:3443/department").then(function (response) {
      setDepartments(response.data.department);
    });
  })

  if ((showCandidates && !showPositions) || (showMeetings && !showCandidates)) {
    setShowCandidates(false)
    setShowMeetings(false)
  }

  return (
    <div>
      <Paper
        Comp={Departments}
        data = {departments}
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