import chai from 'chai';
import chaiHttp from "chai-http";
import app from "../../index";
import {expect} from 'chai';
import bcrypt from 'bcrypt';
chai.use(chaiHttp);

describe('Welcome Home page', () => {
    it('Should should return a welcome text', (done) => {
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
        chai.request(app).post('/api/v1/auth/signup')
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
            //"firstName":"firstName",
            "email":"userEmail@gmail.com",
            "password":"password",
            "status":"admin",
            "address":"address",
            "bio":"bio",
            "occupation":"occupation",
            "expertise":"expertise"
        };
        chai.request(app).post('/api/v1/auth/signup')
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
        chai.request(app).post('/api/v1/auth/signup')
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
        chai.request(app).post('/api/v1/auth/signin')
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
        chai.request(app).post('/api/v1/auth/signin')
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
        chai.request(app).post('/api/v1/auth/signin')
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
        chai.request(app).post('/api/v1/auth/signin')
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
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzeXN0ZW1hZG1pbkBnbWFpbC5jb20iLCJzdGF0dXMiOiJhZG1pbiIsImlhdCI6MTU2Nzg4ODAxOCwiZXhwIjoxNTY3OTc0NDE4fQ.rwGYAefTJrK1HSlD6DgZETaCrIDoSg3c6sq7OY8LX_E";
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
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzeXN0ZW1hZG1pbkBnbWFpbC5jb20iLCJzdGF0dXMiOiJhZG1pbiIsImlhdCI6MTU2Nzg4ODAxOCwiZXhwIjoxNTY3OTc0NDE4fQ.rwGYAefTJrK1HSlD6DgZETaCrIDoSg3c6sq7OY8LX_E"
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
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzeXN0ZW1hZG1pbkBnbWFpbC5jb20iLCJzdGF0dXMiOiJhZG1pbiIsImlhdCI6MTU2Nzg4ODAxOCwiZXhwIjoxNTY3OTc0NDE4fQ.rwGYAefTJrK1HSlD6DgZETaCrIDoSg3c6sq7OY8LX_E";
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
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzeXN0ZW1hZG1pbkBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50b3IiLCJpYXQiOjE1Njc4ODgwMTgsImV4cCI6MTU2Nzk3NDQxOH0.CKn8irwyByNBt-LLkvpLZAHQJmGVaTsb4WrddrwNsHE";
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
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50ZWUiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6MTU2Nzk3OTA2N30.QSCUeDXOkutUY1aVbClDPCcU7NoC8S_syDI0fhaIoCw";
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
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50ZWUiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6MTU2Nzk3OTA2N30.QSCUeDXOkutUY1aVbClDPCcU7NoC8S_syDI0fhaIoCw";
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
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50ZWUiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6MTU2Nzk3OTA2N30.QSCUeDXOkutUY1aVbClDPCcU7NoC8S_syDI0fhaIoCw";
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
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50ZWUiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6MTU2Nzk3OTA2N30.QSCUeDXOkutUY1aVbClDPCcU7NoC8S_syDI0fhaIoCw";
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
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50ZWUiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6MTU2Nzk3OTA2N30.QSCUeDXOkutUY1aVbClDPCcU7NoC8S_syDI0fhaIoCw";
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
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50ZWUiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6MTU2Nzk3OTA2N30.QSCUeDXOkutUY1aVbClDPCcU7NoC8S_syDI0fhaIoCw";
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
        const  token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50b3IiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6MTU2Nzk3OTA2N30.FAv7h12ftYyoQgaf9xegFaEyE9OsoD3WigSxZJGHgpk";
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
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50b3IiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6MTU2Nzk3OTA2N30.9eb_rI5QTB1s2kFw2xNUO2UKCzrNmXUkkcs9oAZwRiI";
        chai.request(app).patch(`/api/v1/sessions/${sessionId}/accept`) 
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error')
        })
        done();
    })
    it('Should return an error: session not yours to accept', (done) => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50b3IiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6MTU2Nzk3OTA2N30.9eb_rI5QTB1s2kFw2xNUO2UKCzrNmXUkkcs9oAZwRiI";
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
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzeXN0ZW1hZG1pbkBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50b3IiLCJpYXQiOjE1Njc4ODgwMTgsImV4cCI6MTU2Nzk3NDQxOH0.CKn8irwyByNBt-LLkvpLZAHQJmGVaTsb4WrddrwNsHE";
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
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50b3IiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6MTU2Nzk3OTA2N30.FAv7h12ftYyoQgaf9xegFaEyE9OsoD3WigSxZJGHgpk";
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
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50b3IiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6MTU2Nzk3OTA2N30.FAv7h12ftYyoQgaf9xegFaEyE9OsoD3WigSxZJGHgpk";
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
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50b3IiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6MTU2Nzk3OTA2N30.9eb_rI5QTB1s2kFw2xNUO2UKCzrNmXUkkcs9oAZwRiI";
        chai.request(app).patch(`/api/v1/sessions/${sessionId}/reject`) 
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(403);
            expect(res.body).to.have.property('error')
        })
        done();
    })
    it('Should return an error: Your not a mentor', (done) => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzeXN0ZW1hZG1pbkBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50ZWUiLCJpYXQiOjE1Njc4ODgwMTgsImV4cCI6MTU2Nzk3NDQxOH0.o2hCoGaqJkeSR_-Nxxr5y-JR8qHSei3d51Lq7D9pLts";
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
        const token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoidHV5aXplcmVwYWNpZmlxdWVAZ21haWwuY29tIiwic3RhdHVzIjoibWVudGVlIiwiaWF0IjoxNTY3ODkyNjY3LCJleHAiOjE1Njc5NzkwNjd9.aAPJasog6gL9-Y8JLBFuOTUSOwLsI3v5K0KpSLQP4Xw";
        chai.request(app).get(`/api/v1/sessions`)
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error');
        })
        done();
    })
    it('Should return a success: session(s) found', (done)=>{
        const token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50ZWUiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6MTU2Nzk3OTA2N30.QSCUeDXOkutUY1aVbClDPCcU7NoC8S_syDI0fhaIoCw";
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
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50b3IiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6MTU2Nzk3OTA2N30.9eb_rI5QTB1s2kFw2xNUO2UKCzrNmXUkkcs9oAZwRiI";
        chai.request(app).get(`/api/v1/sessions`) 
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error');
        })
        done();
    })
    it('Should return a success: session(s) found', (done)=>{
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50b3IiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6MTU2Nzk3OTA2N30.FAv7h12ftYyoQgaf9xegFaEyE9OsoD3WigSxZJGHgpk";
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
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZmlyc3ROYW1lIjoidHV5aXplcmUiLCJsYXN0TmFtZSI6InBhY2lmaXF1ZSIsImVtYWlsIjoidHV5aXplcmVwYWNpZmlxdWVAZ21haWwuY29tIiwic3RhdHVzIjoibWVudGVlIiwiaWF0IjoxNTY3OTI5MTk2LCJleHAiOjE1NjgwMTU1OTZ9.MKyMx4S3CXBS5hpSf1wXrfkcqm9zepBl4dYbhs1oxWs";
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
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZmlyc3ROYW1lIjoidHV5aXplcmUiLCJsYXN0TmFtZSI6InBhY2lmaXF1ZSIsImVtYWlsIjoidHV5aXplcmVwYWNpZmlxdWVAZ21haWwuY29tIiwic3RhdHVzIjoibWVudGVlIiwiaWF0IjoxNTY3OTI5MTk2LCJleHAiOjE1NjgwMTU1OTZ9.MKyMx4S3CXBS5hpSf1wXrfkcqm9zepBl4dYbhs1oxWs";
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
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZmlyc3ROYW1lIjoidHV5aXplcmUiLCJsYXN0TmFtZSI6InBhY2lmaXF1ZSIsImVtYWlsIjoidHV5aXplcmVwYWNpZmlxdWVAZ21haWwuY29tIiwic3RhdHVzIjoibWVudGVlIiwiaWF0IjoxNTY3OTI5MTk2LCJleHAiOjE1NjgwMTU1OTZ9.MKyMx4S3CXBS5hpSf1wXrfkcqm9zepBl4dYbhs1oxWs";
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
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJhZG1pbiIsImlhdCI6MTU2NzkyOTE5NiwiZXhwIjoxNTY4MDE1NTk2fQ.tzMeEyw8lW9OHE2uupgmU6TD1Lr0lFl4QSHbcMqr-rA";
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
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJhZG1pbiIsImlhdCI6MTU2NzkyOTE5NiwiZXhwIjoxNTY4MDE1NTk2fQ.tzMeEyw8lW9OHE2uupgmU6TD1Lr0lFl4QSHbcMqr-rA";
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
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50ZWUiLCJpYXQiOjE1Njc5MjkxOTYsImV4cCI6MTU2ODAxNTU5Nn0.lsmDlbi4Y-moy6OZrikxtQwEdCNdjKYjFzpYI6tSS4k";
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