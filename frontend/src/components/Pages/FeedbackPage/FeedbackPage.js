import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useParams } from "react-router";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import ReactStars from "react-rating-stars-component";
import { useHistory } from "react-router-dom";

export default function FeedbackPage({user}) {
  let { id } = useParams();
  let history = useHistory();

  const [feedback, setFeedback] = useState([]);
  const [currentStar, setCurrentStar] = useState(3);
  const [averageStars, setAverageStars] = useState(0);

  useEffect(() => {
    axios.get("http://104.131.115.65:3443/users")
    .then(response => {
      let users = response.data.user
      console.log(users)
      axios.post("http://104.131.115.65:3443/meetingFeedback/", {meeting_id: id})
      .then(response => {
        console.log(response.data);
        var math = 0;
        for (let i = 0; i < response.data.feedback.length; i++) {
          if(response.data.feedback[i].stars != null) {
            var math = math + response.data.feedback[i].stars;
          }
          for (let j = 0; j < users.length; j++) {
            if (response.data.feedback[i].author == users[j].u_id) {
              response.data.feedback[i].author = users[j].name;
            }
          }
        }
        setFeedback(response.data.feedback)
        if (response.data.feedback.length>1) {
        setAverageStars(Math.round(math/response.data.feedback.length));
        }else{
          setAverageStars(math);
        }
      })
    })
  }, [])

  const handleSubmit = () => {
    console.log("Ok")
    const str = document.getElementById('feedback-current').value;
    const data = {
      content: str,
      author: user.u_id,
      meeting_id: id,
      stars:currentStar
    }
    console.log(data)
    axios.post("http://104.131.115.65:3443/insertFeedback/", {data})
    .then(function (response) {
      console.log(response.data);
      history.go(0);
    });
  } 

  const handleDelete = (feedbackId) => {
    console.log(feedbackId);  
    axios.delete(`http://104.131.115.65:3443/deleteFeedback/${feedbackId}`)
    .then(function (response) {
      console.log(response);
      history.go(0);
    });
  }
  const handleStarClick = (value) => {
    console.log(value);
    setCurrentStar(value);
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
        <ReactStars
          id = 'RatingId'
          activeColor="red"
          onChange={handleStarClick}
          count={5}
          name='Rating'
          size={24}
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
          <h4>Average Rating among participants- {averageStars} stars</h4>
          {feedback.map((item,i) => {
            return (
              <>
                <div key={"feedback-" + i} style={{backgroundColor: user.name == item.author ? 'rgba(0,0,255,.2)' : 'rgba(0,0,0,.05)', padding: '5px', borderRadius: '4px', margin: '5px'}}>
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
                  onClick={(event) => handleDelete(item.feedback_Id)}
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
