'use strict';

const dao = require('../DAO');
const testDao = require('../test-dao');

describe("Points test", () => {
  beforeEach(async () => {
    await testDao.run('DELETE FROM HikePoint');
    await testDao.run('DELETE FROM Points');
    await testDao.run('DELETE FROM SQLITE_SEQUENCE');
    await testDao.run("INSERT OR IGNORE INTO Points(address, nameLocation, gps_coordinates, type)\
                    VALUES ('La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy',\
                    'Hut#1', '45.177786,7.083372', 'Hut'), \
                    ('Nostra Signora del Rocciamelone, 585, Novalesa, Torino, Piedmont, 10059, Italy',\
                    'Hut#2', '45.203531,7.07734', 'Hut'), \
                    ('327, Lago di San Bernolfo - Collalunga, Vinadio, Cuneo, Piedmont, Italy',\
                    'Happy Parking Lot', '44.259583,7.039722', 'Parking Lot'), \
                    ('Vinadio, Cuneo, Piedmont, Italy',\
                    'Sad Parking Lot', '44.249216,7.017648', 'Parking Lot')");
  });

  afterAll(async () => {
    await testDao.run('DELETE FROM HikePoint');
    await testDao.run('DELETE FROM Points');
    await testDao.run('DELETE FROM SQLITE_SEQUENCE');
    await testDao.run("INSERT OR IGNORE INTO Points(address, nameLocation, gps_coordinates, type)\
                    VALUES ('La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy',\
                    'Hut#1', '45.177786,7.083372', 'Hut'), \
                    ('Nostra Signora del Rocciamelone, 585, Novalesa, Torino, Piedmont, 10059, Italy',\
                    'Hut#2', '45.203531,7.07734', 'Hut'), \
                    ('327, Lago di San Bernolfo - Collalunga, Vinadio, Cuneo, Piedmont, Italy',\
                    'Happy Parking Lot', '44.259583,7.039722', 'Parking Lot'), \
                    ('Vinadio, Cuneo, Piedmont, Italy',\
                    'Sad Parking Lot', '44.249216,7.017648', 'Parking Lot')");
    await testDao.run("INSERT OR IGNORE INTO HikePoint(idPoint, titleHike)\
                    VALUES ('4', 'Hike#1'), \
                    ('3', 'Hike#2'), \
                    ('1', 'Hike#2'), \
                    ('1', 'Hike#1')");
  });

  function Point(idPoint, address, nameLocation, gps_coordinates, type) {
    this.idPoint = idPoint;
    this.address = address;
    this.nameLocation = nameLocation;
    this.gps_coordinates = gps_coordinates;
    this.type = type;
  }

  test('test readPoints', async () => {
    const data = await dao.readPoints();
    const p1 = new Point(1, 'La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy',
                        'Hut#1', '45.177786,7.083372', 'Hut');
    const p2 = new Point(2, 'Nostra Signora del Rocciamelone, 585, Novalesa, Torino, Piedmont, 10059, Italy',
                        'Hut#2', '45.203531,7.07734', 'Hut');
    const p3 = new Point(3, '327, Lago di San Bernolfo - Collalunga, Vinadio, Cuneo, Piedmont, Italy',
                        'Happy Parking Lot', '44.259583,7.039722', 'Parking Lot');
    const p4 = new Point(4, 'Vinadio, Cuneo, Piedmont, Italy',
                        'Sad Parking Lot', '44.249216,7.017648', 'Parking Lot');
    const points_check = [p1,p2,p3,p4];
    expect(data).toEqual(points_check);
  });

  test('test readPointById', async () => {
    const data = await dao.readPointById(2);
    const p2 = new Point(2, 'Nostra Signora del Rocciamelone, 585, Novalesa, Torino, Piedmont, 10059, Italy',
                        'Hut#2', '45.203531,7.07734', 'Hut');
    expect(data).toEqual(p2);
  });

  test('test readPointById without match', async () => {
    const data = await dao.readPointById(30);
    const check = "NOT found";
    expect(data.error).toEqual(check);
  });

  test('test deletePoint', async () => {
    const data = await dao.readPoints();
    const p1 = new Point(1, 'La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy',
                        'Hut#1', '45.177786,7.083372', 'Hut');
    const p2 = new Point(2, 'Nostra Signora del Rocciamelone, 585, Novalesa, Torino, Piedmont, 10059, Italy',
                        'Hut#2', '45.203531,7.07734', 'Hut');
    const p3 = new Point(3, '327, Lago di San Bernolfo - Collalunga, Vinadio, Cuneo, Piedmont, Italy',
                        'Happy Parking Lot', '44.259583,7.039722', 'Parking Lot');
    const p4 = new Point(4, 'Vinadio, Cuneo, Piedmont, Italy',
                        'Sad Parking Lot', '44.249216,7.017648', 'Parking Lot');
    const points_check = [p1,p2,p3,p4];
    expect(data).toEqual(points_check);
    const check = await dao.deletePoint(p2.idPoint);
    expect(check).toBe(true);
    const newData = await dao.readPoints();
    expect(data).not.toEqual(newData);
  });

  test('test addPoint', async () => {
    await testDao.run('DELETE FROM Points');
    await testDao.run('DELETE FROM SQLITE_SEQUENCE');
    const p1 = new Point(1, 'La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy',
                        'Hut#1', '45.177786,7.083372', 'Hut');
    await dao.addPoint(p1);
    const data = await dao.readPoints();
    const points_check = [p1];
    expect(data).toEqual(points_check);
  });

  test('test addPoint, double insert same address', async () => {     
    await testDao.run('DELETE FROM Points');
    await testDao.run('DELETE FROM SQLITE_SEQUENCE');
    const p1 = new Point(1, 'La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy',
                        'Hut#1', '45.177786,7.083372', 'Hut');
    const p2 = new Point(2, 'La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy',
                        'Hut#1', '45.1234786,7.36457', 'Hut');
    await dao.addPoint(p1);
    const data = await dao.readPoints();
    const points_check = [p1];
    expect(data).toEqual(points_check);
    try {
      await dao.addPoint(p2);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: UNIQUE constraint failed: Points.address");
    }  
  });

  test('test addPoint, double insert same coodrinates', async () => {     
    await testDao.run('DELETE FROM Points');
    await testDao.run('DELETE FROM SQLITE_SEQUENCE');
    const p1 = new Point(1, 'La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy',
                        'Hut#1', '45.177786,7.083372', 'Hut');
    const p2 = new Point(2, 'La Casa, GTA / 529 / SI, Ricortola, Mompantero, Milano, Piedmont, 10059, Italy',
                        'Hut#1', '45.177786,7.083372', 'Hut');
    await dao.addPoint(p1);
    const data = await dao.readPoints();
    const points_check = [p1];
    expect(data).toEqual(points_check);
    try {
      await dao.addPoint(p2);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: UNIQUE constraint failed: Points.gps_coordinates");
    }  
  });

  test('test addPoint wrong number of fields', async () => {   
    await testDao.run('DELETE FROM Points');
    await testDao.run('DELETE FROM SQLITE_SEQUENCE');
    const p1 = new Point(1, 'La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy',
                        'Hut#1', 'Hut');
    try {
      await dao.addPoint(p1);
      const data = await dao.readPointById(1);
      expect(data.address).toBe('La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy');
		  expect(data.nameLocation).toBe('Hut#1');
		  expect(data.gps_coordinates).toBe('Hut');
		  expect(data.type).toBe(null);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Points.type");    
    }
  });

  test('test addPoint wrong address', async () => {   
    await testDao.run('DELETE FROM Points');
    await testDao.run('DELETE FROM SQLITE_SEQUENCE');
    const p1 = new Point(1, null,
                        'Hut#1', '45.177786,7.083372', 'Hut');
    try {
      await dao.addPoint(p1);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Points.address");  
    }
  });

  /*test('test addPoint wrong location', async () => {   
    await testDao.run('DELETE FROM Points');
    await testDao.run('DELETE FROM SQLITE_SEQUENCE');
    const p1 = new Point(1, 'La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy',
                        null, '45.177786,7.083372', 'Hut');
    try {
      await dao.addPoint(p1);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Points.nameLocation");  
    }
  });*/

  test('test addPoint wrong coordinates', async () => {   
    await testDao.run('DELETE FROM Points');
    await testDao.run('DELETE FROM SQLITE_SEQUENCE');
    const p1 = new Point(1, 'La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy',
                        'Hut#1', null, 'Hut');
    try {
      await dao.addPoint(p1);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Points.gps_coordinates");  
    }
  });

  test('test updatePoint', async () => {
    const newP1 = new Point(1, 'La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy',
                        'Hut#5', '45.177786,7.083372', 'Parking Lot');
    const check = await dao.updatePoint(1, newP1);
    expect(check).toBe(true);
    const data = await dao.readPoints();
    const point_check = data[0];
    expect(point_check.type).not.toBe("Hut");
    expect(point_check.type).toBe("Parking Lot");
    expect(point_check.nameLocation).not.toBe("Hut#1");
    expect(point_check.nameLocation).toBe("Hut#5");
  });

  test('test updatePointAddress', async () => {
    const newP1 = new Point(1, 'Ricortola, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy',
                        'Hut#1', '45.177786,7.083372', 'Hut');
    const check = await dao.updatePoint(1, newP1);
    expect(check).toBe(true);
    const data = await dao.readPoints();
    const point_check = data[0];
    expect(point_check.address).not.toBe("La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy");
    expect(point_check.address).toBe("Ricortola, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy");
  });

  test('test updatePointLocation', async () => {
    const newP1 = new Point(1, 'La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy',
                        'Hut#5', '45.177786,7.083372', 'Hut');
    const check = await dao.updatePoint(1, newP1);
    expect(check).toBe(true);
    const data = await dao.readPoints();
    const point_check = data[0];
    expect(point_check.nameLocation).not.toBe("Hut#1");
    expect(point_check.nameLocation).toBe("Hut#5");
  });

  test('test updatePointCoordinates', async () => {
    const newP1 = new Point(1, 'La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy',
                        'Hut#5', '45.1722346,9.083372', 'Hut');
    const check = await dao.updatePoint(1, newP1);
    expect(check).toBe(true);
    const data = await dao.readPoints();
    const point_check = data[0];
    expect(point_check.gps_coordinates).not.toBe("45.177786,7.083372");
    expect(point_check.gps_coordinates).toBe("45.1722346,9.083372");
  });

  test('test updatePointType', async () => {
    const newP1 = new Point(1, 'La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy',
                        'Hut#1', '45.177786,7.083372', 'Parking Lot');
    const check = await dao.updatePoint(1, newP1);
    expect(check).toBe(true);
    const data = await dao.readPoints();
    const point_check = data[0];
    expect(point_check.type).not.toBe("Hut");
    expect(point_check.type).toBe("Parking Lot");
  });
      
  test('test updatePoint wrong number of fields', async () => {
    const newP1 = new Point(1, 'La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy',
                        'Hut#5', '45.177786,7.083372');
    try {
      await await dao.updatePoint(1, newP1);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Points.type");  
    }
  });

  test('test updatePointAddress wrong', async () => {
    const newP1 = new Point(1, null,
                        'Hut#1', '45.177786,7.083372', 'Hut');
    try {
      await await dao.updatePoint(1, newP1);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Points.address");  
    }
  });

  test('test updatePointLocation wrong', async () => {
    const newP1 = new Point(1, 'La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy',
                        null, '45.177786,7.083372', 'Hut');
    try {
      await await dao.updatePoint(1, newP1);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Points.nameLocation");  
    }
  });

  test('test updatePointCoordinates wrong', async () => {
    const newP1 = new Point(1, 'La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy',
                        'Hut#5', null, 'Hut');
    try {
      await await dao.updatePoint(1, newP1);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Points.gps_coordinates");  
    }
  });

  test('test readHuts', async () => {
    const data = await dao.readHuts();
    const p1 = new Point(1, 'La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy',
                        'Hut#1', '45.177786,7.083372', 'Hut');
    const p2 = new Point(2, 'Nostra Signora del Rocciamelone, 585, Novalesa, Torino, Piedmont, 10059, Italy',
                        'Hut#2', '45.203531,7.07734', 'Hut');
    const points_check = [p1,p2];
    expect(data).toEqual(points_check);
  });

});