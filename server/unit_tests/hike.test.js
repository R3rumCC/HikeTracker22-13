'use strict';

const dao = require('../DAO');
const testDao = require('../test-dao');
const rocciamelone = require('./maps/rocciamelone').rocciamelone;
const carborant = require('./maps/Corborant-dal-buco-della-Marmotta').carborant;

describe("Hike test", () => {
  beforeEach(async () => {
    await testDao.run('DELETE FROM HikePoint');
    await testDao.run('DELETE FROM Points');
    await testDao.run('DELETE FROM Hikes');
    await testDao.run('DELETE FROM SQLITE_SEQUENCE');
    await testDao.run(`INSERT OR IGNORE INTO Hikes(title, length, expected_time, ascent, difficulty, start_point, end_point, reference_points, description, gpx_track)
            VALUES ('Hike#1', '5.0', '5', '5.0', 'Tourist', '1', '2',
            '2-3', 'First easy example hike', ?), 
            ('Hike#2', '10.0', '10', '10.0', 'Professional hiker', '3', '4',
            '4', 'Second example hike, very difficult', ?)`,[rocciamelone, carborant]);
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

  afterAll(async () => {
    await testDao.run('DELETE FROM HikePoint');
    await testDao.run('DELETE FROM Points');
    await testDao.run('DELETE FROM Hikes');
    await testDao.run('DELETE FROM SQLITE_SEQUENCE');
    await testDao.run(`INSERT OR IGNORE INTO Hikes(title, length, expected_time, ascent, difficulty, start_point, end_point, reference_points, description, gpx_track)
            VALUES ('Hike#1', '5.0', '5', '5.0', 'Tourist', '1', '2',
            '2-3', 'First easy example hike', ?), 
            ('Hike#2', '10.0', '10', '10.0', 'Professional hiker', '3', '4',
            '4', 'Second example hike, very difficult', ?)`,[rocciamelone, carborant]);
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

  test('test readHikes', async () => {
    const data = await dao.readHikes();
    const hike1 = new HikeNoRefPoints('Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 2, 'First easy example hike', rocciamelone);
    setStartPoint(hike1, "La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy",
      "Hut#1", "45.177786,7.083372", "Hut");
    setEndPoint(hike1, "Nostra Signora del Rocciamelone, 585, Novalesa, Torino, Piedmont, 10059, Italy",
      "Hut#2", "45.203531,7.07734", "Hut");
    const hike2 = new HikeNoRefPoints('Hike#2', 10.0, 10, 10.0, 'Professional hiker', 3, 4, 'Second example hike, very difficult', carborant);
    setStartPoint(hike2, "327, Lago di San Bernolfo - Collalunga, Vinadio, Cuneo, Piedmont, Italy",
      "Happy Parking Lot", "44.259583,7.039722", "Parking Lot");
    setEndPoint(hike2, "Vinadio, Cuneo, Piedmont, Italy",
      "Sad Parking Lot", "44.249216,7.017648", "Parking Lot");
    const hikes_checks = [hike1, hike2];
    expect(data).toEqual(hikes_checks);
  });
  
  test('test deleteHike', async () => {
    let data = await dao.readHikes();
    const hike1 = new HikeNoRefPoints('Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 2, 'First easy example hike', rocciamelone);
    setStartPoint(hike1, "La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy",
      "Hut#1", "45.177786,7.083372", "Hut");
    setEndPoint(hike1, "Nostra Signora del Rocciamelone, 585, Novalesa, Torino, Piedmont, 10059, Italy",
      "Hut#2", "45.203531,7.07734", "Hut");
      const hike2 = new HikeNoRefPoints('Hike#2', 10.0, 10, 10.0, 'Professional hiker', 3, 4, 'Second example hike, very difficult', carborant);
    setStartPoint(hike2, "327, Lago di San Bernolfo - Collalunga, Vinadio, Cuneo, Piedmont, Italy",
        "Happy Parking Lot", "44.259583,7.039722", "Parking Lot");
    setEndPoint(hike2, "Vinadio, Cuneo, Piedmont, Italy",
        "Sad Parking Lot", "44.249216,7.017648", "Parking Lot");
    const hikes_checks = [hike1, hike2];
    expect(data).toEqual(hikes_checks);
    const check = await dao.deleteHike(hike1.title);
    expect(check).toBe(true);
    data = await dao.readHikes();
    expect(data).toEqual([hike2]);
  });

  test('test addHike', async () => {  
    await testDao.run('DELETE FROM HikePoint');             
    await testDao.run('DELETE FROM Hikes');
    let hike = new HikeWithFormatNo_idPoint('Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 2, '2-3', 'First easy example hike', rocciamelone);
    const check = await dao.addHike(hike);
    expect(check).toBe(true);
    const data = await dao.readHikes();
    hike = new HikeNoRefPoints('Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 2, 'First easy example hike', rocciamelone);
    setStartPoint(hike, "La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy",
      "Hut#1", "45.177786,7.083372", "Hut");
    setEndPoint(hike, "Nostra Signora del Rocciamelone, 585, Novalesa, Torino, Piedmont, 10059, Italy",
      "Hut#2", "45.203531,7.07734", "Hut");
    expect(data).toEqual([hike]);
  });

  test('test readListOfReferencesPoints', async () => {
    const hike = new Hike('Hike#1', 5.0, 5, 5.0, 'Tourist', 1, 2, '2-3', 'First easy example hike', rocciamelone);
    const ref = await dao.readListOfReferencePoints(hike.title);
    let refer_points = [];
    for (const rp of ref.reference_points.split("-")) {
      const idPoint = parseInt(rp);
      const refPoint = await dao.readPointById(idPoint);
      refer_points.push(refPoint);
    }
    const check = [2, 3];
    expect(check[0]).toEqual(refer_points[0].idPoint);
    expect(check[1]).toEqual(refer_points[1].idPoint);
  });

  test('test updateHike', async () => {               
    let newHike = new HikeWithFormatNo_idPoint('Hike#5', 7.0, 5, 6.0, 'Tourist', 1, 2, '2-3-4', 'First easy example hike', rocciamelone);
    const check = await dao.updateHike('Hike#1', newHike);
    expect(check).toBe(true);
    const data = await dao.readHikes();
    newHike = new HikeNoRefPoints('Hike#5', 7.0, 5, 6.0, 'Tourist', 1, 2, 'First easy example hike', rocciamelone);
    setStartPoint(newHike, "La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy",
      "Hut#1", "45.177786,7.083372", "Hut");
    setEndPoint(newHike, "Nostra Signora del Rocciamelone, 585, Novalesa, Torino, Piedmont, 10059, Italy",
      "Hut#2", "45.203531,7.07734", "Hut");
    const hike2 = new HikeNoRefPoints('Hike#2', 10.0, 10, 10.0, 'Professional hiker', 3, 4, 'Second example hike, very difficult', carborant);
    setStartPoint(hike2, "327, Lago di San Bernolfo - Collalunga, Vinadio, Cuneo, Piedmont, Italy",
        "Happy Parking Lot", "44.259583,7.039722", "Parking Lot");
    setEndPoint(hike2, "Vinadio, Cuneo, Piedmont, Italy",
        "Sad Parking Lot", "44.249216,7.017648", "Parking Lot");
    expect(data).toEqual([newHike,hike2]);
  });

});