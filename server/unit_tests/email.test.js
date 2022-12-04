'use strict';

const dao = require('../DAO');
const testDao = require('../test-dao');

describe("User test", () => {
	beforeEach(async () => {
		await testDao.run('DELETE FROM Verification_Code');
	});

	afterAll(async () => {
		await testDao.run('DELETE FROM Verification_Code');
	});

	function Row(email, code) {
    this.email = email;
    this.code = code;
  }

	test('test addCode', async () => {
		const row = new Row('mario@gmail.com', '1234');
		const check = await dao.addCode(row.email, row.code);
    expect(check).toBe(true);
  });

	test('test addCode, no email', async () => {
		const row = new Row(null, '1234');
		try{
			await dao.addCode(row.email, row.code);
		} catch (error) {
			expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Verification_Code.email");
		}
  });

	test('test addCode, no code', async () => {
		const row = new Row('mario@gmail.com', null);
		try{
			await dao.addCode(row.email, row.code);
		} catch (error) {
			expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Verification_Code.code");
		}
  });

	test('test getCode', async () => {
		const row = new Row('mario@gmail.com', '1234');
		await dao.addCode(row.email, row.code);
    const data = await dao.getCode(row.email);
    expect(data).toEqual(row);
  });

  test('test getCode without match', async () => {
    const data = await dao.getCode('erfergfer@gmail.com');
    const check = "NOT found";
    expect(data.error).toEqual(check);
  });

	test('test deleteCode', async () => {
		const row = new Row('mario@gmail.com', '1234');
		await dao.addCode(row.email, row.code);
    const check = await dao.deleteCode(row.email);
		expect(check).toBe(true);
  });

	test('test updateCode', async () => {
		const row = new Row('mario@gmail.com', '1234');
		await dao.addCode(row.email, row.code);
		const check = await dao.updateCode('marionew@gmail.com', '4321');
    expect(check).toBe(true);
  });

	test('test updateCode, no email', async () => {
		const row = new Row('mario@gmail.com', '1234');
		await dao.addCode(row.email, row.code);
		try{
			await dao.updateCode(null, row.code);
		} catch (error) {
			expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Verification_Code.email");
		}
  });

	test('test updateCode, no code', async () => {
		const row = new Row('mario@gmail.com', '1234');
		await dao.addCode(row.email, row.code);
		try{
			await dao.updateCode(row.email, null);
		} catch (error) {
			expect(error.toString()).toBe("Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: Verification_Code.code");
		}
  });

});