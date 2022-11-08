'use strict';

const sqlite = require('sqlite3');
const crypto = require('crypto');

// open database
const db = new sqlite.Database('oqm.db', (err) => {
  if (err) throw err;
});

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM USERS WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err)
        reject(err);
      else if (row === undefined)
        resolve({ error: 'User not found.' });
      else {
        // by default, the local strategy looks for "username": 
        // not to create confusion in server.js, we can create an object with that property
        const user = { id: row.id, username: row.email, name: row.name }
        resolve(user);
      }
    });
  });
};

//4.1 STEP PASSPORT-->Check credentials and HASHING PASSWORD with Node's crypto modules
exports.getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM USERS WHERE Email = ?';

    db.get(sql, [email], (err, row) => {

      if (err) {

        reject(err);
      }
      else if (row === undefined) {
        resolve(false);
      }
      else {
        const user = { id: row.Id, username: row.Email, name: row.Name, role: row.Role }; //NOTA BENE-->QUI NON DOBBIAMO METTERE LA PASSWORD!!-->vedi dopo perchè dobbiamo salvarla come HASH
        console.log(user)
        console.log(row.salt)
        //4.2 STEP PASSPORT-->HASHING PASSWORD
        crypto.scrypt(password, row.Salt, 32, function (err, hashedPassword) {
          if (err) reject(err);
          //4.3 STEP PASSPORT-->CHECK IF HASHED PASSWORD==STORED PASSWORD
          if (!crypto.timingSafeEqual(Buffer.from(row.Password, 'hex'), hashedPassword)){
            resolve(false);
          }
          else
            resolve(user);//Adesso ritorna al "server.js" per verificare come funziona il return cb(null,user)
        });
      }
    });
  });
};
