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
            done();
        });
    });
});
describe('User SignUp', ()=>{
    it('Should allow a user to signup', (done)=>{
        const testUser = {
            "firstName":"testUser",
            "lastName":"testUser",
            "email":"testUser@gmail.com",
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
            expect(res.body).to.have.property('token');
            done();
        });
    });
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
            expect(res.body).to.have.property('error');
            done();
        });
    });
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
            expect(res.body).to.have.property('error');
            done();
        });
    });
});

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
            expect(res.body).to.have.property('token');
            done();
        });
    });
    it('Should NOT allow a user to signin: Email not found', (done)=>{
        const testUser3 = {
            "email":"testUser1@gmail.com",
            "password":"password"
        };
        chai.request(app).post('/api/v2/auth/signin')
        .send(testUser3)
        .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error');
            done();
        });
    });
    it('Should NOT allow a user to signin: Incorrect password', (done)=>{
        const testUser3 = {
            "email":"systemadmin@gmail.com",
            "password":"password"
        };
        chai.request(app).post('/api/v2/auth/signin')
        .send(testUser3)
        .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('error');
            done();
        });
    });
    it('Should NOT allow a user to signin: Invalid input or missing input', (done)=>{
        const testUser1 = {
            "email":"systemadmin@gmail.com",
            //"password":"password"
        };
        chai.request(app).post('/api/v2/auth/signin')
        .send(testUser1)
        .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
            done();
        });
    });
});

describe('Change a user', ()=>{
    it('Should allow a user to to become a mentor', (done)=>{
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzeXN0ZW1hZG1pbkBnbWFpbC5jb20iLCJzdGF0dXMiOiJhZG1pbiIsImlhdCI6MTU2Nzg4ODAxOCwiZXhwIjo5OTk5OTc0NDE4fQ.wxE4C25XSe-rKkGfxLMAYxQqatFbvd952jnVcL_cUnQ";
        const userId = 4;
        chai.request(app).patch(`/api/v2/user/${userId}`) 
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message');
            done();
        });
    });
    it('Should not allow a user to to become a mentor: Invalid user Id', (done)=>{
        const userId1= 300;
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzeXN0ZW1hZG1pbkBnbWFpbC5jb20iLCJzdGF0dXMiOiJhZG1pbiIsImlhdCI6MTU2Nzg4ODAxOCwiZXhwIjo5OTk5OTc0NDE4fQ.wxE4C25XSe-rKkGfxLMAYxQqatFbvd952jnVcL_cUnQ"
        chai.request(app).patch(`/api/v2/user/${userId1}`) 
        .set('Authorization',token)
        .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error');
            done();
        });
    });
    it('Should not allow a user to become a mentor: User is already a mentor', (done) =>{
        const userId2 = 3;
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzeXN0ZW1hZG1pbkBnbWFpbC5jb20iLCJzdGF0dXMiOiJhZG1pbiIsImlhdCI6MTU2Nzg4ODAxOCwiZXhwIjo5OTk5OTc0NDE4fQ.wxE4C25XSe-rKkGfxLMAYxQqatFbvd952jnVcL_cUnQ";
        chai.request(app).patch(`/api/v2/user/${userId2}`)
        .set('Authorization', token)
        .end((err,res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error');
            done();
        });
    });
    it('Should not allow a user to become a mentor: Your are not the admin', (done) => {
        const userId3 = 4;
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzeXN0ZW1hZG1pbkBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50b3IiLCJpYXQiOjE1Njc4ODgwMTgsImV4cCI6OTk5OTk3NDQxOH0.5X7nOODJmua64xSa2rLrdcML-eFs5SznUN-NFTz4ZK4";
        chai.request(app).patch(`/api/v2/user/${userId3}`)
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('error');
            done();
        });
    });
    it('Shouls not allow a user to become a mentor: Token is not provided', (done) => {
        const userId4 = 4;
        const token = "";
        chai.request(app).patch(`/api/v2/user/${userId4}`)
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('error');
            done();
        })
    })
})

describe('Get all mentors', ()=>{
    it('Should should return all mentors', (done)=>{
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50ZWUiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6OTk5OTk3OTA2N30.EQw6nJBsoem02wUi1jWXr-sUWJV-HGjPy8SVdFwbp7c";
        chai.request(app).get('/api/v2/mentors') 
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message');
            done();
        });
    });
    it('Shouls not return all mentors: Token is not provided', (done) => {
        const token = "";
        chai.request(app).get(`/api/v2/mentors`)
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('error');
            done();
        });
    });
});

describe('Get specific mentor', ()=>{
    it('Should return mentor with the specified ID', (done)=>{
        const mentorId= 3;
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50ZWUiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6OTk5OTk3OTA2N30.EQw6nJBsoem02wUi1jWXr-sUWJV-HGjPy8SVdFwbp7c";
        chai.request(app).get(`/api/v2/mentors/${mentorId}`) 
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message');
            expect(res.body.data).to.be.a("object");
            done();
        })
    })
    it('Should not return a mentor : Invalid mentorid', (done)=>{
        const mentorId= 300;
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50ZWUiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6OTk5OTk3OTA2N30.EQw6nJBsoem02wUi1jWXr-sUWJV-HGjPy8SVdFwbp7c";
        chai.request(app).get(`/api/v2/mentors/${mentorId}`) 
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error');
            done();
        })
    })
    it('Shouls not return a mentor: Token is not provided', (done) => {
        const mentorId3 = 2;
        const token = "";
        chai.request(app).get(`/api/v2/mentors/${mentorId3}`)
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('error');
            done();
        })
    })
})
describe('Create a mentorship session', ()=>{
    it('Should return a success: request submitted', (done)=>{
        const testUser1= {
            "mentorId": 3,
            "questions": "Could you be my mentor"
        };
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50ZWUiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6OTk5OTk3OTA2N30.EQw6nJBsoem02wUi1jWXr-sUWJV-HGjPy8SVdFwbp7c";
        chai.request(app).post('/api/v2/sessions')
        .set('Authorization', token)
        .send(testUser1) 
        .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('message');
            done();
        })
    })
    it('Should return an error: invalid mentorId', (done)=>{
        const testUser2= {
        "mentorId":1000,
        "questions":"Could you be my mentor"
        };
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50ZWUiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6OTk5OTk3OTA2N30.EQw6nJBsoem02wUi1jWXr-sUWJV-HGjPy8SVdFwbp7c";
        chai.request(app).post('/api/v2/sessions') 
        .set('Authorization', token)
        .send(testUser2)
        .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error');
            done();
        })
    })
    it('Should return an error: Invalid data', (done) =>{
        const testUser4= {
            "mentorId":true,
            "questions":"Could you be my mentor"
            };
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiZW1haWwiOiJ0dXlpemVyZXBhY2lmaXF1ZUBnbWFpbC5jb20iLCJzdGF0dXMiOiJtZW50ZWUiLCJpYXQiOjE1Njc4OTI2NjcsImV4cCI6OTk5OTk3OTA2N30.EQw6nJBsoem02wUi1jWXr-sUWJV-HGjPy8SVdFwbp7c";
        chai.request(app).post('/api/v2/sessions')
        .set('Authorization', token)
        .send(testUser4)
        .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("error");
            done();
        })
    })
    it('Shouls not return an error: Token is not provided', (done) => {
        const testUser5= {
            "mentorId":3,
            "questions":"Could you be my mentor"
            };
        const token = "";
        chai.request(app).post(`/api/v2/sessions`)
        .set('Authorization', token)
        .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('error');
            done();
        })
    })
})