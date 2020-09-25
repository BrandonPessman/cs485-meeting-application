var express=require('express');
var app=express();
var cors=require('cors');
const driver = require("./driver.js"); 

app.use(cors());

const port=3443;
app.listen(port,()=>{
   console.log(`Live on port ${port}`);
});

app.get('/meetings',(request, response) =>{
    driver.newdriver.getAllMeetings(request, response);
});