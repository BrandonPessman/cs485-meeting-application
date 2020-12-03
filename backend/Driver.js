var MySQL = require('mysql')
const moment = require('moment');
const { response } = require('express');
var flstr = require('fs');
var nodemailer = require('nodemailer');

//These 4 items below are use for the insertFile method
/*var storage = require('storage');
const CONNECTION_STRING = "CONNECTION_STRING";
const BlobContainer = "CONTAINER";
const BlobName = "Blob";
*/

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
  /*Sends email*/
  sendEmail(request,response) {
    let emailTransporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port:465,
      secure:true,
      auth: {
        user:"cs485interviewer@gmail.com",
        pass:"485Password",
      },
    });
    let email = emailTransporter.sendMail({ 
      from: "cs485interviewer@gmail.com",
      name: "Interviewer",
      to: request.params.to,
      subject: request.params.subject,
      text: request.params.text,
      html: request.params.html
    });
    console.log(email.messageId);
    console.log(nodemailer.getTestMessageUrl(email));
  }
  /*Inserts user to 'user' table*/
  insertUser(request, response) {
    var query =
      "INSERT INTO user (email, u_password, phone_number, name, type) VALUES (?,?,?,?,?)"
    var params = [request.body.email, request.body.u_password, request.body.phone_number, request.body.name, request.body.type]
    var temp = this.connection.query(query, params, (err, result) => {
      if (err) { console.log(err) }
      else { response.send({ status: true, sql: temp.sql }); }
    });
  }
  /*Updates user in 'user' table - need to change to make frontend-friendly*/
  updateUser(request, response) {
    var query = 'UPDATE user SET u_password=?, phone_number=?, name=?, type=? WHERE u_id = ?';
    var params = [request.body.u_password, request.body.phone_number, request.body.name, request.body.type, request.body.u_id];
    var temp = this.connection.query(query, params, (err) => {
      if (err) { console.log(err) }
      else { response.send({ status: true, sql: temp.sql }); }
    });
  }
  /*Deletes user in 'user' table - cascades to all instances of this user*/
  deleteUser(request,response) {
    var query = 'DELETE FROM user WHERE u_id = ?'
    var params = [request.params.u_id];
    this.connection.query(query, params, (err) => {
      if (err) { console.log(err) }
      else { 
        response.send({ status: true });
        this.deleteUserFromMeeting({u_id:request.params.u_id});
      }
    });
  }
  deleteUserFromMeeting(request) {
    var query = 'DELETE FROM meetingUser WHERE u_id = ?'
    var params = [request.u_id];
    this.connection.query(query, params, (err, result) => {
      if (err) { console.log(err) }
      else {console.log({status:true})}
    });
  }
  /*Check user availability*/
  getUserAvailability(request, response) {
    var query = 'select m.meeting_title from Meeting m LEFT JOIN meetingUser mu on mu.meeting_id = m.meeting_id WHERE mu.u_id = ? and ' +
      '((start_date_time<=? AND start_date_time>=?)' +
      ' OR (end_date_time<=? AND end_date_time<=?)' +
      'OR (start_date_time>=? AND end_date_time <=?))'
    var params = [request.params.u_id, request.params.end_date_time, request.params.start_date_time, request.params.start_date_time, request.params.end_date_time, request.params.start_date_time, request.params.end_date_time]
    var temp = this.connection.query(query, params, (err, rows) => {
      if (err) {
        console.log(err)
      } else {
        console.log(rows);
        if (rows.length > 0) {
          response.send({ Meeting: rows.map(mapMeeting), userAvailability: false, sql: temp.sql });
        }
        else {
          response.send({ userAvailability: true, sql: temp.sql });
        }
      }
    })
  }
  /*gets user from 'user' table using email and u_password col*/
  getUser(request, response) {
    var query = 'SELECT * FROM user LEFT JOIN userTypes ON user.type = userTypes.type_id WHERE email = ? and u_password=?';
    const params = [request.params.email, request.params.u_password];
    this.connection.query(query, params, (err, rows) => {
      if (err) { console.log(err) }
      else { response.send({ user: rows.map(mapUser) }); }
    })
  }
  /*gets users by type =2, all candidates*/
  getCandidates(request, response) {
    var query = 'SELECT u.u_id,u.name, u.email, u.phone_number, u.u_password, count(mu.u_id) as meeting_count, u.type, ut.type_descr FROM user u LEFT JOIN meetingUser mu on mu.u_id = u.u_id LEFT JOIN userTypes ut on ut.type_id = u.type LEFT JOIN Meeting m on m.meeting_id = mu.meeting_id where u.type = 2 group by u.u_id'
    this.connection.query(query, (err, rows) => {
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
  getUserPosition(request, response) {
    const query = "SELECT * FROM EmployeePosition LEFT JOIN userPosition ON EmployeePosition.position_id = userPosition.position_id WHERE u_id = ?";
    const params = [request.body.u_id];
    this.connection.query(query, params, (error, rows) => {
      if (error) {
        console.log(error);
      }
      else {
        response.send({ userPosition: rows.map(mapUserPosition) });
      }
    })
  }
  /*Returns string of user type from 'userTypes' table for requested User*/
  getUserType(request, response) {
    var query = 'SELECT type_descr FROM userTypes WHERE type_id = (SELECT type FROM user where u_id = ?)';
    var params = [request.body.u_id];
    return this.connection.query(query, params, (err, rows) => {
      if (err) { console.log(err) }
      else { response.send({ user_type: rows.map(mapTypes) }) };
    })
  }
  /*Gets all users from specific meeting user meeting_id - need to add left join for usertype string*/
  getMeetingUsers(request, response) {
    var query = 'SELECT * FROM user U LEFT JOIN userTypes on U.type=userTypes.type_id WHERE U.u_id in (SELECT u_id FROM meetingUser WHERE meeting_id=?)'
    var params = [request.params.meeting_id]
    this.connection.query(query, params, (err, rows) => {
      if (err) {
        console.log(err)
      }
      else { 
        console.log(rows.map(mapUser));
        response.send({user : rows.map(mapUser)}) }
    })
  }
  getAllMeetingsExtra(response) {
    const query = 'SELECT m.meeting_title, m.meeting_descr, m.meeting_id, m.location_id, m.position_id, m.start_date_time, m.end_date_time, m.meeting_length, l.name, ep.title, l.department_id FROM Meeting m LEFT JOIN Location l on m.location_id = l.location_id LEFT JOIN EmployeePosition ep on m.position_id = ep.position_id group by m.meeting_id'
    this.connection.query(query, (error, rows) => {
      if (error) {
        response.send({ error: error.message });
      }
      else {
        response.send({ meeting: rows.map(mapMLE) });
      }
    })
  }
  getAllMeetings(response) {
    const query = 'SELECT * FROM Meeting';
    this.connection.query(query, (error, rows) => {
      if (error) {
        console.log(error.message);
      }
      else {
        response.send({ meeting: rows.map(mapMeeting) });
      }
    });
  }
  /*Deletes user in meeting using meeting_id*/
  deleteMeetingUser(request) {
    const query = "DELETE FROM meetingUser Where meeting_id= ?";
    const params = [request.meeting_id];
    this.connection.query(query, params, (error, result) => {
      if (error) {
        console.log(error);
      }
      else {
        console.log({ method: 'deleteMeetinguser', status: true })
      }
    })
  }
  /*Deletes user in meeting using u_id*/
  deleteUserMeeting(request,response) {
    const query = "DELETE FROM meetingUser where u_id =? and meeting_id = ?";
    const params = [request.params.u_id, request.params.meeting_id]
    this.connection.query(query, params, (err,result) => {
      if (err) {
        response.send({error: err});
      }
      else{
        response.send({ status:true });
      }
    });
  }
  addUserToMeeting(request,response) {
    var query = 'INSERT INTO meetingUser VALUES (?,?)'
    const params = [request.u_id, request.meeting_id];
    var temp = this.connection.query(query, params, function (err, result) {
      if (err) {
        console.log(err);
      }else{
        console.log({status:true, sql:temp.sql});
      }
    })
  }
  /*Adds each user in meeting to meetingCombo table - called by insertMeeting when meeting initialized.*/
  addMeetingUser(request,response) {
    var query = 'INSERT INTO meetingUser VALUES (?,?)'
    const params = [request.body.u_id, request.body.meeting_id];
    var temp = this.connection.query(query, params, function (err, result) {
      if (err) {
        response.send({error:err});
      }else{
        response.send({status:true, sql: temp.sql});
      }
    })
  }
  /*Insert new Meeting
  meeting_length in minutes*/
  /*Insert new Meeting*/
  insertMeeting(request, response) {
    var start_time = Date.parse(request.body.start_date_time);
    var end_time = Date.parse(request.body.end_date_time);
    var diff = Math.abs((end_time - start_time) / 6000);
    const query = 'INSERT INTO Meeting (meeting_title, meeting_descr, location_id, start_date_time, end_date_time, position_id, meeting_length) VALUES (?,?,?,?,?,?,?)';
    const params = [request.body.meeting_title, request.body.meeting_descr, request.body.location_id, request.body.start_date_time,
    request.body.end_date_time, request.body.position_id, diff];
    var temp = this.connection.query(query, params, (error, result) => {
      if (error) {
        response.send({ error: error.message, sql:temp.sql });
        console.log(error);
      }
      else {
        var meeting_id = result.insertId;
        var users = request.body.users;
        for (var i = 0; i < users.length; i++) {
          var user_id = parseInt(users[i].u_id);
          this.addUserToMeeting(user_id, meeting_id)
        }
        response.send({ status: true, meeting_id: result.insertId });
      }
    });
  }
  //returns meeting status based on current time compared to given start/end_date_time
  getMeetingStatus(request, response) {
    var query = 'SELECT start_date_time, end_date_time FROM Meeting where meeting_id = ?'
    var params = [request.body.meeting_id]
    this.connection.query(query, params, (error, rows) => {
      if (error) {
        console.log(error);
      }
      else {
        var meetings = rows.map(mapMeeting);
        for (var i = 0; i < meetings.length; i++) {
          var meeting = meetings[i];
          var curr_date_time = new Date();
          var status;
          if (curr_date_time < meeting.start_date_time) {
            status = 'Future Meeting';
          }
          else if (curr_date_time > meeting.start_date_time && curr_date_time < meeting.end_date_time)
            status = 'In Progress';
        }
        if (curr_date_time > meeting.end_date_time) {
          status = 'Completed Meeting';
        }
        this.updateMeeting({ meeting_id: request.body.meeting_id, meeting_status: status });
        response.send({ meeting_status: status });
      }
    })
  }
  /*gets meeting from 'Meeting' table using meeting_id*/
  getMeeting(request, response) {
    var query = 'SELECT * FROM Meeting WHERE meeting_id = ?'
    var params = [request.body.meeting_id]
    return this.connection.query(query, params, (err, rows) => {
      if (err) { console.log(err) }
      else {
        response.send({ Meeting: rows.map(mapMeeting) })
      }
    })
  }
  getAllUserMeetings(request, response) {
    var query = 'SELECT m.meeting_id,m.meeting_title, m.meeting_descr, m.location_id, m.start_date_time, m.end_date_time, m.position_id FROM Meeting m LEFT JOIN meetingUser mu on mu.meeting_id = m.meeting_id WHERE mu.u_id = ?'
    var params = [request.params.u_id]
    return this.connection.query(query, params, (err, rows) => {
      if (err) {
        console.log(err)
      }
      else {
        response.send({ meeting: rows.map(mapMeeting) });
      }
    })
  }
  /*Updates meeting in 'Meeting' table -- need to update*/
  updateMeeting(request, response) {
    var query = 'UPDATE Meeting SET meeting_title = ?, meeting_descr = ?, location_id = ?, start_date_time = ?, end_date_time = ? WHERE meeting_id = ?'
    var params = [request.body.meeting_title, request.body.meeting_descr, request.body.location_id, request.body.start_date_time, request.body.end_date_time, request.body.meeting_id]
    var temp = this.connection.query(query, params, (err, result) => {
      if (err) { console.log(err) }
      else { response.send({ status: true, sql:temp.sql }) }
    })
  }
  /*Deletes all meeting/feedback relationships via meeting_id or feedback_id*/
  deleteMeetingFeedback(request) {
    if (request.meeting_id > 0) {
      var query = 'DELETE FROM feedbackCombo WHERE meeting_id = ?'
      var params = [request.meeting_id]``
      this.connection.query(query, params, (err, result) => {
        if (err) { console.log(err) }
        else { console.log({ status: true }) }
      })
    }
    else {
      var query = 'DELETE FROM feedbackCombo WHERE feedback_id = ?'
      var params = [request.feedback_id]
      this.connection.query(query, params, (err, result) => {
        if (err) { console.log(err) }
        else { console.log({ status: true }) }
      })
    }
  }
  /*Deletes a Meeting entity
  *calls deleteMeetingUser to delete all meeting/User relationships
  */
  deleteMeeting(request, response) {
    var query = 'DELETE FROM Meeting WHERE meeting_id = ?'
    var params = [request.params.meeting_id]
    var temp = this.connection.query(query, params, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        this.deleteMeetingFeedback({ meeting_id: request.params.meeting_id })
        this.deleteMeetingUser({ meeting_id: request.params.meeting_id })
        response.send({ status: true, sql: temp.sql });
      }
    })
  }
  /*Insert feedback & meeting into feedbackCombo
    only ever called by insertFeedback*/
  insertFeedbackCombo(request, feedback_id, meeting_id, author) {
    var query = "INSERT INTO feedbackCombo VALUES(?,?,?)";
    var params = [feedback_id, meeting_id, author];
    this.connection.query(query, params, function (err, result) {
      if (err) {
        console.log(err);
      }
    })
  }
  /*Inserts feedback instance into 'Feedback' table*/
  insertFeedback(request, response) {
    let now = moment().format("YYYY-MM-DD HH:mm:ss");
    var query =
      "INSERT INTO Feedback (content, author, date_time_created, meeting_id) VALUES (?, ?, ?, ?)"
    var params = [request.body.data.content, request.body.data.author, now, request.body.data.meeting_id];
    this.connection.query(query, params, (err, result) => {
      if (err) {
        console.log(err);
      } else {
    
        /* NOT SURE WHAT THIS IS FOR SO COMMENTING IT OUT FOR NOW */

        // var feedback_id = result.insertId;
        // response.send({ status: true, feedback_Id: feedback_id, });
        // query="INSERT INTO feedbackCombo (feedback_id, meeting_id, author) VALUES(?,?,?)";
        // params=[feedback_id,request.body.data.meeting_id,request.body.data.author];
        // this.connection.query(query,params, function (err, result) {
        //   if (err) {
        //     console.log(err);
        //   }
        // })
      }
    })
  }
  /*Get all feedback that exist in specific Meeting*/
  getMeetingFeedback(request, response) {
    var query = 'SELECT * FROM Feedback WHERE meeting_id = ?'
    var params = [request.body.meeting_id]
    return this.connection.query(query, params, (err, rows) => {
      if (err) {
        console.log(err)
      } else {
        response.send({ feedback: rows.map(mapFeedback) })
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
        response.json({ feedback: rows.map(mapFeedback) })
      }
    })
  }
  deleteFeedback(request, response) {
    var query = 'DELETE FROM Feedback WHERE feedback_Id = ?'
    var params = [request.body.feedback_id]
    this.connection.query(query, params, (err) => {
      if (err) {
        console.log(err)
      } else {
        response.send({ status: true })
      }
    })
    this.deleteMeetingFeedback(request)
  }
  /**Updates feedback instance in 'Feedback' table - The only thing the user can change is content */
  updateFeedback(request, response) {
    var query = 'UPDATE feedback SET content = ? WHERE feedback_id = ?'

    var params = [request.body.content, request.body.feedback_id]
    return this.connection.query(query, params, (err, result) => {
      if (err) {
        console.log(err)
      } else {
        response.send({ status: true })
      }
    })
  }
  /* insert Candidate to the Candidate table */
  insertCandidate(Candidate_id, id, users, meeting_id) {
    var query =
      "INSERT INTO Candidate (Candidate_id, u_id, users, meeting_id) VALUES (" +
      Candidate_id +
      "," +
      id +
      ", '" +
      users +
      "', '" +
      meeting_id
    "')"
    this.connection.query(query, function (err, results) {
      if (err) throw err;
      console.log(results)
    })
    var users = users.split(",");
    for (var i = 0; i < users.length; i++) {
      var user_id = parseInt(users[i]);
      this.meetingCombo(user_id, id);
    }
  }
  /* Upadate the candidate information in the "Candidate" table */
  updateCandidate({ Candidate_id, id, users, meeting_id }) {
    var currentCandidate = getCandidate(Candidate_id)
    var update = [Candidate_id, users, meeting_id]
    var origin = ['Candidate_id', 'users', 'meeting_id']
    for (var i = 0; i < update.length; i++) {
      if (currentCandidate.original[i] === update[i]) {
        var query = 'UPDATE Candidate SET ' + origin[i] + ' = ' + update[i] + 'WHERE Candidate_id = ' + Candidate_id
        return this.connection.query(query, function (err, results) {
          if (err) throw err
          console.log(results)
        })
      }
    }
  }
  /*Update the position */
  updatePosition(request, response) {
    var query = 'UPDATE EmployeePosition SET title = ?, dept_id = ? WHERE position_id = ?'
    var params = [request.body.title, request.body.dept_id, request.body.position_id]
    var temp = this.connection.query(query, params, (err, result) => {
      if (err) {
        console.log(err)
      }else {
        response.send({status:true, sql:temp.sql})
        this.checkAndUpdate({dept_id: request.body.dept_id, position_id:request.body.position_id});
      }
    })
  }
  /*Check if dept_id changed, and if not, update*/
  checkAndUpdate(request,response) {
    var query = 'SELECT * FROM departmentPosition where dept_id = ? and position_id = ?'
    var params = [request.body.dept_id, reqeust.body.position_id]
    var temp = this.connection.query(query, params, (err, result) => {
      if (err) {
        console.log(err);
      } else{
        console.log(temp.sql);
      }
    })
  }
  /**Inserts given position object into EmployeePosition table. Calls insertDepartmentPosition (above) to 
   * add dept_id/position_id combination to departmentPosition table. */
  insertPosition(request, response) {
    var query = 'INSERT INTO EmployeePosition (title, dept_id) VALUES (?, ?)'
    var params = [request.body.title, request.body.dept_id]
    var dept_id = request.body.dept_id;
    this.connection.query(query, params, (err, result) => {
      if (err) {
        console.log(err)
      } else {
        var myDP = {
          dept_id: dept_id,
          position_id: result.insertId,
        }
        console.log(myDP);
        this.insertDepartmentPosition(myDP);
        response.send({ status: true, id: result.insertId })
      }
    })
  }
  insertDepartmentPosition(request) {
    console.log(request.body);
    var query = 'INSERT INTO departmentPosition VALUES (? ,? )'
    var params = [request.dept_id, request.position_id]
    this.connection.query(query, params, (err, result) => {
      if (err) {
        console.log(err)
      } else {
        console.log({ status: true })
      }
    })
  }
  /*Deletes department/position relationship using department_id or position_id*/
  deleteDepartmentPosition(request) {
    if (request.position_id > 0) {
      var query = 'DELETE FROM departmentPosition WHERE position_id = ?'
      var params = [request.position_id]
      this.connection.query(query, params, (err) => {
        if (err) { console.log(err) }
      })
    }
    else {
      var query = 'DELETE FROM departmentPosition WHERE dept_id = ?'
      var params = [request.department_id]
      this.connection.query(query, params, (err) => {
        if (err) { console.log(err) }
      })
    }
  }
  /**Delete position from EmployeePosition - calls deleteDepartmentPosition
   * to remove unique combination of position_id/dept_id from table departmentPosition
   */
  deletePosition(request, response) {
    var query = 'DELETE FROM EmployeePosition WHERE position_id = ?'
    var params = [request.params.position_id]
    this.connection.query(query, params, (err, result) => {
      if (err) { console.log(err) }
      else {
        this.deleteDepartmentPosition({ position_id: request.params.position_id });
      }
    })
  }
  //Delete position from EmployeePosition
  deletePositionByDept(request) {
    var query = 'DELETE FROM EmployeePosition WHERE dept_id = ?'
    var params = [request.dept_id]
    this.connection.query(query, params, (err, result) => {
      if (err) { console.log(err) }
      else {
        console.log({ status: true })
      }
    })
  }
  /*Returns all positions from 'EmployeePosition' table*/
  getPositions(response) {
    var query = 'SELECT EmployeePosition.position_id, EmployeePosition.title, EmployeePosition.dept_id, ' +
      'Count(Meeting.position_id) as meeting_count, Department.dept_title FROM EmployeePosition ' +
      'LEFT JOIN Meeting ON EmployeePosition.position_id = Meeting.position_id ' +
      'LEFT JOIN Department on Department.dept_id = EmployeePosition.dept_id ' +
      'group by EmployeePosition.position_id'
    this.connection.query(query, (err, rows) => {
      if (err) {
        response.send({error: err});
      }
      else {
        response.send({ position: rows.map(mapPosition) });
      }
    })
  }
  /*Returns a list of locations available at the given time*/
  getAvailableLocations(request, response) {
    var query = 'select * from Location l where l.location_id not in ( select m.location_id from Meeting m where (end_date_time<? and end_date_time>?) or (start_date_time>? and start_date_time<?))'
    var params = [request.params.end_date_time, request.params.start_date_time, request.params.start_date_time, request.params.end_date_time];
    var temp = this.connection.query(query, params, (err, rows) => {
      if (err) { console.log(err) }
      else {
        response.send({ location: rows.map(mapLocation), sql: temp.sql });
      }
    })
  }
  /*Returns all locations from 'Location' table*/
  getLocations(response) {
    var query = 'SELECT * FROM Location';
    this.connection.query(query, (err, rows) => {
      if (err) {
        console.log(err)
      }
      else {
        response.send({ location: rows.map(mapLocation) });
      }
    })
  }
  //Delete location
  deleteLocation(request, response) {
    var query = 'DELETE FROM Location WHERE location_id = ?'
    var params = [request.body.location_id]
    this.connection.query(query, params, (err) => {
      if (err) { console.log(err) }
      else { response.send({ status: true }) }
    })
  }
  /*Returns all user types from 'userType' table*/
  getUserTypes(request, response) {
    var query = 'SELECT * FROM userTypes';
    this.connection.query(query, (err, rows) => {
      if (err) {
        console.log(err)
      }
      else {
        response.send({ type: rows.map(mapTypes) });
      }
    })
  }
  /*Gets all departments from Department table*/
  getDepartments(request, response) {
    var query = "SELECT d.dept_id, d.dept_title, d.dept_short, COUNT(dp.dept_id) as openPositions " +
      "FROM Department d LEFT JOIN departmentPosition dp ON d.dept_id = dp.dept_id group by d.dept_id"
    this.connection.query(query, (err, rows) => {
      if (err) {
        console.log(err)
      }
      else {
        response.json({ department: rows.map(mapDepartment) });
      }
    })
  }
  /**Inserts a new department in Department table */
  insertDepartment(request, response) {
    var query = "INSERT INTO Department (dept_title, dept_short) VALUES (?,?)"
    var params = [request.body.dept_title, request.body.dept_short]
    var temp = this.connection.query(query, params, (err, results) => {
      if (err) {
        console.log(err)
      }
      else {
        response.json({ status: true, sql: temp.sql })
      }
    })
  }
  /**Update department */
  updateDepartment(request,response){
    var query = "UPDATE Department set dept_title = ?, dept_short = ? where dept_id = ?";
    var params = [request.params.dept_title, request.params.dept_short, request.params.dept_id];
    var temp = this.connection.query(query, params, (err, results) => {
      if (err) {
        response.send(err);
      }else{
        response.send({ status: true, sql:temp.sql })
      }
    })
  }
  
   /*
  //Upload single files-convert from a file to binary using blob-This method is not working yet and I was still trying to figure out how these code work.
  insertFile(request, response){
    //create container
    var blobService = storage.createBlobService(CONNECTION_STRING);
    blobService.createContainerIfNotExists(BlobContainer, function (error) {
      if (error) {
         console.log("error creating container");
      }
   });
   //create block Blob Local File
   blobService.createBlockBlobFromBrowserFile(BlobContainer, BlobName, function (error, result, response) {
    if (error) {
       alert('Upload failed');
       console.log(error);
    } else {
       setTimeout(function () { // This prevent alert from stopping the UI progress update
          alert('Upload successfully!');
       }, 50);
    }
 });
 //These are from a website and I was trying to play around with the code to see what it does for the uploading file part.
 const [file, setFile] = useState(''); // storing the uploaded file 
 const [data, getFile] = useState({ name: "", path: "" });//// storing the recived file from backend
 const [progress, setProgess] = useState(0); // progess bar
 const el = useRef(); // accesing input element
 const handleChange = (e) => {
     setProgess(0)
     const file = e.target.files[0]; // accesing file
     console.log(file);
     setFile(file); // storing file
 }
    const path = req.file.path;
    const query= "INSERT INTO uploadFile (u_id) VALUES (?,?,?)";
    const params=[request.body.u_id];
    this.connection.query(query, params, (error, rows)=>{
      if(error){
        console.log(error);
      }
      else{
        response.send({ uploadFile: rows.map(mapuploadFile) });
    }
    })
  }
  */
  
  /**Deletes department from Department table. 
   * Calls deleteDepartmentPositions to delete all existing positions under the department
   */
  deleteDepartment(request, response) {
    var query = "DELETE FROM Department where dept_id = ?"
    var params = [request.params.dept_id]
    this.connection.query(query, params, (err, results) => {
      if (err) { console.log(err) }
      else { response.send({ status: true }) }
    })
    this.deleteDepartmentPosition({ dept_id: request.params.dept_id })
    this.deletePositionByDept({ dept_id: request.params.dept_id })
  }
}
/*Maps meeting,location&position information*/
function mapMLE(row) {
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
    location_id: row.location_id,
    name: row.name,
    available: row.available,
    position_id: row.position_id,
    title: row.title,
    currentEmployee: row.currentEmployee,
    deptid: row.department_id,
    vacant: row.vacant,
    meeting_count: row.meeting_count,
  };
}
/*Maps Meeting columns for response.send() functionality*/
function mapMeeting(row) {
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
    position_id: row.position_id,
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
    currentEmployee: row.currentEmployee,
    deptid: row.department_id,
    vacant: row.vacant,
    dept_title: row.dept_title,
    meeting_count: row.meeting_count,
  };
}
/*Maps userTypes columns for response.send() functionality*/
function mapTypes(row) {
  return {
    type_id: row.type_id,
    type_descr: row.type_descr
  };
}
/*Maps department columns for response.send() functionality*/
function mapDepartment(row) {
  return {
    dept_id: row.dept_id,
    dept_title: row.dept_title,
    dept_short: row.dept_short,
    openPositions: row.openPositions
  };
}
/*Maps candidate columns for response.send() functionality*/
function mapCandidate(row) {
  return {
    Candidate_id: row.Candidate_id,
    meeting_id: row.meeting_id
  };
}
/*Maps user columns for response.send() functionality*/
function mapUser(row) {
  return {
    u_id: row.u_id,
    email: row.email,
    password: row.u_password,
    phone_number: row.phone_number,
    name: row.name,
    type: row.type,
    u_position: row.u_position,
    type_descr: row.type_descr,
    meeting_count: row.meeting_count
  }
}
/*Maps user position columns for response.send() functionality*/
function mapUserPosition(row) {
  return {
    u_id: row.u_id,
    position_id: row.position_id,
    position_title: row.position_title,
    department_id: row.department_id
  }
}

var newdriver = new Driver();
exports.newdriver = newdriver;
