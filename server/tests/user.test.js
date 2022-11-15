'use strict';

const dao = require('../DAO');

function deleteUsers() {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM Users';
    db.run(query, (err) => {
      if (err) {
        reject(err);
      } else
        resolve("No users");
    });
  });
};

function insertUsers() {
  return new Promise((resolve, reject) => {
    const query = "INSERT OR IGNORE INTO Users(email, password, role, name, lastname, phone_number, salt)\
                  VALUES ('mario.rossi@gmail.com', \
                  'db17841d152b23d6feea12d9e385634e41312dc2f8971bb0a22853e2a3ff8ebe', \
                  'Hiker', 'Mario', 'Rossi', '+39 3486289468', 'f4d3ed63888571824485d5d37dbd9fec'),\
                  ('paulina.knight@gmail.com', \
                  'bcd7df7ca984af35ce385885af445b8481ab54c6b518da3d6970a6eeef0045a1', \
                  'LocalGuide', 'Paulina', 'Knight', '+39 3276958421', 'a5b9cde522b8c9fb127f173da288d699')";
    db.run(query, (err) => {
      if (err) {
        reject(err);
      } else
        resolve("No users");
    });
  });
};


function User(email, password, role, name, lastname, phone_number, salt) {
  this.email = email;
  this.password = password;
  this.role = role;
  this.name = name;
  this.lastname = lastname;
  this.salt = salt;
  this.phone_number = phone_number;
}

deleteUsers();
insertUsers();

describe("User test", ()=>{

});

test('test readUsers', async () => {
  const data = await dao.readUsers();
  const mario = new User('mario.rossi@gmail.com',
    'db17841d152b23d6feea12d9e385634e41312dc2f8971bb0a22853e2a3ff8ebe',
    'Hiker', 'Mario', 'Rossi', '+39 3486289468', 'f4d3ed63888571824485d5d37dbd9fec');
  const pauline = new User('paulina.knight@gmail.com',
    'bcd7df7ca984af35ce385885af445b8481ab54c6b518da3d6970a6eeef0045a1',
    'LocalGuide', 'Paulina', 'Knight', '+39 3276958421', 'a5b9cde522b8c9fb127f173da288d699');
  const users_check = [mario,pauline];
  expect(data).toEqual(users_check);
});

test('test deleteUser', async () => {
  const data = await dao.readUsers();
  const mario = new User('mario.rossi@gmail.com',
    'db17841d152b23d6feea12d9e385634e41312dc2f8971bb0a22853e2a3ff8ebe',
    'Hiker', 'Mario', 'Rossi', '+39 3486289468', 'f4d3ed63888571824485d5d37dbd9fec');
  const users_check = [mario];
  expect(data).not.toEqual(users_check);
  await dao.deleteUser('paulina.knight@gmail.com');
  expect(data).toEqual(users_check);
});