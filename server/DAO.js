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

function addUser(name, lastname, email, password, salt, role) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO USERS (email, password, role, name, lastname, salt) VALUES(?,?,?,?,?,?)';
    db.run(sql, name, lastname, email, password, salt, role, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}


//update role
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
    const sql = 'SELECT * FROM HIKES';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function addHikes(hikes) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO HIKES (title, length, expected_time, ascent, difficulty, start_point, end_point, reference_point, description) VALUES(?,?,?,?,?,?,?,?,?)';
    db.run(sql, hikes.title, hikes.length, hikes.expected_time, hikes.ascent, hikes.difficulty, hikes.start_point, hikes.end_point, hikes.reference_point, hikes.description, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

function updateHikesTitle(oldName, newName) {
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

function updateHikesLength(title, length) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE HIKES SET length = ? where title = ?';
    db.run(sql, length, title, (err) => {
      if(err)
        reject(err);
      else 
        resolve(true);
    });
  });
}
function updateHikesET(title, expected_time) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE HIKES SET expected_time = ? where title = ?';
    db.run(sql, expected_time, title, (err) => {
      if(err)
        reject(err);
      else 
        resolve(true);
    });
  });
}
function updateHikesAscent(title, ascent) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE HIKES SET ascent = ? where title = ?';
    db.run(sql, ascent, title, (err) => {
      if(err)
        reject(err);
      else 
        resolve(true);
    });
  });
}
function updateHikesDifficulty(title, difficulty) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE HIKES SET difficulty = ? where title = ?';
    db.run(sql, difficulty, title, (err) => {
      if(err)
        reject(err);
      else 
        resolve(true);
    });
  });
}
function updateHikesStartPoint(title, start_point) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE HIKES SET start_point = ? where title = ?';
    db.run(sql, start_point, title, (err) => {
      if(err)
        reject(err);
      else 
        resolve(true);
    });
  });
}
function updateHikesEndPoint(title, end_point) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE HIKES SET end_point = ? where title = ?';
    db.run(sql, end_point, title, (err) => {
      if(err)
        reject(err);
      else 
        resolve(true);
    });
  });
}
function updateHikesRefPoint(title, reference_point) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE HIKES SET reference_point = ? where title = ?';
    db.run(sql, reference_point, title, (err) => {
      if(err)
        reject(err);
      else 
        resolve(true);
    });
  });
}
function updateHikesDescription(title, description) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE HIKES SET description = ? where title = ?';
    db.run(sql, description, title, (err) => {
      if(err)
        reject(err);
      else 
        resolve(true);
    });
  });
}
function deleteHikes(title) {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM SERVICES WHERE title = ?';
    db.run(query, title, (err) => {
      if (err) {
        reject(err);
      } else
        resolve(true);
    });
  });
};

/*************COUNTERS CRUD************/
/*
function readCounters() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Counters ';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function addCounter(id) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO Counters (Id) VALUES (?)';
    db.run(sql, id, (err) =>{
      if(err)
        reject(err);
      else
        resolve(true);
    });
  });
}

function deleteCounter(id) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM Counters WHERE Id = ?';
    db.run(sql, id, (err) => {
      if(err)
        reject(err);
      else
        resolve(true);
    });
  });
}


/*************QUEUES FUNCTIONS************/
/*
function readTicketsToBeServed() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Queues WHERE IsCalled = 0 ORDER BY IdTicket';  // IsCalled = 0 -> not served
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function newTicket(IdTicket) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO Queues (IdTicket, IsCalled) VALUES (?, ?)';
    db.run(sql, IdTicket, 0, (err) => {
      if(err)
        reject(err);
      else
        resolve(true);
    });
  });
}

function ticketServed(IdTicket) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE Queues SET IsCalled = ? WHERE IdTicket = ?';
    db.run(sql, 1, IdTicket, (err) => {
      if(err)
        reject(err);
      else
        resolve(true);
    });
  });
}


/**************COUNTERS_SERVICES FUNCTIONS ****************/
/*
function getCounterByService(serviceName) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT IdCounter FROM Counters_Services WHERE ServiceName = ?';
    db.get(sql, serviceName, (err, rows) => {
      if (err)
        reject(err);
      else if (rows === undefined)
        resolve(false);
      else
        resolve(rows);
    });
  });
}

function getServiceByCounter(idCounter) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT ServiceName FROM Counters_Services WHERE IdCounter = ?';
    db.get(sql, idCounter, (err, rows) => {
      if (err)
        reject(err);
      else if (rows === undefined)
        resolve(false);
      else
        resolve(rows);
    });
  });
}

function addServiceToCounter(idCounter, serviceName) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO Counters_Services (IdCounter, ServiceName) VALUES (?, ?)';
    db.run(sql, idCounter, serviceName, (err) =>{
      if(err) 
        reject(err);
      else
        resolve(true);
    });
  });
}

function removeServiceFromCounter(idCounter, serviceName) {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM Counters_Services WHERE IdCounter = ? AND ServiceName = ?';
    db.run(sql, idCounter, serviceName, (err) => {
      if(err)
        reject(err);
      else
        resolve(true);
    });
  });
}

function countCountersForEachService() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) FROM Counters_Services GROUP BY ServiceName';
    db.get(sql, (err, rows) => {
      if (err)
        reject(err);
      else if (rows === undefined)
        resolve(false);
      else
        resolve(rows);
    });
  });
}

function countServicesForEachCounter() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) FROM Counters_Services GROUP BY IdCounter';
    db.get(sql, (err, rows) => {
      if (err)
        reject(err);
      else if (rows === undefined)
        resolve(false);
      else
        resolve(rows);
    });
  });
}

/*************SERVICES DATA FUNCTIONS************/
/*
function countServedTicket() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) FROM Service_Data WHERE IsServed=1';
    db.get(sql, (err, rows) => {
      if (err)
        reject(err);
      else if (rows === undefined)
        resolve(false);
      else
        resolve(rows);
    });
  });
}

function countAbsentTicket() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) FROM Service_Data WHERE IsServed=0';
    db.get(sql, (err, rows) => {
      if (err)
        reject(err);
      else if (rows === undefined)
        resolve(false);
      else
        resolve(rows);
    });
  });
}

function numberOfTicketByHour() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) FROM Service_Data GROUP BY HOUR(DateTime)';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function numberOfTicketByHourAndService() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) FROM Service_Data GROUP BY HOUR(DateTime), ServiceName';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function numberOfTicketByDay() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) FROM Service_Data GROUP BY DAY(DateTime)';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function numberOfTicketByDayAndService() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) FROM Service_Data GROUP BY DAY(DateTime), ServiceName';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function numberOfTicketByMonth() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) FROM Service_Data GROUP BY MONTH(DateTime)';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function numberOfTicketByMonthAndService() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) FROM Service_Data GROUP BY MONTH(DateTime), ServiceName';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function numberOfServicesByDay() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(DISTINCT ServiceName) FROM Service_Data GROUP BY DAY(DateTime)';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}
*/

module.exports = { readUsers, addUser, deleteUser, readHikes, addHikes, deleteHikes,
  updateHikesAscent, updateHikesLength, updateHikesDescription, updateHikesDifficulty, 
  updateHikesET, updateHikesStartPoint, updateHikesEndPoint, updateHikesRefPoint
};