'user strict'
var MySQL = require('mysql')
const moment = require('moment');
const { response } = require('express');
var email;
var type;
class Driver {
  constructor () {
    this.connection = MySQL.createConnection({
      host: 'db-mysql-nyc1-50615-do-user-4426317-0.b.db.ondigitalocean.com',
      user: 'doadmin',
      password: 'ogko1iyzhpj5z4u5',
      database: 'InterviewTracker',
      port: '25060'
    })
    this.connection.connect(function (err) {
      if (err) throw err
      console.log('Connection to InterviewTracker succeeded')
    })
  }
  quit() {
    this.connection.end()
  }
  getAllMeetings(request, response){
    const query='SELECT * FROM Meeting';
    this.connection.query(query,(error,rows)=>{
        if(error){
            console.log(error.message);
        }
        else{
            response.send({
            meetings:rows.map(mapMeetings),
          });
        }
    });
}

  insertUser (id, email, password, phone, name, type) {
    var query =
      "INSERT INTO user (u_id, email, u_password, phone_number, name, type) VALUES (" +
      id +
      ", '" +
      email +
      "', '" +
      password +
      "'," +
      phone +
      ", '" +
      name +
      "'," +
      type +
      ")"
    return this.connection.query(query, function (err, results) {
      if (err) throw err
      console.log(results)
    })
  }
  
