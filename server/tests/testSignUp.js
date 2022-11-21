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
    await testDao.run('DELETE FROM Users');
  });

  afterEach(async () => {
    await testDao.run('DELETE FROM Users');
    await testDao.run("INSERT OR IGNORE INTO Users(email, password, role, name, lastname, phone_number, salt)\
            VALUES ('mario.rossi@gmail.com', \
            'db17841d152b23d6feea12d9e385634e41312dc2f8971bb0a22853e2a3ff8ebe', \
            'Hiker', 'Mario', 'Rossi', '+39 3486289468', 'f4d3ed63888571824485d5d37dbd9fec'),\
            ('paulina.knight@gmail.com', \
            'bcd7df7ca984af35ce385885af445b8481ab54c6b518da3d6970a6eeef0045a1', \
            'LocalGuide', 'Paulina', 'Knight', '+39 3276958421', 'a5b9cde522b8c9fb127f173da288d699')");
  });

  registerNewUser(200, 'Paolo', 'Goglia', 'Hiker', 'password', 'paologoglia@gmail.com', '+39 3207549337');
  registerNewUser(500, 'Giovanni', undefined, undefined, 'password', 'giovanni@gmail.com', '+39 3209030302');
  registerTwoTimeNewUser(500, 'Paolo', 'Goglia', 'Hiker', 'password', 'paologoglia@gmail.com', '+39 3207549337');
  registerNewUser(500, 'Fabio', 'Magico', 'LocalGuide', 'password', 'fabiomagicogmail.com', '+39 3401216784');
  registerNewUser(500, 'Marco', 'Pietra', undefined, 'password', 'marcopietra.com', '+39 3334545670');

});

function registerNewUser(expectedHTTPStatus, name, lastname, role, password, email, phone_number) {
  it('registering a new user', (done) => {
    const user = new User(name,lastname,email,password,role,phone_number);
    reqBody = JSON.stringify(user);
    return agent.post('/api/User')
      .set('Content-Type', 'application/json')
      .send(reqBody)
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      }).then(done());
  });
}

function registerTwoTimeNewUser(expectedHTTPStatus, name, lastname, role, password, email, phone_number) {
  it('registering two time a new user', (done) => {
    const user = new User(name,lastname,email,password,role,phone_number);
    reqBody = JSON.stringify(user);
    return agent.post('/api/User')
      .set('Content-Type', 'application/json')
      .send(reqBody)
      .then(function (res) {
        const user = new User(name,lastname,email,password,role,phone_number);
        reqBody = JSON.stringify(user);
        agent.post('/api/User')
          .set('Content-Type', 'application/json')
          .send(reqBody)
          .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
          });
      }).then(done());
  });
}