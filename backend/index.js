var express = require('express');
var app = express();
var cors = require('cors');
const driver = require("./driver.js");

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

app.post('/insertMeeting',(request,response)=>{
    driver.newdriver.insertMeeting(request, response);
});

app.get('/users', (request, response) => {
    driver.newdriver.getAllUsers(response);
});
app.get('/users:u_id', (request, response) => {
    const u_id = request.params.u_id;
    response.send(driver.newdriver.getUser(u_id));
})
app.put('/users:u_id, u_password, phone_number, name, type', (request,response) => {
    const u_id = request.params.u_id;
    const u_password = request.params.u_password;
    const phone_number = request.params.phone_number;
    const name = request.params.name;
    const type = request.params.type;
    response.send(driver.newdriver.updateUser(u_id, u_password, phone_number, name, type));
})
app.get('/positions', (request, response) => {
    driver.newdriver.getPositions(request, response);
})
app.get('/locations', (request, response) => {
    response.send(driver.newdriver.getLocations());
})
app.get('/feedback:meeting_id', (request, response) => {
    const meeting_id = request.params.meeting_id;
    response.send(driver.newdriver.getFeedbackMeeting(meeting_id));
})
app.get('/user:meeting_id', (request, response) => {
    const meeting_id = request.params.meeting_id;
    response.send(driver.newdriver.getMeeetingUsers);
})
app.get('/department', (request, response) => {
    driver.newdriver.getDepartments(request, response);
})

app.get('/')