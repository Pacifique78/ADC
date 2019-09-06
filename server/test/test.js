import chai from 'chai';
import chaiHttp from "chai-http";
import app from "../../index";
import {expect} from 'chai';
import bcrypt from 'bcrypt';
chai.use(chaiHttp);

describe('User SignUp', ()=>{
    it('Should allow a user to signup', (done)=>{
        const testUser = {
            "lastName":"lastName",
            "firstName":"firstName",
            "email":"userEmail@gmail.com",
            "password":"password",
            "status":"admin",
            "address":"address",
            "bio":"bio",
            "occupation":"occupation",
            "expertise":"expertise"
        };
        chai.request(app).post('/api/v1/auth/signup')
        .send(testUser)
        .end((err, res) => {
            expect(res).to.have.status(200);
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
            "status":"admin",
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
        const userId= 3;
        chai.request(app).patch(`/api/v1/user/${userId}`) 
        .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('message')
        })
        done();
    })
    it('Should not allow a user to to become a mentor: Invalid user Id', (done)=>{
        const userId= 300;
        chai.request(app).patch(`/api/v1/user/${userId}`) 
        .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error')
        })
        done();
    })
})
//getAllMentors
describe('Get all mentors', ()=>{
    it('Should should return all mentors', (done)=>{
        chai.request(app).get('/api/v1/mentors') 
        .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('message')
        })
        done();
    })
})
//get specific mentor
describe('Get specific mentor', ()=>{
    it('Should return mentor with the specified ID', (done)=>{
        const mentorId= 2;
        chai.request(app).get(`/api/v1/mentors/${mentorId}`) 
        .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('message');
            expect(res.body.data).to.be.a("object");
        })
        done();
    })
    it('Should not return a mentor : Invalid mentorid', (done)=>{
        const mentorId= 300;
        chai.request(app).get(`/api/v1/mentors/${mentorId}`) 
        .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error')
        })
        done();
    })
})
//create a session
describe('Create a mentorship session', ()=>{
    it('Should return a success: request submitted', (done)=>{
        const testUser4= {
            "mentorId":2,
            "menteeId":4,
            "question":"Could you be my mentor",
            "menteeEmail":"hfgcy@gmail.com"
        };
        chai.request(app).post('/api/v1/sessions') 
        .send(testUser4)
        .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('message');
            expect(res.body.data).to.be.a("object");
        })
        done();
    })
    it('Should return an error: invalid mentorId', (done)=>{
        const testUser4= {
        "mentorId":1000,
        "menteeId":4,
        "question":"Could you be my mentor",
        "menteeEmail":"hfgcy@gmail.com"
    };
        chai.request(app).post('/api/v1/sessions') 
        .send(testUser4)
        .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error')
        })
        done();
    })
})
//accept a session
// describe('Accept mentorship session request', ()=>{
//     it('Should return a success: request accepted', (done)=>{
//         const sessionId = 1;
//         chai.request(app).patch(`/api/v1/sessions/:${sessionId}/accept`) 
//         .end((err, res) => {
//             expect(res).to.have.status(201);
//             expect(res.body).to.have.property('message');
//             expect(res.body.data).to.be.a("object");
//         })
//         done();
//     })
//     it('Should return an error: invalid sessionId', (done)=>{
//         const sessionId = 500;
//         chai.request(app).patch(`/api/v1/sessions/:${sessionId}/accept`) 
//         .end((err, res) => {
//             expect(res).to.have.status(404);
//             expect(res.body).to.have.property('error')
//         })
//         done();
//     })
// })
//reject a session
// describe('Reject mentorship session request', ()=>{
//     it('Should return a success: request rejected', (done)=>{
//         const sessionId = 1;
//         chai.request(app).patch(`/api/v1/sessions/:${sessionId}/reject`) 
//         .end((err, res) => {
//             expect(res).to.have.status(201);
//             expect(res.body).to.have.property('message');
//             expect(res.body.data).to.be.a("object");
//         })
//         done();
//     })
//     it('Should return an error: invalid sessionId', (done)=>{
//         const sessionId = 500;
//         chai.request(app).patch(`/api/v1/sessions/:${sessionId}/reject`) 
//         .end((err, res) => {
//             expect(res).to.have.status(404);
//             expect(res.body).to.have.property('error')
//         })
//         done();
//     })
// })
//view sessions
describe('get sessions', ()=>{
    it('Should return an error: User did not create a session', (done)=>{
        const testObject = {
            id: 1000,
            status: "mentee"
        }
        chai.request(app).get(`/api/v1/sessions`) 
        .send(testObject)
        .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error');
        })
        done();
    })
    it('Should return a success: session(s) found', (done)=>{
        const testObject1 = {
            id: 10,
            status: "mentee"
        }
        chai.request(app).get(`/api/v1/sessions`) 
        .send(testObject1)
        .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('message');
            expect(res.body.data).to.be.a("array")
        })
        done();
    })
    it('Should return an error: There is no session created for such mentor', (done)=>{
        const testObject = {
            id: 1000,
            status: "mentor"
        }
        chai.request(app).get(`/api/v1/sessions`) 
        .send(testObject)
        .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('error');
        })
        done();
    })
    it('Should return a success: session(s) found', (done)=>{
        const testObject1 = {
            id: 5,
            status: "mentor"
        }
        chai.request(app).get(`/api/v1/sessions`) 
        .send(testObject1)
        .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('message');
            expect(res.body.data).to.be.a("array")
        })
        done();
    })
})