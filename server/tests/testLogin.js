const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../index');
let agent = chai.request.agent(app); //.agent() is needed for keep cookies from one reuqent

describe('test login', () => {

  loginUser(200, 'mario.rossi@gmail.com', 'hello12');     //correct email and password
  loginUser(401, 'mario.rossi@gmail.com', 'password');    //wrong password

});

function loginUser(expectedHTTPStatus, username, password) {
  it('login', async function() {
    const credentials = {username,password};
    reqBody = JSON.stringify(credentials);
    return agent.post('/api/sessions')
      .set('Content-Type', 'application/json')
      .send(reqBody)
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      });
  });
}