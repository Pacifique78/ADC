import chai from 'chai';
import chaiHttp from "chai-http";
import app from "../../index";
import {expect} from 'chai';
import bcrypt from 'bcrypt';
chai.use(chaiHttp);

describe('Welcome Home page', () => {
    it('Should return a welcome text', (done) => {
        chai.request(app).get('/')
        .end((err, res) => {
            expect(res);
        })
        done();
    })
})
describe('User SignUp', ()=>{
    it('Should allow a user to signup', (done)=>{
        const testUser = {
            "lastName":"lastName",
            "firstName":"firstName",
            "email":"userEmail@gmail.com",
            "password":"password",
            "address":"address",
            "bio":"bio",
            "occupation":"occupation",
            "expertise":"expertise"
        };
        chai.request(app).post('/api/v2/auth/signup')
        .send(testUser)
        .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('data');
            expect(res.body).to.have.property('token')
        })
        done();
    })
    it('Should NOT allow a user to signup: Invalid data', (done)=>{
        const testUser3 = {
            "lastName":"lastName",
            "firstName":"",
            "email":"userEmail@gmail.com",
            "password":"password",
            "status":"admin",
            "address":"address",
            "bio":"bio",
            "occupation":"occupation",
            "expertise":"expertise"
        };
        chai.request(app).post('/api/v2/auth/signup')
        .send(testUser3)
        .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error')
        })
        done();
    })
    it('Should NOT allow a user to signup: user already exist', (done)=>{
        const testUser1 = {
            "lastName":"lastName",
            "firstName":"firstName",
            "email":"systemadmin@gmail.com",
            "password":"password",
            "address":"address",
            "bio":"bio",
            "occupation":"occupation",
            "expertise":"expertise"
        };
        chai.request(app).post('/api/v2/auth/signup')
        .send(testUser1)
        .end((err, res) => {
            expect(res).to.have.status(409);
            expect(res.body).to.have.property('error')
        })
        done();
    })
})

//Login
describe('User Signin', ()=>{
    it('Should allow a user to signin', (done)=>{
        const testUser = {
            "email":"systemadmin@gmail.com",
            "password":"admin"
        };
        chai.request(app).post('/api/v2/auth/signin')
        .send(testUser)
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message');
            expect(res.body).to.have.property('data');
            expect(res.body).to.have.property('token')
        })
        done();
    })
    it('Should NOT allow a user to signin: Invalid email', (done)=>{
        const testUser3 = {
            "email":"userEmail12345@gmail.com",
            "password":"password"
        };
        chai.request(app).post('/api/v2/auth/signin')
        .send(testUser3)
        .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error')
        })
        done();
    })
    it('Should NOT allow a user to signin: Invalid password', (done)=>{
        const testUser3 = {
            "email":"systemadmin@gmail.com",
            "password":"password"
        };
        chai.request(app).post('/api/v2/auth/signin')
        .send(testUser3)
        .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error')
        })
        done();
    })
    it('Should NOT allow a user to signin: Invalid input or missing input', (done)=>{
        const testUser1 = {
            "email":"systemadmin@gmail.com",
            //"password":"password"
        };
        chai.request(app).post('/api/v2/auth/signin')
        .send(testUser1)
        .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error')
        })
        done();
    })
})

