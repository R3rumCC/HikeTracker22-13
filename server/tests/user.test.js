'use strict';

const dao = require('../DAO');
const testDao = require('../test-dao');

describe("User test", () => {
  beforeEach(async () => {
    await testDao.run('DELETE FROM Users');
    await testDao.run("INSERT OR IGNORE INTO Users(email, password, role, name, lastname, phone_number, salt)\
            VALUES ('mario.rossi@gmail.com', \
            'db17841d152b23d6feea12d9e385634e41312dc2f8971bb0a22853e2a3ff8ebe', \
            'Hiker', 'Mario', 'Rossi', '+39 3486289468', 'f4d3ed63888571824485d5d37dbd9fec'),\
            ('paulina.knight@gmail.com', \
            'bcd7df7ca984af35ce385885af445b8481ab54c6b518da3d6970a6eeef0045a1', \
            'LocalGuide', 'Paulina', 'Knight', '+39 3276958421', 'a5b9cde522b8c9fb127f173da288d699')");
  });

  afterAll(async () => {
    await testDao.run('DELETE FROM Users');
    await testDao.run("INSERT OR IGNORE INTO Users(email, password, role, name, lastname, phone_number, salt)\
            VALUES ('mario.rossi@gmail.com', \
            'db17841d152b23d6feea12d9e385634e41312dc2f8971bb0a22853e2a3ff8ebe', \
            'Hiker', 'Mario', 'Rossi', '+39 3486289468', 'f4d3ed63888571824485d5d37dbd9fec'),\
            ('paulina.knight@gmail.com', \
            'bcd7df7ca984af35ce385885af445b8481ab54c6b518da3d6970a6eeef0045a1', \
            'LocalGuide', 'Paulina', 'Knight', '+39 3276958421', 'a5b9cde522b8c9fb127f173da288d699')");
  });

  function User(email, password, role, name, lastname, phone_number, salt) {
    this.email = email;
    this.password = password;
    this.role = role;
    this.name = name;
    this.lastname = lastname;
    this.salt = salt;
    this.phone_number = phone_number;
  }

  test('test readUsers', async () => {
    const data = await dao.readUsers();
    const mario = new User('mario.rossi@gmail.com',
      'db17841d152b23d6feea12d9e385634e41312dc2f8971bb0a22853e2a3ff8ebe',
      'Hiker', 'Mario', 'Rossi', '+39 3486289468', 'f4d3ed63888571824485d5d37dbd9fec');
    const pauline = new User('paulina.knight@gmail.com',
      'bcd7df7ca984af35ce385885af445b8481ab54c6b518da3d6970a6eeef0045a1',
      'LocalGuide', 'Paulina', 'Knight', '+39 3276958421', 'a5b9cde522b8c9fb127f173da288d699');
    const users_check = [mario, pauline];
    expect(data).toEqual(users_check);
  });

  test('test deleteUser', async () => {
    const data = await dao.readUsers();
    const mario = new User('mario.rossi@gmail.com',
      'db17841d152b23d6feea12d9e385634e41312dc2f8971bb0a22853e2a3ff8ebe',
      'Hiker', 'Mario', 'Rossi', '+39 3486289468', 'f4d3ed63888571824485d5d37dbd9fec');
    const pauline = new User('paulina.knight@gmail.com',
      'bcd7df7ca984af35ce385885af445b8481ab54c6b518da3d6970a6eeef0045a1',
      'LocalGuide', 'Paulina', 'Knight', '+39 3276958421', 'a5b9cde522b8c9fb127f173da288d699');
    const users_check = [mario, pauline];
    expect(data).toEqual(users_check);
    const check = await dao.deleteUser(pauline.email);
    expect(check).toBe(true);
    const newData = await dao.readUsers();
    expect(data).not.toEqual(newData);
  });

  test('test addUser', async () => {
    await testDao.run('DELETE FROM Users');
    const mario = new User('mario.rossi@gmail.com',
      'db17841d152b23d6feea12d9e385634e41312dc2f8971bb0a22853e2a3ff8ebe',
      'Hiker', 'Mario', 'Rossi', '+39 3486289468', 'f4d3ed63888571824485d5d37dbd9fec');
    const check = await dao.addUser(mario.email, mario.password, mario.role, mario.name, mario.lastname, mario.phone_number, mario.salt);
    expect(check).toBe(true);
    const data = await dao.readUsers();
    const users_check = [mario];
    expect(data).toEqual(users_check);
  });

});