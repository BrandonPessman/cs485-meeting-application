var MySQL = require('mysql')
const moment = require('moment');

class Driver {
  /*Establishes connection to mySQL database - Interview Tracker*/
  constructor() {
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
  /*Ends connection to mySQL database - Interview Tracker*/
  quit() {
    this.connection.end()
  }
  /*Get all meetings*/

  /*Inserts user to 'user' table*/
  insertUser(request, response) {
    var query =
      "INSERT INTO user VALUES (?,?,?,?,?,?,?)"
    var params = [NULL, request.body.email, request.body.phone_number, request.body.name, request.body.type, request.body.u_position]
    this.connection.query(query, params, (err, result) => {
      if (err) { console.log(err) }
      else { response.send({ status: true }); }
    });
  }
  /*Updates user in 'user' table - need to change to make frontend-friendly*/
  updateUser(request, response) {
    var query = 'UPDATE user SET u_password=?, phone_number=?, name=?, type=? WHERE u_id = ?';
    var params = [request.body.u_password, request.body.phone_number, request.body.name, request.body.type, request.body.u_id];
    this.connection.query(query, params, (err) => {
      if (err) { console.log(err) }
      else { response.send({ status: true }); }
    });
  }
  /*gets user from 'user' table using email and u_password col*/
  getUser(request, response) {
    var query = 'SELECT * FROM user WHERE email = ? and u_password= ? LEFT JOIN userTypes ON user.type = userTypes.type_id'
    const params = [request.params.email, request.params.u_password];
    this.connection.query(query, params, (err, rows) => {
      if (err) { console.log(err) }
      else { response.send({ user: rows.map(mapUser) }); }
    })
  }
  /*Gets all users from 'user' table - returns type_descr from userTypes*/
  getAllUsers(response) {
    const query = 'SELECT * FROM user LEFT JOIN userTypes ON user.type = userTypes.type_id';
    this.connection.query(query, (error, rows) => {
      if (error) {
        console.log(error.message);
      }
      else {
        response.send({ user: rows.map(mapUser) });
      }
    });
  }
  /*Returns string of user type from 'userTypes' table for requested User*/
  getUserType(request, response) {
    var query = 'SELECT type_descr FROM userTypes WHERE type_id IN (SELECT type FROM user where u_id = ?)'
    var params = [request.body.u_id];
    return this.connection.query(query, params, (err, rows) => {
      if (err) { console.log(err) }
      else { response.send({ user_type: rows.map(mapTypes) }) };
    })
  }
  addMeetingUser(request, response) {
    var query = 'INSERT INTO meetingUser VALUES (?,?)'
    const params = [request.body.meeting_id, request.body.u_id];
    this.connection.query(query, params, function (err, response) {
      if (err) {
        console.log(err);
      }
      else {
        console.log(response)
      }
    })
  }
  /*Gets all users from specific meeting user meeting_id - need to add left join for usertype string*/
  getMeetingUsers(request, response) {
    var query = 'SELECT * FROM user U LEFT JOIN userTypes on U.type=userTypes.type_id WHERE U.u_id=ANY(SELECT u_id FROM meetingUser WHERE meeting_id=?)'
    var params = [request.body.meeting_id]
    this.connection.query(query, params, (err, rows) => {
      if (err) {
        console.log(err)
      }
      else { console.log(rows) }
    })
  }
  getAllMeetings(request, response) {
    const query = 'SELECT * FROM Meeting';
    this.connection.query(query, (error, rows) => {
      if (error) {
        console.log(error.message);
      }
      else {
        console.log(rows)
        response.json(rows)
      }
    });
  }
  /*Adds each user in meeting to meetingCombo table, ONLY ever called by insertMeeting*/
  meetingCombo(user_id, meeting_id) {
    var query = 'Insert into meetingUser (meeting_id, u_id) VALUES(' + meeting_id + ', ' + user_id + ')'
    this.connection.query(query, function (err, results) {
      if (err) throw err;
      console.log(results);
    })
  }
  /*Insert new Meeting*/
  insertMeeting(request, response) {
    const query = 'INSERT INTO Meeting (meeting_id,meeting_title, meeting_descr, location_id, start_date_time, end_date_time, position_id) VALUES (?,?,?,?,?,?,?)';
    const params = [request.body.meeting_id, request.body.meeting_title, request.body.meeting_descr, request.body.location_id, request.body.start_date_time,
    request.body.end_date_time, request.body.position_id];
    this.connection.query(query, params, (error, response) => {
      if (error) {
        console.log(error.message);
      }
      else {
        var meeting_id = response.insertId;
        response.send({ status: true, meeting_id: meeting_id, });
        console.log(response)
        var users = request.users.split(",");
        /*For each user in 'users' string call meetingCombo*/
        for (var i = 0; i < users.length; i++) {
          var user_id = parseInt(users[i]);
          this.meetingCombo(user_id)
        }
      }
    });
    var position = request.body.position_id;
    var meeting = request.body.meeting_id
    var req = { position_id: position, meeting_id: meeting }
    this.insertMeetingPosition(req)
  }
  /*gets meeting from 'Meeting' table using meeting_id*/
  getMeeting(request, response) {
    var query = 'SELECT * FROM Meeting WHERE meeting_id = ?'
    var params = [request.body.meeting_id]
    return this.connection.query(query, params, (err, rows) => {
      if (err) { console.log(err) }
      else { response.json(rows) }
    })
  }
  /*Updates meeting in 'Meeting' table -- need to update*/
  updateMeeting(id, location, users, start_time, end_time) {
    var currentMeeting = this.getMeeting(id);
    console.log(currentMeeting.location_id);
    var list = [location, users, start_time, end_time]
    var objectList = [currentMeeting.location_id, currentMeeting.users, currentMeeting.start_time, currentMeeting.end_time]
    /*Checks if original value in column is equal to the new one, if not, update*/
    for (var i = 0; i < list.length; i++) {
      if (objectList[i] != list[i]) {
        this.connection.query("UPDATE Meeting SET " + objectList[i] + ' = ' + list[i] + ' WHERE meeting_id = ' + id, function (err, results) {
          if (err) throw err;
          console.log(results)
        })
      }
    }
  }
  /*Insert feedback & meeting into feedbackCombo
    only ever called by insertFeedback*/
  insertFeedbackCombo(query) {
    return this.connection.query(query, function (err, results) {
      if (err) throw err;
      console.log(results)
    })
  }
  /*Inserts feedback instance into 'Feedback' table*/
  insertFeedback(request, response) {
    let now = moment().format("YYYY-MM-DD HH:mm:ss");
    var query =
      "INSERT INTO Feedback (feedback_Id, content, author, date_time_created, meeting_id) VALUES (?, ?, ?, ?, ?)"
    var params = [request.body.feedback_Id, request.body.content, request.body.author, now, request.body.meeting_id];
    var comboQuery = 'INSERT INTO feedbackCombo (feedback_id, meeting_id, author_email) VALUES (' +
      request.body.feedback_Id +
      ", " +
      request.body.meeting_id +
      ", '" +
      request.body.author +
      "')"
    /*Adds combination to insertFeedbackCombo*/
    this.insertFeedbackCombo(comboQuery)
    return this.connection.query(query, params, (err, response) => {
      if (err) {
        console.log(err);
      } else {
        console.log(response)
      }
    })
  }
  /*Get all feedback that exist in specific Meeting*/
  getMeetingFeedback(request, response) {
    var query = 'SELECT * FROM Feedback WHERE feedback_id IN (SELECT feedback_id FROM feedbackCombo where meeting_id = ?)'
    var params = [request.body.meeting_id]
    return this.connection.query(query, params, (err, rows) => {
      if (err) {
        console.log(err)
      } else {
        response.json(rows)
      }
    })
  }
  /*Returns all feedback from 'Feedback' table*/
  getAllFeedback(response) {
    var query = 'SELECT * FROM Feedback'
    return this.connection.query(query, (err, rows) => {
      if (err) {
        console.log(err)
      }
      else {
        response.json(rows)
      }
    })
  }
  /**Updates feedback instance in 'Feedback' table - The only thing the user can change is content */
  updateFeedback(request, reponse) {
    var query = 'UPDATE feedback SET content = ? WHERE feedback_id = ?'
    var params = [request.body.content, request.body.feedback_id]
    return this.connection.query(query, params, (err, response) => {
      if (err) {
        console.log(err)
      } else {
        response.send(response)
      }
    })
  }
  /*Returns all positions from 'EmployeePosition' table*/
  getPositions(request, response) {
    var query = 'SELECT EmployeePosition.position_id, EmployeePosition.position_title, EmployeePosition.currentEmployee, EmployeePosition.department_id, EmployeePosition.vacant, Count(EmployeePosition.position_id) as meeting_count FROM EmployeePosition LEFT JOIN meetingPositions ON EmployeePosition.position_id = meetingPositions.position_id group by position_id'
    this.connection.query(query, (err, rows) => {
      if (err) {
        console.log(err)
      }
      else {
        console.log(rows)
        response.json(rows)
      }
    })
  }
  /**Increments the number of meetings under position - only called by insertMeeting */
  insertMeetingPosition(request, response) {
    var query = 'INSERT  INTO meetingPositions VALUES(?,?)'
    var params = [request.body.position_id, request.body.meeting_id]
    this.connection.query(query, params, (err, response) => {
      if (err) {
        console.log(err)
      } else {
        console.log(response);
      }
    })
  }
  /*Returns all locations from 'Location' table*/
  getLocations(request, response) {
    var query = 'SELECT * FROM Location';
    this.connection.query(query, (err, rows) => {
      if (err) {
        console.log(err)
      }
      else {
        response.json(rows)
      }
    })
  }
  /*Returns all user types from 'userType' table*/
  getUserTypes(response) {
    var query = 'SELECT * FROM userTypes';
    this.connection.query(query, (err, rows) => {
      if (err) {
        console.log(err)
      }
      else {
        response.json(rows)
      }
    })
  }
  /*Gets all departments from Department table*/
  getDepartments(request, response) {
    var query = 'SELECT * FROM Department';
    this.connection.query(query, (err, rows) => {
      if (err) {
        console.log(err)
      }
      else {
        response.json(rows)
        console.log(rows)
      }
    })
  }
  /**Inserts a new department in Department table */
  insertDepartment(request, response) {
    var query = "INSERT INTO Department (dept_id, dept_title, dept_short) VALUES (?,?,?)"
    var params = [request.body.dept_id, request.body.dept_title, request.body.dept_short]
    this.connection.query(query, params, (err, results) => {
      if (err) {
        console.log(err)
      }
      else {
        response.json(rows)
      }
    })
  }
  /*Purely for dev use - will not be used in after linked to frontend*/
  toDate(date) {
    date = date.toISOString();
    date = date.substr(1, 19);
    date = date.replace('T', ' ');
    return (date);
  }
}
/*Maps Meeting columns for response.send() functionality*/
function mapMeetings(row) {
  return {
    meeting_id: row.meeting_id,
    location_id: row.location_id,
    users: row.users,
    start_date_time: row.start_date_time,
    end_date_time: row.end_date_time,
    meeting_length: row.meeting_length,
    meeting_status: row.meeting_status,
    meeting_title: row.meeting_title,
    meeting_descr: row.meeting_descr,
  };
}
/*Maps user columns for response.send() functionality*/
function mapUsers(row) {
  return {
    u_id: row.u_id,
    email: row.email,
    u_password: row.u_password,
    phone_number: row.phone_number,
    name: row.name,
    type: row.type
  };
}
/*Maps Feedback columns for response.send() functionality*/
function mapFeedback(row) {
  return {
    feedback_Id: row.feedback_Id,
    content: row.content,
    author: row.author,
    date_time_created: row.date_time_created,
    meeting_id: row.meeting_id
  };
}
/*Maps Location columns for response.send() functionality*/
function mapLocation(row) {
  return {
    location_id: row.location_id,
    name: row.name,
    available: row.available
  };
}
/*Maps Position columns for response.send() functionality*/
function mapPosition(row) {
  return {
    position_id: row.position_id,
    title: row.title,
    currentEmployee: row.currentEmployee
  };
}
/*Maps userTypes columns for response.send() functionality*/
function mapTypes(row) {
  return {
    type_id: row.type_id,
    type_descr: row.type_descr
  };
}
function mapDepartment(row) {
  return {
    dept_id: row.dept_id,
    dept_title: row.dept_title,
    dept_short: row.dept_short
  };
}
function mapUser(row) {
  return {
    u_id: row.u_id,
    email: row.email,
    u_password: row.u_password,
    phone_number: row.phone_number,
    name: row.name,
    type: row.type,
    u_position: row.u_position,
    type_desc: row.type_desc
  }
}

var newdriver = new Driver();
exports.newdriver = newdriver;