const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const testDao = require('../test-dao');

const app = require('../index');
const { startHike, updateEndTime, getFinishedHikes } = require('../hikeController');
let agent = chai.request.agent(app); //.agent() is needed for keep cookies from one reuqent

function RowNoEnd(hiker_email, hike_title, start_time){
  this.hiker_email = hiker_email;
  this.hike_title = hike_title;
  this.start_time = start_time;
}

describe("HikerHike test", () => {
  beforeEach(async () => {
    await testDao.run('DELETE FROM HikerHike');
    await testDao.run("INSERT OR IGNORE INTO HikerHike(hiker, hike, start_time, end_time)\
            VALUES ('mario.rossi@gmail.com', \
            'Form Pian Belota to la Vacca', '15.00', '18.00'),\
            ('mario.rossi@gmail.com', \
            'Hike Monte Thabor', '12.00', null)");
  });

  afterEach(async () => {                                 //better afterAll but I recived a "afterAll nt defined"
    await testDao.run('DELETE FROM HikerHike');
    await testDao.run("INSERT OR IGNORE INTO HikerHike(hiker, hike, start_time, end_time)\
            VALUES ('mario.rossi@gmail.com', \
            'Form Pian Belota to la Vacca', '15.00', '18.00'),\
            ('mario.rossi@gmail.com', \
            'Hike Monte Thabor', '12.00', null)");
  });

  startingHike(200, 'mario.rossi@gmail.com', 'Form Pian Belota to la Vacca', '15.00');
  startingHike(400, null, 'Form Pian Belota to la Vacca', '15.00');
  startingHike(400, 'mario.rossi@gmail.com', null, '15.00');
  startingHike(400, 'mario.rossi@gmail.com', 'Form Pian Belota to la Vacca', null);

  updatingEndTime(200, 'mario.rossi@gmail.com', 'Form Pian Belota to la Vacca', '15.00', '18.00');
  updatingEndTime(400, null, 'Form Pian Belota to la Vacca', '15.00', '18.00');
  updatingEndTime(400, 'mario.rossi@gmail.com', null, '15.00', '18.00');
  updatingEndTime(400, 'mario.rossi@gmail.com', 'Form Pian Belota to la Vacca', null, '18.00');

  obtainOnGoingHike(200, 'mario.rossi@gmail.com');
  obtainFinishedHikes(200);
  obtainDistinctFinishedHikes(200);
  obtainFinishedHikesByHiker(200, 'mario.rossi@gmail.com');
  
});

function startingHike(expectedHTTPStatus, hiker_email, hike_title, start_time) {
  it('start a hike', async function () {
    await testDao.run('DELETE FROM HikerHike');
    let reqBody = JSON.stringify({ hiker_email, hike_title, start_time });
    return agent.post('/api/startHike')
      .set('Content-Type', 'application/json')
      .send(reqBody)
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      })
  });
}

function updatingEndTime(expectedHTTPStatus, hiker_email, hike_title, start_time, end_time) {
  it('update the ending time of a hike', async function () {
    let reqBody = JSON.stringify({ hiker_email, hike_title, start_time, end_time });
    return agent.put('/api/updateEndTime')
      .set('Content-Type', 'application/json')
      .send(reqBody)
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      })
  });
}

function obtainOnGoingHike(expectedHTTPStatus, hiker_email) {
  it('get list of finished hikes', async function () {
    return agent.get('/api/getOnGoingHike/'+hiker_email)
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      })
  });
};

function obtainFinishedHikes(expectedHTTPStatus) {
  it('get list of finished hikes', async function () {
    return agent.get('/api/getFinishedHikes')
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      })
  });
};

function obtainDistinctFinishedHikes(expectedHTTPStatus) {
  it('get list of finished hikes, without duplicates', async function () {
    return agent.get('/api/getDistinctFinishedHikes')
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      })
  });
};

function obtainFinishedHikesByHiker(expectedHTTPStatus, hiker_email) {
  it('get list of finished hikes by a specific hiker', async function () {
    return agent.get('/api/getFinishedHikesByHiker/'+hiker_email)
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      })
  });
};

/*async function logout() {
  await agent.delete('/api/sessions/current')
}

async function login() {
  await agent.post('/api/sessions')
      .send(userCredentials)
      .then(function (res) {
          res.should.have.status(200);
      });
}*/