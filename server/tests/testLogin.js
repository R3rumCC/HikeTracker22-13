const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
//let expect = chai.expect;

//const testDao = require('../test-dao');

const app = require('../index');
let agent = chai.request.agent(app); //.agent() is needed for keep cookies from one reuqent

describe('test login', () => {

  loginUser(401, 'paologoglia@gmail.com', 'password');    //user doesn't exist
  loginUser(200, 'mario.rossi@gmail.com', 'hello12');     //correct email and password
  loginUser(500, 'mario.rossi@gmail.com', 'password');    //wrong password

});

function loginUser(expectedHTTPStatus, email, password) {
  it('login', (done) => {
    return agent.post('/api/sessions')
      .send(email, password)
      .then(function (res) {
        console.log(res.status);
        console.log(expectedHTTPStatus)
        //res.status.should.be.equal(expectedHTTPStatus);
        res.should.have.status(expectedHTTPStatus);
      }).then(done());
  });
}
