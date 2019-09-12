import chai from 'chai';
import chaiHttp from "chai-http";
import app from "../../index";
import {expect} from 'chai';
import {describe, it} from 'mocha';
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
            firstName:"firstname",
            lastName:"lastName",
            email:"systemadmin@gmail.com",
            password:"password",
            address:"address",
            bio:"bio",
            occupation:"occupation",
            expertise:"expertise"
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

