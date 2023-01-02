'use strict';

const dao = require('../DAO');
const testDao = require('../test-dao');

describe("HikerHike test", () => {
  beforeEach(async () => {
    await testDao.run('DELETE FROM HikerHike');
    await testDao.run("INSERT OR IGNORE INTO HikerHike(hiker, hike, start_time, end_time)\
            VALUES ('mario.rossi@gmail.com', \
            'Form Pian Belota to la Vacca', '15.00', '18.00'),\
            ('mario.rossi@gmail.com', \
            'Hike Monte Thabor', '12.00', null)");
  });

  afterAll(async () => {
    await testDao.run('DELETE FROM HikerHike');
    await testDao.run("INSERT OR IGNORE INTO HikerHike(hiker, hike, start_time, end_time)\
            VALUES ('mario.rossi@gmail.com', \
            'Form Pian Belota to la Vacca', '15.00', '18.00'),\
            ('mario.rossi@gmail.com', \
            'Hike Monte Thabor', '12.00', null)");
  });

  function RowStart(hiker, hike, start_time) {
    this.hiker = hiker;
    this.hike = hike;
    this.start_time = start_time;
  }

  function Row(hiker, hike, start_time, end_time) {
    this.hiker = hiker;
    this.hike = hike;
    this.start_time = start_time;
    this.end_time = end_time;
  }

  function RowNoHiker(hike, start_time, end_time) {
    this.hike = hike;
    this.start_time = start_time;
    this.end_time = end_time;
  }

  test('test startHike', async () => {
    await testDao.run('DELETE FROM HikerHike');
    let start = new RowStart('mario.rossi@gmail.com', 'Form Pian Belota to la Vacca', '15.00');
    const check = await dao.startHike(start.hiker, start.hike, start.start_time);
    expect(check).toBe(true);
  });
  
  test('test startHike wrong number of fields', async () => {   
    await testDao.run('DELETE FROM HikerHike');
    const start = new RowStart('mario.rossi@gmail.com', '15.00');
    try {
      await dao.startHike(start.hiker, start.hike, start.start_time);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: HikerHike.start_time");
    }
  });

  test('test startHike wrong hiker', async () => {
    await testDao.run('DELETE FROM HikerHike');
    const start = new RowStart(null, 'Form Pian Belota to la Vacca', '15.00');
    try {
      await dao.startHike(start.hiker, start.hike, start.start_time);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: HikerHike.hiker");
    }
  });

  test('test startHike wrong hike', async () => {
    await testDao.run('DELETE FROM HikerHike');
    const start = new RowStart('mario.rossi@gmail.com', null, '15.00');
    try {
      await dao.startHike(start.hiker, start.hike, start.start_time);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: HikerHike.hike");
    }
  });

  test('test updateEndTime', async () => {
    const end = new Row('mario.rossi@gmail.com', 'Hike Monte Thabor', '12.00', '14.00');
    const check = await dao.updateHikeEndTime(end.hiker, end.hike, end.start_time, end.end_time);
    expect(check).toBe(true);
    const data = await dao.getFinishedHikes();
    const r2 = new Row('mario.rossi@gmail.com', 'Form Pian Belota to la Vacca', '15.00', '18.00');
    const hikes_check = [r2, end];
    expect(data).toEqual(hikes_check);
  });

  test('test updateEndTime wrong hiker', async () => {
    await testDao.run('DELETE FROM HikerHike');
    const end = new Row(null, 'Hike Monte Thabor', '12.00', '14.00');
    try {
      await dao.startHike(end.hiker, end.hike, end.end_time);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: HikerHike.hiker");
    }
  });

  test('test updateEndTime wrong hike', async () => {
    await testDao.run('DELETE FROM HikerHike');
    const end = new Row('mario.rossi@gmail.com', null, '12.00', '14.00');
    try {
      await dao.startHike(end.hiker, end.hike, end.end_time);
    } catch (error) {
      expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: HikerHike.hike");
    }
  });

  test('test getOnGoingHike', async () => {
    const r2 = new Row('mario.rossi@gmail.com', 'Hike Monte Thabor', '12.00', null); 
    const data = await dao.getOnGoingHike('mario.rossi@gmail.com');
    const hike_check = [{hike: 'Hike Monte Thabor', start_time:'12.00'}];
    expect(data).toEqual(hike_check);
  });

  test('test getFinishedHikes', async () => {
    const r1 = new Row('mario.rossi@gmail.com', 'Form Pian Belota to la Vacca', '15.00', '18.00');
    //const r2 = new Row('mario.rossi@gmail.com', 'Hike Monte Thabor', '12.00', null); //not finished
    const data = await dao.getFinishedHikes();
    const hikes_check = [r1];
    expect(data).toEqual(hikes_check);
  });

  test('test getDistinctFinishedHikes', async () => {
    const r1 = new Row('mario.rossi@gmail.com', 'Form Pian Belota to la Vacca', '15.00', '18.00');
    let data = await dao.getDistinctFinishedHikes();
    const hikes_check = [{hike: r1.hike}];
    expect(data).toEqual(hikes_check);
    await dao.startHike('mario.rossi@gmail.com', 'Form Pian Belota to la Vacca', '8.00');
    await dao.updateHikeEndTime('mario.rossi@gmail.com', 'Form Pian Belota to la Vacca', '8.00', '13.00');
    data = await dao.getDistinctFinishedHikes();
    expect(data).toEqual(hikes_check);
  });

  test('test getFinishedHikesByHiker', async () => {
    const r1 = new RowNoHiker('Form Pian Belota to la Vacca', '15.00', '18.00');
    const r2 = new RowNoHiker('Hike Monte Thabor', '12.00', '14.00');
    await dao.updateHikeEndTime('mario.rossi@gmail.com', 'Hike Monte Thabor', '12.00', '14.00');
    const data = await dao.getFinishedHikesByHiker('mario.rossi@gmail.com');
    const hikes_check = [r1,r2];
    expect(data).toEqual(hikes_check);
  });

});