  updateUser({id, password, phone, name, type}){
    var currentUser = getUser(id)
    var update = [password, phone, name, type]
    var original = ['u_password', 'phone_number', 'name', 'type']
    for (var i = 0; i<update.length; i++) {
      if (currentUser.original[i] === update[i]) {
        var query = 'UPDATE user SET ' + original[i] + ' = ' + update[i] + 'WHERE u_id = ' + id
        return this.connection.query(query, function (err, results) {
        if (err) throw err
        console.log(results)
        })
      }
    }
  }
  getUser(id) {
    var query = 'SELECT * FROM user WHERE u_id = ' + id
    return this.connection.query(query, function (err, results) {
      if (err) throw err;
      console.log(results)
    })
  }
  getAllUsers() {
    const query='SELECT * FROM user';
    this.connection.query(query,(error,rows)=>{
        if(error){
            console.log(error.message);
        }
        else{
            response.send({
            meetings:rows.map(mapUsers)
          });
        }
    });
  }
  getMeeetingUsers(meeting_id) {
    var query = 'SELECT * FROM user WHERE email IN (SELECT email FROM meetingUser WHERE meeting_id = ' + meeting_id + ')'
    return this.connection.query(query, function (err, results) {
      if (err) throw err;
      console.log(results)
    })
  }
  getUserType(id) {
    var query = 'SELECT type_descr FROM userTypes WHERE type_id IN (SELECT type FROM user where u_id = ' + id + ')'
    return this.connection.query(query, function(err, results) {
      if (err) throw err;
      console.log(results)
    })
  }
  meetingCombo(user_id, meeting_id) {
    var query = 'Insert into meetingUser (meeting_id, u_id) VALUES(' + meeting_id + ', ' + user_id + ')'
      this.connection.query(query, function (err, results) { 
        if (err) throw err;
        console.log(results);
        })
  }
  insertMeeting (id, location, users, start_time, end_time) {
    var query =
      "INSERT INTO Meeting (meeting_id, location_id, users, start_date_time, end_date_time) VALUES (" +
      id +
      "," +
      location +
      ", '" +
      users +
      "', '" +
      start_time +
      "', '" +
      end_time +
      "')"
      this.connection.query(query, function (err, results) {
        if (err) throw err;
        console.log(results)
      })
    var users = users.split(",");
    for (var i = 0; i<users.length; i++) {
      var user_id = parseInt(users[i]);
      this.meetingCombo(user_id, id);
    }
  }
  getMeeting(id) {
    var query = 'SELECT * FROM Meeting WHERE meeting_id = ' + id
    return this.connection.query(query, function (err, results) {
      if (err) throw err;
      console.log(results)
    })
  }
  updateMeeting(id, location, users, start_time, end_time) {
    var currentMeeting = this.getMeeting(id);
    console.log(currentMeeting.location_id);
    var list = [location, users, start_time, end_time]
    var objectList = [currentMeeting.location_id, currentMeeting.users, currentMeeting.start_time, currentMeeting.end_time]
    for (var i = 0; i<list.length; i++) {
      if (objectList[i] != list[i]) {
        this.connection.query("UPDATE Meeting SET " + objectList[i] + ' = ' + list[i] + ' WHERE meeting_id = ' + id, function (err, results) {
          if (err) throw err;
          console.log(results)
        })
      }
    }
  }
  insertFeedbackCombo(query) {
    return this.connection.query(query, function (err, results) {
      if (err) throw err;
      console.log(results)
    })
  }
  insertFeedback (id, content, author, meeting_id) {
    let now = moment().format("YYYY-MM-DD HH:mm:ss");
    var query =
      "INSERT INTO Feedback (feedback_Id, content, author, date_time_created, meeting_id) VALUES (" +
      id +
      ", '" +
      content +
      "', '" +
      author +
      "', '" +
      now +
      "'," +
      meeting_id +
      ")"
    var comboQuery = 'INSERT INTO feedbackCombo (feedback_id, meeting_id, author_email) VALUES ('+
        id +
        ", " +
        meeting_id + 
        ", '" +
        author + 
        "')"
    this.insertFeedbackCombo(comboQuery)
    return this.connection.query(query, function (err, results) {
      if (err) throw err;
      console.log(results)
      })
  }
  getFeedbackMeeting(meetingId) {
    var query = 'SELECT * FROM Feedback WHERE meeting_id = ' + meetingId
    return this.connection.query(query, function (err, results) {
      if (err) throw err
      console.log(results)      
    })
  }
  getAllFeedback() {
    var query = 'SELECT * FROM Feedback'
    return this.connection.query(query, (err, rows)=> {
      if (err){
        console.log(err)
      }
      response.send({
        feedback:rows.map(mapFeedback)
      })
    })
  }
  getFeedbackCombo(feedback_id, meeting_id) {
    var query = "SELECT * FROM Feedback WHERE feedback_Id = " + feedback_id + " and meeting_id = " + meeting_id
    return this.connection.query(query, function (err, results) {
      if (err) throw err
      console.log(results)
    })
  }
  /**The only thing the user can change is content */
  updateFeedback(id, content) {
    var query = 'UPDATE SET content = ' + content + 'WHERE feedback_id = ' + id
    return this.connection.query(query, function (err, results) {
      if (err) throw err;
      console.log(results);
    })
  }
  getPositions() {
    var query = 'SELECT * FROM EmployeePosition';
    this.connection.query(query, (err, rows) =>{
      if (err) {
        console.log(err)
      }
      else{
        response.send({
          positions:rows.map(mapPosition)
        })
      }
    })
  }
  getLocations() {
    var query = 'SELECT * FROM Location';
    this.connection.query(query, (err, rows)=>{
      if (err) {
       console.log(err)
      }
      else{response.send({
        locations:rows.map(mapLocation)
      })}
    })
  }
  getUserTypes() {
    var query = 'SELECT * FROM userTypes';
    this.connection.query(query, (err, rows) => {
      if (err) {
        console.log(err)
      }
      else{response.send({
        types:rows.map(mapTypes)
        })
        console.log(rows)
      }
    })
  }
  toDate(date) {
    date = date.toISOString();
    date = date.substr(1, 19);
    date = date.replace('T', ' ');
    return(date);
  }
}
function mapMeetings(row){
  return{
    meeting_id : row.meeting_id,
    location_id : row.location_id,
    users : row.users,
    start_date_time : row.start_date_time,
    end_date_time : row.end_date_time,
    meeting_length:row.meeting_length,
    meeting_status:row.meeting_status,
  };
}
function mapUsers(row) {
return{
    u_id : row.u_id,
    email : row.email,
    u_password : row.u_password,
    phone_number : row.phone_number,
    name : row.name,
    type : row.type
  };
}
function mapFeedback(row) {
  return{
    feedback_Id : row.feedback_Id,
    content : row.content,
    author : row.author,
    date_time_created : row.date_time_created,
    meeting_id : row.meeting_id
  };
}
function mapLocation(row) {
  return{
  location_id : row.location_id,
  name : row.name,
  available : row.available
  };
}
function mapPosition(row) {
  return{
  position_id : row.position_id,
  title : row.title,
  currentEmployee : row.currentEmployee
  };
}
var newdriver = new Driver();
exports.newdriver=newdriver;