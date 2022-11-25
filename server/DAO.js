'use strict';

const sqlite = require('sqlite3');
//const { Resolver } = require('dns/promises');

const db = new sqlite.Database('hikeTracker.db', (err) => {
  if (err) {
    throw err;
  }
});

/*************USERS CRUD************/
function readUsers() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM USERS';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Users WHERE email=?';
    db.get(sql, [email], (err, rows) => {
      if (err) {
        reject(err);
      } if (rows == undefined)
        resolve({ error: 'NOT found' });
      else {
        resolve(rows);
      }
    });
  });
}

function addUser(email, password, role, name, lastname, phone_number, salt) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO USERS (email, password, role, name, lastname, phone_number, salt) VALUES(?,?,?,?,?,?,?)';
    db.run(sql, email, password, role, name, lastname, phone_number, salt, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

function updateUserRole(email, role) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE USERS SET role = ? where email = ?';
    db.run(sql, role, email, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}

function deleteUser(email) {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM USERS WHERE email = ?';
    db.run(query, email, (err) => {
      if (err) {
        reject(err);
      } else
        resolve(true);
    });
  });
};

/*************HIKES CRUD************/

function readHikes() {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT title,
        length,
        expected_time,
        ascent,
        difficulty,
        description,
        gpx_track,
        SP.idPoint AS start_point_idPoint,
        SP.address AS start_point_address,
        SP.nameLocation AS start_point_nameLocation,
        SP.gps_coordinates AS start_point_coordinates,
        SP.type AS start_point_type,
        EP.idPoint AS end_point_idPoint,
        EP.address AS end_point_address,
        EP.nameLocation AS end_point_nameLocation,
        EP.gps_coordinates AS end_point_coordinates,
        EP.type AS end_point_type
      FROM Hikes
      JOIN Points SP
      ON Hikes.start_point = SP.idPoint
      JOIN Points EP
      ON Hikes.end_point = EP.idPoint
      ;
    `;
    db.all(sql, (err, hikes) => {
      if (err) {
        reject(err);
      } else {
        resolve(hikes)
      }
    });
  });
}

function readListOfReferencePoints(title) { // RP for a given hike
  return new Promise((resolve, reject) => {
    const sql = `SELECT reference_points
    FROM Hikes H, HikePoint HP, Points P
    WHERE H.title = HP.titleHike
    AND title = ?`;
    db.get(sql, [title], (err, rp) => {
      if (err) {
        reject(err);
      } else {
        resolve(rp)
      }
    });
  });
}

function addHike(hike) {
  return new Promise((resolve, reject) => {
    console.log('Inside addHike, DAO, server side');
    const sql = 'INSERT INTO HIKES (title, length, expected_time, ascent, difficulty, start_point, end_point, description, reference_points, gpx_track) VALUES(?,?,?,?,?,?,?,?,?,?)';
    db.run(sql, hike.title, hike.length, hike.expected_time, hike.ascent, hike.difficulty, hike.start_point, hike.end_point, hike.description, hike.reference_points, hike.gpx_track, (err, rows) => {
      if (err) {
        console.log(err)
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

function updateHikeTitle(oldName, newName) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE HIKES SET title = ? where title = ?';
    db.run(sql, newName, oldName, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}

function updateHikeLength(title, length) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE HIKES SET length = ? where title = ?';
    db.run(sql, length, title, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}
function updateHikeET(title, expected_time) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE HIKES SET expected_time = ? where title = ?';
    db.run(sql, expected_time, title, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}
function updateHikeAscent(title, ascent) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE HIKES SET ascent = ? where title = ?';
    db.run(sql, ascent, title, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}
function updateHikeDifficulty(title, difficulty) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE HIKES SET difficulty = ? where title = ?';
    db.run(sql, difficulty, title, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}
function updateHikeStartPoint(title, start_point) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE HIKES SET start_point = ? where title = ?';
    db.run(sql, start_point, title, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}
function updateHikeEndPoint(title, end_point) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE HIKES SET end_point = ? where title = ?';
    db.run(sql, end_point, title, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}
function updateHikeRefPoint(title, reference_points) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE HIKES SET reference_points = ? where title = ?';
    db.run(sql, reference_points, title, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}
function updateHikeDescription(title, description) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE HIKES SET description = ? where title = ?';
    db.run(sql, description, title, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}
function updateHike(oldHikeTitle, newHike) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE HIKES SET title = ?, length = ?, expected_time = ?, ascent = ?, difficulty = ?, start_point = ?, end_point = ?, reference_points = ?, description = ? where title = ?';
    db.run(sql, newHike.title, newHike.length, newHike.expected_time, newHike.ascent, newHike.difficulty, newHike.start_point, newHike.end_point, newHike.reference_points, newHike.description, oldHikeTitle, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}
function deleteHike(title) {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM HIKES WHERE title = ?';
    db.run(query, title, (err) => {
      if (err) {
        reject(err);
      } else
        resolve(true);
    });
  });
};

/*************POINTS CRUD************/

function readPoints() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM POINTS';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function readPointById(id) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM POINTS WHERE idPoint = ?';
    db.get(sql, id, (err, row) => {
      if (err) {
        reject(err);
      } if (row == undefined)
        resolve({ error: 'NOT found' });
      else {
        resolve(row);
      }
    });
  });
}

//It checks if the address exists
function checkPresenceByAddress(addr) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT idPoint FROM POINTS WHERE address = ?';
    db.get(sql, addr, (err, id) => {
      if (err) {
        reject(err);
      } if (id == undefined)
      resolve(null);
      else {
        resolve(id);
      }
    });
  });
}

function addPoint(point) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO POINTS (address, nameLocation, gps_coordinates, type) VALUES(?,?,?,?)';
    db.run(sql, point.address, point.nameLocation, point.gps_coordinates, point.type, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

function updatePoint(oldIdPoint, newPoint) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE POINTS SET address = ?, nameLocation = ?, gps_coordinates = ?, type = ? where idPoint = ?';
    db.run(sql, newPoint.address, newPoint.nameLocation, newPoint.gps_coordinates, newPoint.type, oldIdPoint, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}

function deletePoint(id) {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM POINTS WHERE idPoint = ?';
    db.run(query, id, (err) => {
      if (err) {
        reject(err);
      } else
        resolve(true);
    });
  });
};

function updatePointAddress(oldIdPoint, address) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE POINTS SET address = ? where idPoint = ?';
    db.run(sql, address, oldIdPoint, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}

function updatePointLocation(oldIdPoint, location) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE POINTS SET nameLocation = ? where idPoint = ?';
    db.run(sql, location, oldIdPoint, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}

function updatePointGpsCoordinates(oldIdPoint, gps_coordinates) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE POINTS SET gps_coordinates = ? where idPoint = ?';
    db.run(sql, gps_coordinates, oldIdPoint, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}

function updatePointType(oldIdPoint, type) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE POINTS SET type = ? where idPoint = ?';
    db.run(sql, type, oldIdPoint, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}

function readHuts() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM POINTS where type = ?';
    db.all(sql, "Hut", (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

/*************Verification Code************/
function addCode(email, code) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO Verification_Code (email,code) VALUES(?,?)';
    db.run(sql, email, code, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

function getCode(email) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Verification_Code where email = ?';
    db.get(sql, [email], (err, rows) => {
      if (err) {
        reject(err);
      }
      if (rows == undefined)
        resolve({ error: 'NOT found' });
      else {
        resolve(rows);
      }
    });
  });
}

function deleteCode(email) {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM Verification_Code WHERE email = ?';
    db.run(query, [email], (err) => {
      if (err) {
        reject(err);
      } else {

        resolve(true);
      }
    });
  });
};

function updateCode(email, code) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE Verification_Code SET code = ? where email = ?';
    db.run(sql, code, email, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}

module.exports = {
  readUsers, addUser, deleteUser, updateUserRole,
  readHikes, addHike, deleteHike, updateHike, updateHikeTitle,
  updateHikeAscent, updateHikeLength, updateHikeDescription, updateHikeDifficulty,
  updateHikeET, updateHikeStartPoint, updateHikeEndPoint, updateHikeRefPoint, getUserByEmail,
  readPoints, checkPresenceByAddress, addPoint, updatePoint, deletePoint, readHuts, addCode, deleteCode, getCode, updateCode,
  updatePointAddress, updatePointGpsCoordinates, updatePointLocation, updatePointType, readListOfReferencePoints, readPointById//readReferencePoints
};