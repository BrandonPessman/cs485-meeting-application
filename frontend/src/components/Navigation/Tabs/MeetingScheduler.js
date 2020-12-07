import React, { useEffect, useState } from 'react'

import Departments from '../../Pages/Scheduler/Department'
import Positions from '../../Pages/Scheduler/Positions'
import Candidates from '../../Pages/Scheduler/Candidates'
import Meetings from '../../Pages/Scheduler/Meetings'
import Paper from '../../Utilities/Paper'
import axios from 'axios'
import { Button } from '@material-ui/core'

export default function MeetingScheduler() {
  const [showAll, setShowAll] = useState(false);
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
  const showAllOptions = () => {
    setShowPositions(true);
    setShowCandidates(true);
    setShowMeetings(true);
    setShowAll(true);
  }

  return (
    <div>
      <Button 
        variant='contained' 
        color='secondary'
        onClick = { showAllOptions }
        >
        Show All
      </Button>
      <Paper
        Comp={Departments}
        data = {departments}
        Title='Departments'
        noPaper={true}
        setShowNextStep={setShowPositions}
        setShowAll={showAll}
      />
      {showPositions ? (
        <Paper
          Comp={Positions}
          Title='Open Positions'
          noPaper={true}
          setShowNextStep={setShowCandidates}
          setShowAll={showAll}
        />
      ) : (
          ''
        )}
      {showCandidates && showPositions ? (
        <Paper Comp={Candidates} Title='Candidates' noPaper={true} setShowNextStep={setShowMeetings} setShowAll={showAll}/>
      ) : (
          ''
        )}
      {showCandidates && showPositions && showMeetings ? (
        <Paper Comp={Meetings} Title='Meetings' noPaper={true} setShowAll={showAll}/>
      ) : (
          ''
        )}

    </div>
  )
}