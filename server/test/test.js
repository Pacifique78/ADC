import chai from 'chai';
import chaiHttp from "chai-http";
import app from "../../index";
import {expect} from 'chai';
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
