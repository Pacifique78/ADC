# ADC : Andela Development Challenge

[![Build Status](https://travis-ci.org/Pacifique78/ADC.svg?branch=develop)](https://travis-ci.org/Pacifique78/ADC)
[![Coverage Status](https://coveralls.io/repos/github/Pacifique78/ADC/badge.svg)](https://coveralls.io/github/Pacifique78/ADC)

# Free Mentors
Free mentor is a platform whereby accomplished professionals become role model and share their knowledge, skills and experience to assist young people to progress in their own career.
## Features
* Users can sign up
* Users can sign in
* Admin can change a mentee to a mentor
* Users can view all mentors
* Users can view a specific mentor
* Users can create a mentorship session request with a mentor
* A mentor can accept a mentorship session request
* A mentor can reject a mentorship session request
* Users can view all their mentorship sessions
* Users can review a mentor after a mentorship session
* Admin can delete a review deemed as inappropriate
## Pivotal Tracker stories
* PT board link: (https://www.pivotaltracker.com/n/projects/2383296)
## UI Template
* use this link to access the UI templates  https://pacifique78.github.io/ADC/UI/
## Installation(Tools)
* Text Editor: Visual Code Studio
* Node/Express
* Postman
* POSTGRESQL
## SetUp Project to get Started
* Clone this repo
* install all dependencies using 
    :npm install
* Start Server
    :npm run dev
* Run Postman to check API Endpoints on
    :localhost:3000
    :https://free-mentor78.herokuapp.com
## Methods and paths to test API Endpoints
| Method      | Path                                                           | Description                          |
|-------------|----------------------------------------------------------------|--------------------------------------|
| POST        | /api/v1/auth/signup                                            | Create User Account                  |
| POST        | /api/v1/auth/signin                                            | User login                           |
| PATCH       | /api/v1/user/:userId                                           | Change a user to a mentor            |
| GET         | /api/v1/mentors                                                | Get all mentors                      |
| GET         | /api/v1/mentors/:mentorId                                      | Get a specific mentor                |
| POST        | /api/v1/sessions                                               | Create a mentorship session request  |
| PATCH       | /api/v1/sessions/:sessionId/accept                             | A mentor accepts a session request   |
| PATCH       | /api/v1/sessions/:sessionId/reject                             | A mentor rejects a session request   |
| GET         | /api/v1/sessions                                               | Get all mentorship session requests  |
| POST        | /api/v1/sessions/:sessionId/review                             | Review a finished mentorship session |
| DELETE      | /api/v1/sessions/:sessionId/review                             | Delete inappropriate session review. |
## Technologies Used
### Bank-End
* Node / Express js
* Express
* Joi
* Travis CI
* Code Coveralls
### Front-End
* HTML
* CSS
* JavaScript

