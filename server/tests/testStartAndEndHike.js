const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const testDao = require('../test-dao');

const app = require('../index');
let agent = chai.request.agent(app); //.agent() is needed for keep cookies from one reuqent

describe("HikerHike test", () => {
  beforeEach(async () => {
    await testDao.run('DELETE FROM HikerHike');
    await testDao.run('DELETE FROM HikerHikeStatistics');
    await testDao.run("INSERT OR IGNORE INTO HikerHike(hiker, hike, start_time, end_time)\
            VALUES ('mario.rossi@gmail.com', \
            'Form Pian Belota to la Vacca', '15.00', '18.00'),\
            ('mario.rossi@gmail.com', \
            'Hike Monte Thabor', '12.00', null)");
    await testDao.run("INSERT OR IGNORE INTO HikerHikeStatistics(hiker, hike, times_completed, best_time)\
            VALUES ('mario.rossi@gmail.com', \
            'Form Pian Belota to la Vacca', 2, 60),\
            ('mario.rossi@gmail.com', \
            'Hike Monte Thabor', 6, 30)");
  });

  afterEach(async () => {                                 //better afterAll but I recived a "afterAll nt defined"
    await testDao.run('DELETE FROM HikerHike');
    await testDao.run('DELETE FROM HikerHikeStatistics');
    await testDao.run("INSERT OR IGNORE INTO HikerHike(hiker, hike, start_time, end_time)\
            VALUES ('mario.rossi@gmail.com', \
            'Form Pian Belota to la Vacca', '15.00', '18.00'),\
            ('mario.rossi@gmail.com', \
            'Hike Monte Thabor', '12.00', null)");
    await testDao.run("INSERT OR IGNORE INTO HikerHikeStatistics(hiker, hike, times_completed, best_time)\
            VALUES ('mario.rossi@gmail.com', \
            'Form Pian Belota to la Vacca', 2, 60),\
            ('mario.rossi@gmail.com', \
            'Hike Monte Thabor', 6, 30)");
  });

  startingHike(200, 'mario.rossi@gmail.com', 'Form Pian Belota to la Vacca', '15.00');
  startingHike(400, null, 'Form Pian Belota to la Vacca', '15.00');
  startingHike(400, 'mario.rossi@gmail.com', null, '15.00');
  startingHike(400, 'mario.rossi@gmail.com', 'Form Pian Belota to la Vacca', null);
  startingTwoTimeAnHike(422, 'mario.rossi@gmail.com', 'Form Pian Belota to la Vacca', '15.00')

  updatingEndTime(200, 'mario.rossi@gmail.com', 'Form Pian Belota to la Vacca', '15.00', '18.00');
  updatingEndTime(400, null, 'Form Pian Belota to la Vacca', '15.00', '18.00');
  updatingEndTime(400, 'mario.rossi@gmail.com', null, '15.00', '18.00');
  updatingEndTime(400, 'mario.rossi@gmail.com', 'Form Pian Belota to la Vacca', null, '18.00');

  terminateHikeFirstTime(200, 'mario.rossi@gmail.com', 'Form Pian Belota to la Vacca', 60);
  terminateHikeFirstTime(400, null, 'Form Pian Belota to la Vacca', 60);
  terminateHikeFirstTime(400, 'mario.rossi@gmail.com', null, 60);

  terminateHike(200, 'mario.rossi@gmail.com', 'Form Pian Belota to la Vacca', 60);
  terminateHike(400, null, 'Form Pian Belota to la Vacca', 60);
  terminateHike(400, 'mario.rossi@gmail.com', null, 60);

  flagFirstTime(200, 'mario.rossi@gmail.com', 'Form Pian Belota to la Vacca');

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

function startingTwoTimeAnHike(expectedHTTPStatus, hiker_email, hike_title, start_time) {
  it('start two time a hike', async function () {
    await testDao.run('DELETE FROM HikerHike');
    let reqBody = JSON.stringify({ hiker_email, hike_title, start_time });
    await agent.post('/api/startHike')
      .set('Content-Type', 'application/json')
      .send(reqBody);
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

function terminateHikeFirstTime(expectedHTTPStatus, hiker_email, hike_title, duration) {
  it('terminate an hike for the first time', async function () {
    await testDao.run('DELETE FROM HikerHikeStatistics');
    let reqBody = JSON.stringify({ hiker_email, hike_title, duration });
    return agent.post('/api/endHikeFirstTime')
      .set('Content-Type', 'application/json')
      .send(reqBody)
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      })
  });
}

function terminateHike(expectedHTTPStatus, hiker_email, hike_title, duration) {
  it('terminate an hike for the first time', async function () {
    let reqBody = JSON.stringify({ hiker_email, hike_title, duration });
    return agent.put('/api/endHike')
      .set('Content-Type', 'application/json')
      .send(reqBody)
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      })
  });
}

function flagFirstTime(expectedHTTPStatus, hiker_email, hike_title) {
  it('check if it is the first time to terminate this hike', async function () {
    return agent.get(`/api/checkFirstTime?hiker=${hiker_email}&hike=${hike_title}`)
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      })
  });
};

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