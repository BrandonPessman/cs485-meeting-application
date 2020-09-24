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
  updateUser({id, password, phone, name, type}){
    var query = 'UPDATE SET password = ' + password + ', phone = ' + phone + ', name = ' + name + ', type = ' + type + 'WHERE u_id = ' + id
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
      var resultObj = JSON.parse(JSON.stringify(results));
    })
  }
  getAllUsers() {
    var query = 'SELECT * FROM user'
    this.connection.query(query, function (err, results) {
      if (err) throw err;
      console.log(JSON.parse(JSON.stringify(results)));
      var resultObj = JSON.parse(JSON.stringify(results))
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
  updateMeeting(id, location, users, start_time, end_time) {
    var length = getMinutes(start_time, end_time);
    var currentUser = this.getUser(id)
    var list = [location, users, start_time, end_time]
    var objectList = [location_id, users, start_time, end_time]
    for (var i = 0; i<list.length; i++) {
      if (currentUser.objectList[i] != list[i]) {
        if (list[i] == start_time || list[i] == end_time) {
          this.connection.query("UPDATE SET meeting_length = " + length + " WHERE meeting_id = " + id), function (err, results)) {
            if (err) throw err;
            console.log(results)
          }}
        this.connection.query("UPDATE SET " + currentUser.currentValue + ' = ' + objectList[i] + ' WHERE meeting_id = ' + id, function (err, results) {
          if (err) throw err;
          console.log(results)
        })
      }
    }

  }
  insertFeedback (id, content, author, date_time_created) {
    var query =
      'INSERT INTO Feedback (feedback_Id, content, author, date_time_created) VALUES (' +
      id +
      ',' +
      content +
      ',' +
      author +
      ',' +
      date_time_created +
      ')'
      return this.connection.query(query, function (err, results) {
        if (err) throw err;
        console.log(results)
      })
  }
  updateFeedback(id, content) {
    var query = 
    'UPDATE SET content = ' + content + 'WHERE feedback_id = ' + id
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
