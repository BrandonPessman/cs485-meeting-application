'user strict'
var MySQL = require('mysql')

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
  quit () {
    this.connection.end()
  }
  insertUser ({ id, email, password, phone, name, type }) {
    var query =
      "INSERT INTO user (u_id, email, u_password, phone_number, name, type) VALUES (" +
      id +
      "," +
      email +
      "," +
      password +
      "," +
      phone +
      "," +
      name +
      "," +
      type +
      ")"
    return this.connection.query(query, function (err, results) {
      if (err) throw err
      console.log(results)
    })
  }
  updateUser({id, list}){
    var start = "UPDATE user ";
    var rest;
    if (list.length>2) {
      for (var j = 0; j<list.length-4; j++) {
        rest = rest + list[j] + "=" + list[j+1] + ","
      }
      rest = rest + list[list.length-2] + "=" + list[j-1]
    }
    var query = start+rest;
    return this.connection.query(query, function (err, results) {
      if (err) throw err
      console.log(results)
    })
  }
  getUser(id) {
    var query = 'SELECT * FROM user WHERE u_id = ' + id
    this.connection.query(query, function (err, results) {
      if (err) throw err;
      console.log(JSON.parse(JSON.stringify(results)));
      var jsObj = JSON.parse(JSON.stringify(results));
    })
  }
  insertMeeting (id, location, users, start_time, end_time) {
    var length = getMinutes(start_time, end_time);
    var query =
      'INSERT INTO Meeting (meeting_id, location_id, users, start_date_time, end_date_time, meeting_length) VALUES (' +
      id +
      ',' +
      location +
      ',' +
      users +
      ',' +
      start_time +
      ',' +
      end_time +
      ',' +
      length
      ')'
      return this.connection.query(query, function (err, results) {
        if (err) throw err;
        console.log(results)
      })
  }
  insertFeedback (feedback) {
    var query =
      'INSERT INTO Feedback (feedback_Id, content, author, date_time_created) VALUES (' +
      feedback.id +
      ',' +
      feedback.content +
      ',' +
      feedback.author +
      ',' +
      feedback.date_time_created +
      ')'
      return this.connection.query(query, function (err, results) {
        if (err) throw err;
        console.log(results)
      })
  }
  updateFeedback(id, new_content) {
    var d = new Date();
    var query = 'UPDATE Feedback SET content = ' + new_content + ', date_time_created = ' + d + 'WHERE id = ' + id;
    return this.connection.query(query, function (err, results) {
      if (err) throw err;
      console.log(results);
    })
  }
  getMinutes(x,y){
    var diff = y-x;
    var sec = (1000*60);
    var mins = diff/sec;
    return mins;
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
  constructor (id, content, author, date_time_created) {
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
newdriver.quit()
