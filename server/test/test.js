import chai from 'chai';
import chaiHttp from "chai-http";
import app from "../../index";
import {expect} from 'chai';
chai.use(chaiHttp);
const testUser = {
    "lastName":"lastName",
    "firstName":"firstName",
    "email":"userEmail@gmail.com",
    "password":"password",
    "status":"userStatus"
}
describe('User SignUp', ()=>{
    it('Should return a success status',(done)=>{
        chai.request(app).post('/api/v1/auth/signup')
        .send(testUser)
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message');
            expect(res.body).to.be.a('object');
            expect(res.body.data).to.be.a('object');
        })
        done();
    } )
    it('Should return a failure status', (done)=>{
        chai.request(app).post('/api/v1/auth/signup')
        .send(testUser)
        .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error');
        })
        done();
    })
})