#### Database Tables and Columns
- Users

{
  id: "1"
  name: "Test Test",
  email: "test@test.com,
  password: "123"
}

- Meetings

{
  id: "1",
  title: "Meeting",
  description: "This is a meeting",
  date: "10/10/2020",
  starttime: "10:30",
  endtime: "11:30"
}

- Jobs

{
  id: "1",
  jobtitle: "Professor of Computer Science",
}

- Locations

{
  id: "1",
  building: "Phillips",
  roomnumber: "115"
}

#### Linking Tables
- Feedbacks

{
  meetingId: "1",
  userId: "1"
  content: "This was a great professor"
}
