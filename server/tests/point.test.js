'use strict';

const dao = require('../DAO');
const testDao = require('../test-dao');

// PROBLEM ->  I think that the tests are right, but there is a problem with the autoincrement id.
//             when I do beforeEach for reset db before a test the new points have other ids and the tests fail

describe("Points test", () => {
  beforeEach(async () => {
    await testDao.run('DELETE FROM Points');
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
    await testDao.run('DELETE FROM Points');
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

  function Point(id, address, nameLocation, gps_coordinates, type) {
    this.id = id;
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
    const check = await dao.deletePoint(p2.id);
    expect(check).toBe(true);
    const newData = await dao.readPoints();
    expect(data).not.toEqual(newData);
  });

  test('test addPoint', async () => {
    await testDao.run('DELETE FROM Points');
    const p1 = new Point(1, 'La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy',
                        'Hut#1', '45.177786,7.083372', 'Hut');
    const check = await dao.addPoint(p1);
    expect(check).toBe(true);
    const data = await dao.readPoints();
    const points_check = [p1];
    expect(data).toEqual(points_check);
  });

  test('test updatePoint', async () => {
    const newP1 = new Point(1, 'La Riposa, GTA / 529 / SI, Trucco, Mompantero, Torino, Piedmont, 10059, Italy',
                        'Hut#1', '45.177786,7.083372', 'Parking Lot');
    const check = await dao.updatePoint(1, newP1);
    expect(check).toBe(true);
    const data = await dao.readPoints();
    const point_check = data[0];
    expect(point_check.type).not.toBe("Hut");
    expect(point_check.type).toBe("Parking Lot");
  });

});