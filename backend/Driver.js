'user strict'
var MySQL = require('mysql')
const moment = require('moment');

//test test-tong
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
  getMinutes = function(x,y){
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
    var query = 'SELECT * FROM user'
    return this.connection.query(query, function (err, results) {
      if (err) throw err;
      console.log(results)
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
      "', " +
      start_time +
      "," +
      end_time +
      ")"
      return this.connection.query(query, function (err, results) {
        if (err) throw err;
        console.log(results)
      })
  }
  getMeeting(id) {
    var query = 'SELECT * FROM Meeting WHERE meeting_id = ' + id
    return this.connection.query(query, function (err, results) {
      if (err) throw err;
      console.log(results)
    })
  }
  updateMeeting(id, location, users, start_time, end_time) {
    var length = getMinutes(start_time, end_time);
    var currentMeeting = this.getMeeting(id)
    var list = [location, users, start_time, end_time]
    var objectList = ['location_id', 'users', 'start_time', 'end_time']
    for (var i = 0; i<list.length; i++) {
      if (currentMeeting.objectList[i] != list[i]) {
        if (list[i] == start_time || list[i] == end_time) {
          this.connection.query("UPDATE SET meeting_length = " + length + " WHERE meeting_id = " + id, function (err, results) {
            if (err) throw err;
            console.log(results)
          })
        }
        this.connection.query("UPDATE SET " + currentMeeting.objectList[i] + ' = ' + list[i] + ' WHERE meeting_id = ' + id, function (err, results) {
          if (err) throw err;
          console.log(results)
        })
      }
    }

  }
  insertFeedback (id, content, author, meeting_id) {
    let now = moment().format("YYYY-MM-DD HH:mm:ss");
    var query =
      "INSERT INTO Feedback (feedback_Id, content, author, date_time_created, meeting_id) VALUES (" +
      id +
      ", '" +
      content +
      "'," +
      author +
      ", '" +
      now +
      "'," +
      meeting_id +
      ")"
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
    return this.connection.query(query, function (err, results) {
      if (err) throw err
      console.log(results)
    })
  }
  /**The only thing the user can change is content */
  updateFeedback(id, content) {
    var query = 
    'UPDATE SET content = ' + content + 'WHERE feedback_id = ' + id
    return this.connection.query(query, function (err, results) {
      if (err) throw err;
      console.log(results);
    })
  }

}
class User {
  constructor (id, email, password, phone, name, type) {
    this.id = id
    this.email = email
    this.password = password
    this.phone = phone
    this.name = name
    this.type = type
  }
}
class Meeting {
  constructor (id, location_id, users, start_date_time, end_date_time, meeting_length) {
    this.id = id
    this.location_id = location_id
    this.users = users
    this.start_date_time = start_date_time
    this.end_date_time = end_date_time
    this.meeting_length = meeting_length;
  }
}
class Feedback {
  constructor (id, content, author, date_time_created, meeting_id) {
    this.id = id
    this.content = content
    this.author = author
    this.date_time_created = date_time_created
  }
}
class EmployeePosition {
  constructor (id, title, currentEmployee) {
    this.id = id
    this.title = title
    this.currentEmployee = currentEmployee
  }
}
class Location {
  constructor (id, name) {
    this.id = id
    this.name = name
  }
}
var newdriver = new Driver()
newdriver.getUser(1)
newdriver.insertFeedback(1,"Initial Feedback", 1, 1)
newdriver.getAllFeedback()
newdriver.getFeedbackMeeting(1)
newdriver.quit()