//Become a mentor
describe('Become a mentor', ()=>{
    it('Should allow a user to to become a mentor', (done)=>{
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzeXN0ZW1hZG1pbkBnbWFpbC5jb20iLCJzdGF0dXMiOiJhZG1pbiIsImlhdCI6MTU2Nzg4ODAxOCwiZXhwIjo5OTk5OTc0NDE4fQ.wxE4C25XSe-rKkGfxLMAYxQqatFbvd952jnVcL_cUnQ";
        const userId = 3;
        chai.request(app).patch(`/api/v1/user/${userId}`) 
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message')
        })
        done();
    })
    it('Should not allow a user to to become a mentor: Invalid user Id', (done)=>{
        const userId1= 300;
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzeXN0ZW1hZG1pbkBnbWFpbC5jb20iLCJzdGF0dXMiOiJhZG1pbiIsImlhdCI6MTU2Nzg4ODAxOCwiZXhwIjo5OTk5OTc0NDE4fQ.wxE4C25XSe-rKkGfxLMAYxQqatFbvd952jnVcL_cUnQ"
        chai.request(app).patch(`/api/v1/user/${userId1}`) 
        .set('Authorization',token)
        .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error')
        })
        done();
    })
    it('Should not allow a user to become a mentor: User is already a mentor', (done) =>{
        const userId2 = 2;
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzeXN0ZW1hZG1pbkBnbWFpbC5jb20iLCJzdGF0dXMiOiJhZG1pbiIsImlhdCI6MTU2Nzg4ODAxOCwiZXhwIjo5OTk5OTc0NDE4fQ.wxE4C25XSe-rKkGfxLMAYxQqatFbvd952jnVcL_cUnQ";
        chai.request(app).patch(`/api/v1/user/${userId2}`)
        .set('Authorization', token)
        .end((err,res) => {
            expect(res).to.have.status(409);
            expect(res.body).to.have.property('error')
        })
        done();
    })
    it('Should not allow a user to become a mentor: Your are not the admin', (done) => {
        const userId3 = 3;
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzeXN0ZW1hZG1pbkBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50b3IiLCJpYXQiOjE1Njc4ODgwMTgsImV4cCI6OTk5OTk3NDQxOH0.5X7nOODJmua64xSa2rLrdcML-eFs5SznUN-NFTz4ZK4";
        chai.request(app).patch(`/api/v1/user/${userId3}`)
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(403);
            expect(res.body).to.have.property('error');
        })
        done();
    })
    it('Shouls not allow a user to become a mentor: Token is not provided', (done) => {
        const userId4 = 3;
        const token = "";
        chai.request(app).patch(`/api/v1/user/${userId4}`)
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('error');
        })
        done();
    })
})
//getAllMentors
describe('Get all mentors', ()=>{
    it('Should should return all mentors', (done)=>{
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50ZWUiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6OTk5OTk3OTA2N30.EQw6nJBsoem02wUi1jWXr-sUWJV-HGjPy8SVdFwbp7c";
        chai.request(app).get('/api/v1/mentors') 
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message')
        })
        done();
    })
    it('Shouls not return all mentors: Token is not provided', (done) => {
        const token = "";
        chai.request(app).get(`/api/v1/mentors`)
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('error');
        })
        done();
    })
})
//get specific mentor
describe('Get specific mentor', ()=>{
    it('Should return mentor with the specified ID', (done)=>{
        const mentorId= 2;
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50ZWUiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6OTk5OTk3OTA2N30.EQw6nJBsoem02wUi1jWXr-sUWJV-HGjPy8SVdFwbp7c";
        chai.request(app).get(`/api/v1/mentors/${mentorId}`) 
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message');
            expect(res.body.data).to.be.a("object");
        })
        done();
    })
    it('Should not return a mentor : Invalid mentorid', (done)=>{
        const mentorId= 300;
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50ZWUiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6OTk5OTk3OTA2N30.EQw6nJBsoem02wUi1jWXr-sUWJV-HGjPy8SVdFwbp7c";
        chai.request(app).get(`/api/v1/mentors/${mentorId}`) 
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error')
        })
        done();
    })
    it('Shouls not return a mentor: Token is not provided', (done) => {
        const mentorId3 = 2;
        const token = "";
        chai.request(app).get(`/api/v1/mentors/${mentorId3}`)
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('error');
        })
        done();
    })
})
//create a session
describe('Create a mentorship session', ()=>{
    it('Should return a success: request submitted', (done)=>{
        const testUser1= {
            "mentorId": 2,
            "questions": "Could you be my mentor"
        };
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50ZWUiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6OTk5OTk3OTA2N30.EQw6nJBsoem02wUi1jWXr-sUWJV-HGjPy8SVdFwbp7c";
        chai.request(app).post('/api/v1/sessions')
        .set('Authorization', token)
        .send(testUser1) 
        .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('message');
            expect(res.body.data).to.be.a("object");
        })
        done();
    })
    it('Should return an error: invalid mentorId', (done)=>{
        const testUser2= {
        "mentorId":1000,
        "questions":"Could you be my mentor"
        };
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50ZWUiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6OTk5OTk3OTA2N30.EQw6nJBsoem02wUi1jWXr-sUWJV-HGjPy8SVdFwbp7c";
        chai.request(app).post('/api/v1/sessions') 
        .set('Authorization', token)
        .send(testUser2)
        .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error')
        })
        done();
    })
    it('Should return an error: Invalid data', (done) =>{
        const testUser4= {
            "mentorId":true,
            "questions":"Could you be my mentor"
            };
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50ZWUiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6OTk5OTk3OTA2N30.EQw6nJBsoem02wUi1jWXr-sUWJV-HGjPy8SVdFwbp7c";
        chai.request(app).post('/api/v1/sessions')
        .set('Authorization', token)
        .send(testUser4)
        .end((err, res) => {
            expect(res).to.have.status(400)
            expect(res.body).to.have.property("error")
        })
        done();
    })
    it('Shouls not return an error: Token is not provided', (done) => {
        const testUser5= {
            "mentorId":2,
            "questions":"Could you be my mentor"
            };
        const token = "";
        chai.request(app).post(`/api/v1/sessions`)
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('error');
        })
        done();
    })
})
//accept a session
describe('Accept mentorship session request', ()=>{
    it('Should return a success: request accepted', (done)=>{
        const sessionId = 2;
        const  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50b3IiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6OTk5OTk3OTA2N30.V-CuhJy3AbuMSrIhtO8dBs5J5-NLhQdc98uz7bFiFhA";
        chai.request(app).patch(`/api/v1/sessions/${sessionId}/accept`) 
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message');
            expect(res.body.data).to.be.a("object");
        })
        done();
    })
    it('Should return an error: invalid sessionId', (done)=>{
        const sessionId = 500;
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50b3IiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6OTk5OTk3OTA2N30.JdDqHqlFJSvJTQFyfPy4qykgBP1ETID5-Y4I0qkBpRg";
        chai.request(app).patch(`/api/v1/sessions/${sessionId}/accept`) 
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error')
        })
        done();
    })
    it('Should return an error: session not yours to accept', (done) => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50b3IiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6OTk5OTk3OTA2N30.JdDqHqlFJSvJTQFyfPy4qykgBP1ETID5-Y4I0qkBpRg";
        const sessionId =1;
        chai.request(app).patch(`/api/v1/sessions/${sessionId}/accept`)
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(403);
            expect(res.body).to.have.property('error');
        })
        done();
    })
    it('Should return an error: Your not a mentor', (done) => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzeXN0ZW1hZG1pbkBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50b3IiLCJpYXQiOjE1Njc4ODgwMTgsImV4cCI6OTk5OTk3NDQxOH0.5X7nOODJmua64xSa2rLrdcML-eFs5SznUN-NFTz4ZK4";
        const sessionId1 = 1;
        chai.request(app).patch(`/api/v1/sessions/${sessionId1}/accept`)
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(403);
            expect(res.body).to.have.property('error')
        }) 
        done();
    })
    it('Shouls return an error: Token is not provided', (done) => {
        const sessionId2 = 1;
        const token = "";
        chai.request(app).patch(`/api/v1/sessions/${sessionId2}/accept`)
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('error');
        })
        done();
    })
})
//reject a session
describe('Reject mentorship session request', ()=>{
    it('Should return a success: request rejected', (done)=>{
        const sessionId = 1;
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50b3IiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6OTk5OTk3OTA2N30.V-CuhJy3AbuMSrIhtO8dBs5J5-NLhQdc98uz7bFiFhA";
        chai.request(app).patch(`/api/v1/sessions/${sessionId}/reject`) 
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message');
            expect(res.body.data).to.be.a("object");
        })
        done();
    })
    it('Should return an error: invalid sessionId', (done)=>{
        const sessionId = 500;
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50b3IiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6OTk5OTk3OTA2N30.V-CuhJy3AbuMSrIhtO8dBs5J5-NLhQdc98uz7bFiFhA";
        chai.request(app).patch(`/api/v1/sessions/${sessionId}/reject`) 
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error')
        })
        done();
    })
    it('Should return an error: NOt yours to reject', (done)=>{
        const sessionId = 1;
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50b3IiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6OTk5OTk3OTA2N30.JdDqHqlFJSvJTQFyfPy4qykgBP1ETID5-Y4I0qkBpRg";
        chai.request(app).patch(`/api/v1/sessions/${sessionId}/reject`) 
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(403);
            expect(res.body).to.have.property('error')
        })
        done();
    })
    it('Should return an error: Your not a mentor', (done) => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzeXN0ZW1hZG1pbkBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50ZWUiLCJpYXQiOjE1Njc4ODgwMTgsImV4cCI6OTk5OTk3NDQxOH0.dZuyI74_xeFecSgO1Da10CCrTPtR1Z006q8RFFEL50c";
        const sessionId1 = 1;
        chai.request(app).patch(`/api/v1/sessions/${sessionId1}/reject`)
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(403);
            expect(res.body).to.have.property('error')
        }) 
        done();
    })
    it('Shouls return an error: Token is not provided', (done) => {
        const sessionId2 = 1;
        const token = "";
        chai.request(app).patch(`/api/v1/sessions/${sessionId2}/reject`)
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('error');
        })
        done();
    })
})
//view sessions
describe('get sessions', ()=>{
    it('Should return an error: User did not create a session', (done)=>{
        const token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoidHV5aXplcmVwYWNpZmlxdWVAZ21haWwuY29tIiwic3RhdHVzIjoibWVudGVlIiwiaWF0IjoxNTY3ODkyNjY3LCJleHAiOjk5OTk5NzkwNjd9.LOhCG1zi9xMDu7E9MXTdTRVin-LaAu3qErxEHRbauoM";
        chai.request(app).get(`/api/v1/sessions`)
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error');
        })
        done();
    })
    it('Should return a success: session(s) found', (done)=>{
        const token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50ZWUiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6OTk5OTk3OTA2N30.EQw6nJBsoem02wUi1jWXr-sUWJV-HGjPy8SVdFwbp7c";
        chai.request(app).get(`/api/v1/sessions`) 
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message');
            expect(res.body.data).to.be.a("array")
        })
        done();
    })
    it('Should return an error: There is no session created for such mentor', (done)=>{
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50b3IiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6OTk5OTk3OTA2N30.JdDqHqlFJSvJTQFyfPy4qykgBP1ETID5-Y4I0qkBpRg";
        chai.request(app).get(`/api/v1/sessions`) 
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error');
        })
        done();
    })
    it('Should return a success: session(s) found', (done)=>{
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50b3IiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6OTk5OTk3OTA2N30.V-CuhJy3AbuMSrIhtO8dBs5J5-NLhQdc98uz7bFiFhA";
        chai.request(app).get(`/api/v1/sessions`) 
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message');
            expect(res.body.data).to.be.a("array")
        })
        done();
    })
    it('Shouls return an error: Token is not provided', (done) => {
        const mentorId3 = 3;
        const token = "";
        chai.request(app).get(`/api/v1/sessions`)
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('error');
        })
        done();
    })
})
describe('Create session review', () => {
    it('Should allow a user to cerate a session review: Riview created successfully', (done) => {
        const testObject = {
            score: 2,
            remark: "dhsvb ubeuiafdv pbdfufcg"
        }
        const sessionId = 1;
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZmlyc3ROYW1lIjoidHV5aXplcmUiLCJsYXN0TmFtZSI6InBhY2lmaXF1ZSIsImVtYWlsIjoidHV5aXplcmVwYWNpZmlxdWVAZ21haWwuY29tIiwic3RhdHVzIjoibWVudGVlIiwiaWF0IjoxNTY3OTI5MTk2LCJleHAiOjk5OTk5MTU1OTZ9.yi3KaVUA81O8W3RhaRWfH8C5GML0nM3fpZnaHzgnrEo";
        chai.request(app).post(`/api/v1/sessions/${sessionId}/review`)
        .set('Authorization', token)
        .send(testObject)
        .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('message');
            expect(res.body.data).to.be.a('object');
        })
        done();
    })
    it('Should Not allow a user to cerate a session review: Session id not found', (done) => {
        const testObject1 = {
            score: 2,
            remark: "dhsvb ubeuiafdv pbdfufcg"
        }
        const sessionId1 = 100;
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZmlyc3ROYW1lIjoidHV5aXplcmUiLCJsYXN0TmFtZSI6InBhY2lmaXF1ZSIsImVtYWlsIjoidHV5aXplcmVwYWNpZmlxdWVAZ21haWwuY29tIiwic3RhdHVzIjoibWVudGVlIiwiaWF0IjoxNTY3OTI5MTk2LCJleHAiOjk5OTk5MTU1OTZ9.yi3KaVUA81O8W3RhaRWfH8C5GML0nM3fpZnaHzgnrEo";
        chai.request(app).post(`/api/v1/sessions/${sessionId1}/review`)
        .set('Authorization', token)
        .send(testObject1)
        .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error');
        })
        done();
    })
    it('Should allow a user to cerate a session review: Invalid data', (done) => {
        const testObject2 = {
            score: 10,
            remark: "dhsvb ubeuiafdv pbdfufcg"
        }
        const sessionId2 = 1;
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZmlyc3ROYW1lIjoidHV5aXplcmUiLCJsYXN0TmFtZSI6InBhY2lmaXF1ZSIsImVtYWlsIjoidHV5aXplcmVwYWNpZmlxdWVAZ21haWwuY29tIiwic3RhdHVzIjoibWVudGVlIiwiaWF0IjoxNTY3OTI5MTk2LCJleHAiOjk5OTk5MTU1OTZ9.yi3KaVUA81O8W3RhaRWfH8C5GML0nM3fpZnaHzgnrEo";
        chai.request(app).post(`/api/v1/sessions/${sessionId2}/review`)
        .set('Authorization', token)
        .send(testObject2)
        .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
        })
        done();
    })
    it('Should allow a user to cerate a session review: token not provided', (done) => {
        const testObject3 = {
            score: 2,
            remark: "dhsvb ubeuiafdv pbdfufcg"
        }
        const sessionId3 = 1;
        const token = "";
        chai.request(app).post(`/api/v1/sessions/${sessionId3}/review`)
        .set('Authorization', token)
        .send(testObject3)
        .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('error');
        })
        done();
    })
})
describe('Delete a session review deemed inappropriate:', () => {
    it('Should allow an admin to delete a session review: Riview deleted successfully', (done) => {
        const sessionId = 1;
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJhZG1pbiIsImlhdCI6MTU2NzkyOTE5NiwiZXhwIjo5OTk5OTE1NTk2fQ.VxwviZS8qi4tw-e00eb2bU-Coe9mvtYFyC8cjUGNjsQ";
        chai.request(app).delete(`/api/v1/sessions/${sessionId}/review`)
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message');
        })
        done();
    })
    it('Should Not delete a session review: Session id not found', (done) => {
        const sessionId1 = 100;
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJhZG1pbiIsImlhdCI6MTU2NzkyOTE5NiwiZXhwIjo5OTk5OTE1NTk2fQ.VxwviZS8qi4tw-e00eb2bU-Coe9mvtYFyC8cjUGNjsQ";
        chai.request(app).delete(`/api/v1/sessions/${sessionId1}/review`)
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error');
        })
        done();
    })
    it('Should not delete a session review: Only admin can di this', (done) => {
        const sessionId2 = 1;
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50ZWUiLCJpYXQiOjE1Njc5MjkxOTYsImV4cCI6OTk5OTkxNTU5Nn0.CWRKJz_K6WDihFqSpFaC2XH4ED1H5n4OReWGhRg_5TA";
        chai.request(app).delete(`/api/v1/sessions/${sessionId2}/review`)
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(403);
            expect(res.body).to.have.property('error');
        })
        done();
    })
    it('Should not delete a session review: token not provided', (done) => {
        const sessionId3 = 1;
        const token = "";
        chai.request(app).post(`/api/v1/sessions/${sessionId3}/review`)
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('error');
        })
        done();
    })
})