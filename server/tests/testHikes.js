const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const testDao = require('../test-dao');
const rocciamelone = require('../unit_tests/maps/rocciamelone').rocciamelone;
const carborant = require('../unit_tests/maps/Corborant-dal-buco-della-Marmotta').carborant;

const app = require('../index');
let agent = chai.request.agent(app); //.agent() is needed for keep cookies from one reuqent


function Hike(title, length, expected_time, ascent, difficulty, start_point, end_point, reference_points, description, gpx_track) {
  this.title = title;
  this.length = length;
  this.expected_time = expected_time;
  this.ascent = ascent;
  this.difficulty = difficulty;
  this.start_point_idPoint = start_point;
  this.end_point_idPoint = end_point;
  this.reference_points = reference_points;
  this.description = description;
  this.gpx_track = gpx_track;
}

function HikeNoRefPoints(title, length, expected_time, ascent, difficulty, start_point, end_point, description, gpx_track) {
  this.title = title;
  this.length = length;
  this.expected_time = expected_time;
  this.ascent = ascent;
  this.difficulty = difficulty;
  this.start_point_idPoint = start_point;
  this.end_point_idPoint = end_point;
  this.description = description;
  this.gpx_track = gpx_track;
}

//for inconsistency in db -> addHike and updateHike have the fields "start_point" and "end_point" while readHikes has "start_point_idPoint" and "end_point_idPoint"
function HikeWithFormatNo_idPoint(title, length, expected_time, ascent, difficulty, start_point, end_point, reference_points, description, gpx_track) {
  this.title = title;
  this.length = length;
  this.expected_time = expected_time;
  this.ascent = ascent;
  this.difficulty = difficulty;
  this.start_point = start_point;
  this.end_point = end_point;
  this.reference_points = reference_points;
  this.description = description;
  this.gpx_track = gpx_track;
}

function setStartPoint(hike, address, location, coordinates, type) {
  hike.start_point_address = address;
  hike.start_point_nameLocation = location;
  hike.start_point_coordinates = coordinates;
  hike.start_point_type = type;
}

function setEndPoint(hike, address, location, coordinates, type) {
  hike.end_point_address = address;
  hike.end_point_nameLocation = location;
  hike.end_point_coordinates = coordinates;
  hike.end_point_type = type;
}

describe("Hike test", () => {
  beforeEach(async () => {
    await testDao.run('DELETE FROM HikePoint');
    await testDao.run('DELETE FROM Points');
    await testDao.run('DELETE FROM Hikes');
    await testDao.run('DELETE FROM SQLITE_SEQUENCE');
  });

  afterEach(async () => {                                 //better afterAll but I recived a "afterAll nt defined"
    await testDao.run('DELETE FROM HikePoint');
    await testDao.run('DELETE FROM Points');
    await testDao.run('DELETE FROM Hikes');
    await testDao.run('DELETE FROM SQLITE_SEQUENCE');
    await testDao.run(`INSERT OR IGNORE INTO Hikes(title, length, expected_time, ascent, difficulty, start_point, end_point, reference_points, description, gpx_track)
            VALUES ('Hike#1', '5.0', '5', '5.0', 'Tourist', '1', '2',
            '2-3', 'First easy example hike', ?), 
            ('Hike#2', '10.0', '10', '10.0', 'Professional hiker', '3', '4',
            '4', 'Second example hike, very difficult', ?)`, [rocciamelone, carborant]);
    await testDao.run(`INSERT OR IGNORE INTO Points(address, nameLocation, gps_coordinates, type)
                            VALUES ('La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy',
                            'Hut#1', '45.177786,7.083372', 'Hut'), 
                            ('Nostra Signora del Rocciamelone, 585, Novalesa, Torino, Piedmont, 10059, Italy',
                            'Hut#2', '45.203531,7.07734', 'Hut'), 
                            ('327, Lago di San Bernolfo - Collalunga, Vinadio, Cuneo, Piedmont, Italy',
                            'Happy Parking Lot', '44.259583,7.039722', 'Parking Lot'), 
                            ('Vinadio, Cuneo, Piedmont, Italy',
                            'Sad Parking Lot', '44.249216,7.017648', 'Parking Lot')`);
    await testDao.run(`INSERT OR IGNORE INTO HikePoint(idPoint, titleHike)
                                            VALUES ('4', 'Hike#1'), 
                                            ('3', 'Hike#2'), 
                                            ('1', 'Hike#2'), 
                                            ('1', 'Hike#1')`);
  });

  addNewHike(200, 'Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 2, '2-3', 'First easy example hike', rocciamelone);
  addNewHike(400, null, 5.0, 5, 5.0, 'Tourist', 1, 2, '2-3', 'First easy example hike', rocciamelone);
  addNewHike(400, 'Hike#1', null, 5, 5.0, 'Tourist', 1, 2, '2-3', 'First easy example hike', rocciamelone);
  addNewHike(400, 'Hike#1', 5.0, null, 5.0, 'Tourist', 1, 2, '2-3', 'First easy example hike', rocciamelone);
  addNewHike(400, 'Hike#1', 5.0, 5, null, 'Tourist', 1, 2, '2-3', 'First easy example hike', rocciamelone);
  addNewHike(400, 'Hike#1', 5.0, 5, 5.0, null, 1, 2, '2-3', 'First easy example hike', rocciamelone);
  addNewHike(400, 'Hike#1', 5.0, 5, 5.0, 'Tourist', null, 2, '2-3', 'First easy example hike', rocciamelone);
  addNewHike(400, 'Hike#1', 5.0, 5, 5.0, 'Tourist', 1, null, '2-3', 'First easy example hike', rocciamelone);
  addNewHike(400, 'Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 2, null, 'First easy example hike', rocciamelone);
  addNewHike(400, 'Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 2, '2-3', null, rocciamelone);
  addNewHike(200, 'Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 2, '2-3', 'First easy example hike', null);
  addTwoTimeNewHike(422, 'Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 2, '2-3', 'First easy example hike', rocciamelone);
  obtainHikes(200);

});

function addNewHike(expectedHTTPStatus, title, length, expected_time, ascent, difficulty, start_point, end_point, reference_points, description, gpx_track) {
  it('add a new hike', async function () {
    const hike = new HikeWithFormatNo_idPoint(title, length, expected_time, ascent, difficulty, start_point, end_point, reference_points, description, gpx_track);
    reqBody = JSON.stringify({ hike });
    return agent.post('/api/newHike')
      .set('Content-Type', 'application/json')
      .send(reqBody)
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      })
  });
}

function addTwoTimeNewHike(expectedHTTPStatus, name, lastname, role, password, email, phoneNumber) {
  it('add two times a new hike', async function () {
    const hike = new HikeWithFormatNo_idPoint(title, length, expected_time, ascent, difficulty, start_point, end_point, reference_points, description, gpx_track);
    reqBody = JSON.stringify({ hike });
    await agent.post('/api/newHike')
      .set('Content-Type', 'application/json')
      .send(reqBody);
    return agent.post('/api/newHike')
      .set('Content-Type', 'application/json')
      .send(reqBody)
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      });
  });
}

function obtainHikes(expectedHTTPStatus) {
  it('get list of hikes', async function () {
    return agent.get('/api/getHikes')
      .then(function (res) {
        res.should.have.status(expectedHTTPStatus);
      })
  });
};