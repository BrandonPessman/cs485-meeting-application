import React, { useState } from "react";
import "./SecondaryNavigation.css";
import MeetingScheduler from "./Tabs/MeetingScheduler";
import UpcomingMeetings from "./Tabs/UpcomingMeetings";
import PastMeetings from "./Tabs/PastMeetings";
import Users from "./Tabs/Users";

export default function SecondaryNavigation({user}) {
  const [tab, setTab] = useState(user.type == 1 ? 0 : 1);

  return (
    <>
      <ul
        className="navigation"
        style={{
          backgroundColor: "white",
          boxShadow: "0 4px 16px rgba(0,0,0,.1)",
          padding: "0px 200px",
        }}
      >
        <h2
          style={{
            marginBottom: "0",
            fontWeight: "300",
            padding: "10px 0",
            width: "100%",
          }}
        >
          Scheduling Center{" "}
          <span
            style={{
              float: "right",
              color: "rgb(100,100,100)",
              fontWeight: "200",
              fontSize: "14px",
              color: "rgb(27, 14, 83)",
              fontWeight: "600",
            }}
          >
            <span style={{ fontWeight: "100" }}>Welcome,</span> {user.name}
          </span>
        </h2>
 
        {user.type == 1 ? <>
          <li
          className={
            tab === 0 ? "secondary-li secondary-li-active" : "secondary-li"
          }
        >
          <a onClick={() => setTab(0)}>
            Management
          </a>
        </li>
        </>
        :
        ''
        }
       
        <li
          className={
            tab === 1 ? "secondary-li secondary-li-active" : "secondary-li"
          }
        >
          <a onClick={() => setTab(1)}>
            Upcoming Meetings
          </a>
        </li>
        <li
          className={
            tab === 2 ? "secondary-li secondary-li-active" : "secondary-li"
          }
        >
          <a onClick={() => setTab(2)}>
            Past Meetings
          </a>
        </li>

        {user.type == 1 ? <>
          <li
          className={
            tab === 3 ? "secondary-li secondary-li-active" : "secondary-li"
          }
        >
          <a onClick={() => setTab(3)}>
            Users
          </a>
        </li>
        </>
        :
        ''
        }

      </ul>

      <div style={{ padding: "10px 200px" }}>
        {tab === 0 ? <MeetingScheduler /> : ""}
        {tab === 1 ? <UpcomingMeetings user={user} /> : ""}
        {tab === 2 ? <PastMeetings user={user} /> : ""}
        {tab === 3 ? <Users /> : ""}
      </div>
    </>
  );
}
