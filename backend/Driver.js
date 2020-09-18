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
      "INSERT INTO user (u_id, email, u_password, phone_number, name, type) VALUES ('" +
      id +
      "','" +
      email +
      "','" +
      password +
      "','" +
      phone +
      "','" +
      name +
      "','" +
      type +
      "')"
    return this.connection.query(query, function (err, results) {
      if (err) throw err
      console.log(results)
    })
  }
  insertMeeting (meeting) {
    var query =
      'INSERT INTO Meeting (meeting_id, location_id, users, start_date_time, end_date_time, meeting_length, meeting_status) VALUES (' +
      meeting.id +
      ',' +
      meeting.location_id +
      ',' +
      meeting.users +
      ',' +
      meeting.start_date_time +
      ',' +
      meeting.end_date_time +
      ')'
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
  constructor (id, location_id, users, start_date_time, end_date_time) {
    this.id = id
    this.location_id = location_id
    this.users = users
    this.start_date_time = start_date_time
    this.end_date_time = end_date_time
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
fakeUser = {
  id: '3',
  email: 'firstUser@gmail.com',
  password: '12345',
  phone: '555-5555',
  name: 'Axel Rose',
  type: '1'
}
newdriver.insertUser(fakeUser)
newdriver.quit()
