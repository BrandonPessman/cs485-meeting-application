var MySQL = require('mysql')
const moment = require('moment');
const { response } = require('express');

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
      "INSERT INTO user VALUES (?,?,?,?,?,?)"
    var params = [null, request.body.email, request.body.u_password,request.body.phone_number, request.body.name, request.body.type]
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
  /*Deletes user in 'user' table - cascades to all instances of this user*/
  deleteUser(request, response) {
    var query = 'DELETE FROM user WHERE u_id = ?'
    var params = [request.body.u_id];
    this.connection.query(query, params, (err) => {
      if (err) {console.log(err) }
      else {response.send({status:true})}
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
    var query = 'SELECT type_descr FROM userTypes WHERE type_id = (SELECT type FROM user where u_id = ?)';
    var params = [request.body.u_id];
    return this.connection.query(query, params, (err, rows) => {
      if (err) { console.log(err) }
      else { response.send({ user_type: rows.map(mapTypes) }) };
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
      else { response.send(rows) }
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
  /*Deletes user in meeting using meeting_id & u_id*/
  deleteMeetingUser(request, response){
    const query= "DELETE FROM meetingUser Where meeting_id=?";
    const params=[request.body.meeting_id];
      this.connection.query(query,params,(error, result)=>{
        if(error){
          console.log(error);
        }
        else{
          response.send({status:true})
        }
    })
  }
  /*Adds each user in meeting to meetingCombo table - called by insertMeeting when meeting initialized.*/
  addMeetingUser(user_id,meeting_id) {
    var query = 'INSERT INTO meetingUser VALUES (?,?)'
    const params = [meeting_id,user_id];
    this.connection.query(query, params, function (err, result) {
      if (err) {
        console.log(err);
      }
    })
  }
  /*Insert new Meeting*/
  insertMeeting(request, response) {
    const query = 'INSERT INTO Meeting (meeting_title, meeting_descr, location_id, start_date_time, end_date_time, position_id) VALUES (?,?,?,?,?,?)';
    const params = [request.body.meeting_title, request.body.meeting_descr, request.body.location_id, request.body.start_date_time,
    request.body.end_date_time, request.body.position_id];
    this.connection.query(query, params, (error, result) => {
      if (error) {
        console.log("Error message: " + error.message);
      }
      else {
        var meeting_id = result.insertId;
        var users = request.body.users;
        for (var i = 0; i < users.length; i++) {
          var user_id = parseInt(users[i]);
          this.addMeetingUser(user_id, meeting_id)
        }
        response.send({status:true});
      }
    });
  }
  /*gets meeting from 'Meeting' table using meeting_id*/
  getMeeting(request, response) {
    var query = 'SELECT * FROM Meeting WHERE meeting_id = ?'
    var params = [request.body.meeting_id]
    return this.connection.query(query, params, (err, rows) => {
      if (err) { console.log(err) }
      else {response.send({ meeting: rows.map(mapMeeting) })}
    })
  }
  /*Updates meeting in 'Meeting' table -- need to update*/
  updateMeeting(request,response) {
    var query = 'UPDATE Meeting SET meeting_title = ?, meeting_descr = ?, location_id = ?, start_date_time = ?, end_date_time = ? WHERE meeting_id = ?'
    var params = [request.body.meeting_title, request.body.meeting_descr, request.body.location_id, request.body.start_date_time, request.body.end_date_time, request.body.meeting_id]
    this.connection.query(query, params, (err, result)=> {
      if (err) {console.log(err)}
      else{response.send({status:true})}
    })
  }
  /*Deletes all meeting/feedback relationships via meeting_id or feedback_id*/
  deleteMeetingFeedback(request) {
    if (request.body.meeting_id>0) {
      var query = 'DELETE FROM feedbackCombo WHERE meeting_id = ?'
      var params = [request.body.meeting_id]
      this.connection.query(query, params, (err,result) => {
        if (err) {console.log(err)}
        else{console.log({status:true})}
      })
    }
    else {
      var query = 'DELETE FROM feedbackCombo WHERE feedback_id = ?'
      var params = [request.body.feedback_id]
      this.connection.query(query, params, (err,result) => {
        if (err) {console.log(err)}
        else{console.log({status:true})}
      })
    }
  }
  /*Deletes all meeting/position relationships via meeting_id or position_id*/
  deleteMeetingPosition(request,response) {
    if (request.body.meeting_id >0) {
      var query = 'DELETE FROM meetingPositions WHERE meeting_id = ?'
      var params = [request.body.meeting_id]
      this.connection.query(query, params, (err,result) => {
        if (err) {console.log(err)}
        else{console.log({status:true})}
      })
    }
    else {
      var query = 'DELETE FROM meetingPositions WHERE position_id = ?'
      var params = [request.body.position_id]
      this.connection.query(query, params, (err,result) => {
        if (err) {console.log(err)}
        else{response.send({status:true})}
      })
    }
  }
  /*Deletes a Meeting entity
  *calls deleteMeetingUser to delete all meeting/User relationships
  *calls deleteMeetingPosition to delete all meeting/Position relationships
  */
  deleteMeeting(request,response) {
    var query = 'DELETE FROM Meeting WHERE meeting_id = ?'
    var params = [request.body.meeting_id]
    this.connection.query(query, params, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        this.deleteMeetingPosition(request);
        this.deleteMeetingFeedback(request);
        this.deleteMeetingUser(request,response);
      }
    })
  }
  /*Insert feedback & meeting into feedbackCombo
    only ever called by insertFeedback*/
  insertFeedbackCombo(request,feedback_id) {
    var query="INSERT INTO feedbackCombo VALUES(?,?,?)";
    var params=[feedback_id,request.body.meeting_id,request.body.author];
    this.connection.query(query,params, function (err, result) {
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
    var params = [request.body.content, request.body.author, now, request.body.meeting_id];
    this.connection.query(query, params, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        var feedback_id = result.insertId;
        response.send({ status: true, feedback_Id: feedback_id, });
        this.insertFeedbackCombo(request,feedback_id);
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
        response.send({feedback: rows.map(mapFeedback)})
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
        response.json({feedback: rows.map(mapFeedback)})
      }
    })
  }
  deleteFeedback(request,response) {
    var query = 'DELETE FROM Feedback WHERE feedback_Id = ?'
    var params = [request.body.feedback_id]
    this.connection.query(query, params, (err) => {
      if (err) {
        console.log(err)
      } else {
        response.send({status:true})
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
        response.send({status:true})
      }
    })
  }
 /* insert Candidate to the Candidate table */
insertCandidate (Candidate_id, id, users, meeting_id) {
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
    for (var i = 0; i<users.length; i++) {
      var user_id = parseInt(users[i]);
      this.meetingCombo(user_id, id);
    }
  }
  /* Get the candidate from the Candidate Table */
  getCandidate(Candidate_id) {
    var query = 'SELECT * FROM Candidate WHERE Candidate_id = ' + Candidate_id
    return this.connection.query(query, function (err, results) {
      if (err) throw err;
      console.log(results)
    })
  }
  /* Get all the candidates from the table */
  getAllCandidate(){
    var query = 'SELECT * FROM Candidate'
    return this.connection.query(query, (err, rows)=> {
      if (err){
        console.log(err)
      }
      response.send({
        candidate:rows.map(mapCandidate)
      })
    })
  }

 /* Upadate the candidate information in the "Candidate" table */
  updateCandidate({Candidate_id, id, users, meeting_id}){
    var currentCandidate = getCandidate(Candidate_id)
    var update = [Candidate_id, users, meeting_id]
    var origin = ['Candidate_id', 'users', 'meeting_id']
    for (var i = 0; i<update.length; i++) {
      if (currentCandidate.original[i] === update[i]) {
        var query = 'UPDATE Candidate SET ' + origin[i] + ' = ' + update[i] + 'WHERE Candidate_id = ' + Candidate_id
        return this.connection.query(query, function (err, results) {
        if (err) throw err
        console.log(results)
        })
      }
    }
  }

  /**Inserts given position object into EmployeePosition table. Calls insertDepartmentPosition (above) to 
   * add dept_id/position_id combination to departmentPosition table. */
  insertPositions(request, response) {
    var query = 'INSERT INTO EmployeePosition (position_id, position_title, currentEmployee, department_id) VALUES (?, ?, ?, ?)'
    var params = [request.body.position_id, request.body.position_title, request.body.currentEmployee, request.body.department_id]
     this.connection.query(query, params, (err, result) => {
      if (err) {
        console.log(err)
      } else{
        response.send({status:true})
      }
    })
    this.insertDepartmentPosition(request)
  }
  /*Deletes department/position relationship using department_id or position_id*/
  deleteDepartmentPosition(request,response) {
    if (request.body.position_id>0) {
    var query = 'DELETE FROM departmentPosition WHERE position_id = ?'
    var params = [request.body.position_id]
    this.connection.query(query, params, (err) => {
      if (err) {console.log(err)}
    })
  }
  else {
    var query = 'DELETE FROM departmentPosition WHERE department_id = ?'
    var params = [request.body.department_id]
    this.connection.query(query, params, (err) => {
      if (err) {console.log(err)}
    })
  }
}
  /**Delete position from EmployeePosition - calls deleteDepartmentPosition
   * to remove unique combination of position_id/dept_id from table departmentPosition
   */
  deletePosition(request, response) {
    var query = 'DELETE FROM EmployeePosition WHERE position_id = ?'
    var params = [request.body.position_id]
    this.connection.query(query, params, (err, result) => {
      if (err) {console.log(err) }
      else {
        this.deleteDepartmentPosition(request,response);
        this.deleteMeetingPosition(request,response);
      }
    })
  }
  /*Returns all positions from 'EmployeePosition' table*/
  getPositions(response) {
    var query = 'SELECT EmployeePosition.position_id, EmployeePosition.position_title, ' +
      'EmployeePosition.currentEmployee, EmployeePosition.department_id, EmployeePosition.vacant, ' +
      'Count(EmployeePosition.position_id) as meeting_count FROM EmployeePosition LEFT JOIN meetingPositions ' +
      'ON EmployeePosition.position_id = meetingPositions.position_id group by position_id';
    this.connection.query(query, (err, rows) => {
      if (err) {
        console.log(err)
      }
      else {
        response.send({ meeting: rows.map(mapPosition) });
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
        response.send({location: rows.map(mapLocation)});
      }
    })
  }
  deleteLocation(request, response) {
    var query = 'DELETE FROM Location WHERE location_id = ?'
    var params = [request.body.location_id]
    this.connection.query(query, params, (err) => {
      if (err) {console.log(err)}
      else{response.send({status:true})}
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
        response.json({type: rows.map(mapTypes)});
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
        response.json({department: rows.map(mapDepartment)});
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
        response.json({status:true})
      }
    })
  }
  /**Deletes department from Department table. 
   * Calls deleteDepartmentPositions to delete all existing positions under the department
   */
  deleteDepartment(request, response) {
    var query = "DELETE FROM Department where dept_id = ?"
    var params = [request.body.dept_id]
    this.connection.query(query, params, (err, results) => {
      if (err) {console.log(err)}
      else{response.send({status:true})}
    })
    deleteDepartmentPositions(request);
  }
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
    position_title: row.title,
    currentEmployee: row.currentEmployee,
    department_id: row.department_id,
    vacant: row.vacant,
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
function mapDepartment(row) {
  return {
    dept_id: row.dept_id,
    dept_title: row.dept_title,
    dept_short: row.dept_short,
    openPosition: row.openPosition
  };
}

function mapCandidate(row) {
  return{
    Candidate_id : row.Candidate_id,
    meeting_id : row.meeting_id
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