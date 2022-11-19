const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const testDao = require('../test-dao');

const app = require('../index');
let agent = chai.request.agent(app); //.agent() is needed for keep cookies from one reuqent

function User(name, lastname, email, password, role, phone_number) {
  this.name = name;
  this.lastname = lastname;
  this.email = email;
  this.password = password;
  this.role = role;
  this.phone_number = phone_number;
}

describe('test user signup', () => {
  beforeEach(async () => {
    await testDao.run('DELETE FROM USER');
  });

  registerNewUser(200, 'Paolo', 'Goglia', 'Hiker', 'password', 'paologoglia@gmail.com', '+39 3207549337');
  registerNewUser(500, 'Giovanni', undefined, undefined, 'password', 'giovanni@gmail.com', '+39 3209030302');
  registerTwoTimeNewUser(500, 'Paolo', 'Goglia', 'Hiker', 'password', 'paologoglia@gmail.com', '+39 3207549337');
  registerNewUser(500, 'Fabio', 'Magico', 'LocalGuide', 'password', 'fabiomagicogmail.com', '+39 3401216784');
  registerNewUser(500, 'Marco', 'Pietra', undefined, 'password', 'marcopietra.com', '+39 3334545670');

});

function registerNewUser(expectedHTTPStatus, name, lastname, role, password, email, phone_number) {
  it('registering a new user', function () {
    const user = new User(name,lastname,email,password,role,phone_nambuer,phone_number);
    return agent.post('/api/User')
      .send(user)
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      });
  });
}

function registerTwoTimeNewUser(expectedHTTPStatus, name, lastname, role, password, email, phone_number) {
  it('registering two time a new user', function () {
    const user = new User(name,lastname,email,password,role,phone_nambuer,phone_number);
    return agent.post('/api/User')
      .send(user)
      .then(function (res) {
        const user = new User(name,lastname,email,password,role,phone_nambuer,phone_number);
        agent.post('/api/User')
          .send(user)
          .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
          });
      });
  });
}
