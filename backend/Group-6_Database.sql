-- CREATE DATABASE InterviewTracker;
USE InterviewTracker; 
-- call sp_archivev3();

DROP TABLE IF EXISTS user_box;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS box;
DROP TABLE IF EXISTS Meeting;
DROP TABLE IF EXISTS Feedback;
DROP TABLE IF EXISTS EmployeePosition;
DROP TABLE IF EXISTS Location;

CREATE TABLE user(
	u_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	email VARCHAR(100),
	u_password VARCHAR(20),
	phone_number VARCHAR(20),
	name VARCHAR(100),
	type INT,
	u_position INT
);

/**CREATE TABLE box(#
	b_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	start_time DATETIME,
	end_time DATETIME,
	location VARCHAR(255),
	cv VARCHAR(255),
	cover_letter VARCHAR(255),
	statement VARCHAR(255)
);

CREATE TABLE user_box(
	u_id INT UNSIGNED,
	b_id INT UNSIGNED,
	PRIMARY KEY (u_id, b_id),
	FOREIGN KEY (u_id) REFERENCES user(u_id),
	FOREIGN KEY (b_id) REFERENCES box(b_id)
);
**/
CREATE TABLE Meeting(
meeting_id int PRIMARY KEY,
meeting_title varchar(25),
meeting_descr varchar(50),
location_id int REFERENCES Location(location_id),
start_date_time date,
end_date_time date,
meeting_length int,
meeting_status varchar(50),
position_id int REFERENCES EmployeePosition(position_id)
);

CREATE TABLE Feedback (
	feedback_Id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	content VARCHAR(50),
	author VARCHAR(50),
	date_time_created Date,
	MEETING_ID int,
);


CREATE TABLE EmployeePosition(
	position_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(50),
	currentEmployee VARCHAR(50),
	dept_id INT,
	vacant BOOLEAN,
	num_meetings INT
);
CREATE TABLE Department (
	dept_id INT,
	dept_title VARCHAR(50),
	dept_short VARCHAR(10),
	open_position INT
)
CREATE TABLE Location (
	location_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(50),
	available boolean
);

CREATE TABLE FeedbackCombo (
	meeting_id INT,
	feedback _id INT,
	author_email VarChar(45),
	PRIMARY KEY(meeting_id, feedback_id)
);

CREATE TABLE UserTypes (
	type_id INT PRIMARY KEY,
	type_desc VARChar(45)
);
CREATE TABLE meetingUser (
	u_id INT,
	meeting_id INT,
	PRIMARY KEY(u_id, meeting_id)
)
CREATE TABLE Candidate (
	Candidate_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	u_id INT,
	meeting_id INT,
	PRIMARY KEY(u_id, meeting_id)
)

SELECT * From user_box;
SELECT * From user;
SELECT * From box;
SELECT * From Meeting;
SELECT * From Feedback;
SELECT * From EmployeePosition;
SELECT * From Location;
SELECT * From FeedbackCombo;
SELECT * From UserTypes;
SELECT * From meetingUser;

SELECT * FROM Candidate;
