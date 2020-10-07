var express = require('express');
var app = express();
var cors = require('cors');
const driver = require("./Driver.js");

app.use(cors());

const port = 3443;
app.listen(port, () => {
    console.log(`Live on port ${port}`);
});
app.get('/types', (request, response) => {
    driver.newdriver.getUserTypes(request, response);
});
app.get('/meetings', (request, response) => {
    driver.newdriver.getAllMeetings(request, response);
});
app.get('/users', (request, response) => {
    driver.newdriver.getAllUsers(response);
});
//use e-mail and password to login
app.get('/users/:email/:u_password', (request, response) => {
    driver.newdriver.getUser(request, response);
})
app.get('/positions', (request, response) => {
    driver.newdriver.getPositions(request, response);
})
app.get('/locations', (request, response) => {
    driver.newdriver.getLocations(request, response)
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

app.get('/')


app.post('/insertMeeting', (request, response) => {
    driver.newdriver.insertMeeting(request, response);
});

app.post('/user', (request, response) => {
    driver.newdirver.updateUser(request, response);
});
app.post('/addMeetingUser', (request, response) => {
    driver.newdriver.addMeetingUser(request, response);
});
app.post('/updateMeeting', (request, response) => {
    driver.newdriver.updateMeeting(request,response);
});
app.post('/deleteUserAccount', (request, response) => {
    driver.newdriver.deleteAccount(request,response);
});
app.post('/deleteMeeting', (request,response) => {
    driver.newdriver.deleteMeeting(request,response);
});
app.post('/insertPosition', (request, response) => {
    driver.newdriver.insertPositions(request,response);
});
app.post('/insertDepartment', (request, response) => {
    driver.newdriver.insertDepartment(request, response);
});