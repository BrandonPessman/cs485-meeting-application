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

app.get('/type', (request, response) => {
    driver.newdriver.getUserType(request, response);
});
app.get('/meetings', (request,response) => {
    driver.newdriver.getAllMeetings(response);
});
app.get('/users', (request, response) => {
    driver.newdriver.getAllUsers(response);
});
//new
app.get('/userPositions', (request,response) => {
    driver.newdriver.getUserPosition(request,response);
});
//use e-mail and password to login
app.get('/users/:email/:u_password', (request, response) => {
    driver.newdriver.getUser(request,response);
});
app.get('/positions', (request, response) => {
    driver.newdriver.getPositions(response);
})
//new
app.get('/availableLocations', (request,response) => {
    driver.newdriver.getAvailableLocations(request,response)
});
app.get('/locations', (request,response) => {
    driver.newdriver.getLocations(response)
});
app.get('/meetingFeedback', (request, response) => {
    driver.newdriver.getMeetingFeedback(request, response);
});
app.get('/department', (request, response) => {
    driver.newdriver.getDepartments(request, response);
});

app.get('/usersMeeting', (request, response) => {
    driver.newdriver.getMeetingUsers(request, response)
})

app.post('/insertMeeting', (request, response) => {
    driver.newdriver.insertMeeting(request, response)
});
app.post('/insertUser',(request, response)=>{
    driver.newdriver.insertUser(request, response);
});
app.post('/insertFeedback',(request, response)=>{
    driver.newdriver.insertFeedback(request, response);
});

app.patch('/user', (request, response) => {
    driver.newdriver.updateUser(request, response);
});
app.patch('/updateMeeting', (request,response) => {
    driver.newdriver.updateMeeting(request,response);
});
app.patch('/updateUser', (request,response) => {
    driver.newdriver.updateUser(request,response);
});


app.delete('/deletePosition', (request,response) => {
    driver.newdriver.deletePosition(request, response)
});
app.delete('/deleteUser', (request, response) => {
    driver.newdriver.deleteUser(request,response);
});
app.delete('/deleteMeeting', (request,response) => {
    driver.newdriver.deleteMeeting(request,response);
});