var express = require('express');
var bodyParser=require('body-parser');
var app = express();
var cors = require('cors');
const driver = require("./Driver.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const port = 3443;
app.listen(port, () => {
    console.log(`Live on port ${port}`);
});
//test success
app.get('/type', (request, response) => {
    driver.newdriver.getUserType(request, response);
});
//test success
app.get('/meetings', (request,response) => {
    driver.newdriver.getAllMeetings(response);
});
//test success
app.get('/users', (request, response) => {
    driver.newdriver.getAllUsers(response);
});
//test success
//use e-mail and password to login
app.get('/users/:email/:u_password', (request, response) => {
    driver.newdriver.getUser(request,response);
})
//test success
app.get('/positions', (request, response) => {
    driver.newdriver.getPositions(response);
})
app.get('/locations', (request,response) => {
    driver.newdriver.getLocations(response)
})
app.get('/meetingFeedback', (request, response) => {
    driver.newdriver.getMeetingFeedback(request, response);
})
app.get('/meetingUsers', (request, response) => {
    driver.newdriver.getMeetingUsers(request, response);
})
app.get('/department', (request, response) => {
    driver.newdriver.getDepartments(request, response);
})
//need fix
app.post('/insertMeeting', (request, response) => {
    driver.newdriver.insertMeeting(request, response);
});

app.put('/user', (request, response) => {
    driver.newdirver.updateUser(request, response);
})