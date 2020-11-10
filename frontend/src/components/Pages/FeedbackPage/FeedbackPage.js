import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useParams } from "react-router";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useHistory } from "react-router-dom";

export default function FeedbackPage({user}) {
  let { id } = useParams();
  let history = useHistory();

  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3443/users")
    .then(response => {
      let users = response.data.user

      axios.post("http://localhost:3443/meetingFeedback/", {meeting_id: id})
      .then(response => {
        for (let i = 0; i < response.data.feedback.length; i++) {
          for (let j = 0; j < users.length; j++) {
            if (response.data.feedback[i].author == users[j].u_id) {
              response.data.feedback[i].author = users[j].name;
            }
          }
        }

        setFeedback(response.data.feedback)
      })
    })
  }, [])

  const handleSubmit = () => {
    const str = document.getElementById('feedback-current').value;
    const data = {
      content: str,
      author: user.u_id,
      meeting_id: id
    }

    axios.post("http://localhost:3443/insertFeedback/", {data})
      .then(response => {
        console.log("Yay")
      })
  } 

  const handleDelete = (feedbackId) => {

  }

  return (
    <div style={{ margin: '40px 100px' }}>
              <Paper
          container
          xs={12}
          style={{ margin: "50px auto", width: "600px", padding: "40px" }}
        >
      <h1>Add Feedback</h1>
      <TextField
            id="feedback-current"
            label="Feedback"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            size="small"
            style={{ margin: "10px 0", width: "100%" }}
          />
                    <Button
            id="create-location-button"
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            style={{ width: "100%" }}
          >
            Submit Feedback
          </Button>
          <h1>Current Feedback</h1>
          {feedback.map(item => {
            return (
              <>
                <div key={item.feedback_id} style={{backgroundColor: user.name == item.author ? 'rgba(0,0,255,.2)' : 'rgba(0,0,0,.05)', padding: '5px', borderRadius: '4px', margin: '5px'}}>
                <h4 style={{padding: '0', margin: '0'}}>
                  @{item.author}

                  <span style={{float: 'right', fontWeight: '100'}}>
                  {new Date(item.date_time_created).toDateString()}
                  </span>
                </h4>
                <p style={{padding: '5px', margin: '0'}}>
                  {item.content}
                </p>
                <p>
                  
                </p>
                {
                  user.name == item.author ? 
                  <Button
                  id="create-location-button"
                  onClick={() => {history.goBack()}}
                  variant="contained"
                  color="secondary"
                >
                  Delete
                </Button>
                : ""
                }
                </div>
              </>
            )
          })}
          <Button
            id="create-location-button"
            onClick={() => {history.goBack()}}
            variant="contained"
            color="primary"
            style={{ width: "100%", marginTop: '10px' }}
          >
            Go Back
            </Button>
          </Paper>
    </div>
  )
}
