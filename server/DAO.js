'use strict';

const sqlite = require('sqlite3');
//const { Resolver } = require('dns/promises');

const db = new sqlite.Database('oqm.db', (err) => {
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
    const sql = 'INSERT INTO USERS (Name, Lastname, Email, Password, Salt, Role) VALUES(?,?,?,?,?,?)';
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
function updateUserRole(id, role) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE USERS SET Role = ? where Id = ?';
    db.run(sql, role, id, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}

function deleteUser(id) {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM USERS WHERE Id = ?';
    db.run(query, id, (err) => {
      if (err) {
        reject(err);
      } else
        resolve(true);
    });
  });
};

/*************SERVICES CRUD************/

function readServices() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM SERVICES';
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

function addService(service) {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO SERVICES (ServiceName, AverageTime) VALUES(?,?)';
    db.run(sql, service.name, service.averageTime, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

function updateServiceName(oldName, newName) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE SERVICES SET ServiceName = ? where ServiceName = ?';
    db.run(sql, newName, oldName, (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    });
  });
}

function updateServiceTime(name, time) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE SERVICES SET AverageTime = ? where ServiceName = ?';
    db.run(sql, time, name, (err) => {
      if(err)
        reject(err);
      else 
        resolve(true);
    });
  });
}

function deleteService(name) {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM SERVICES WHERE ServiceName = ?';
    db.run(query, name, (err) => {
      if (err) {
        reject(err);
      } else
        resolve(true);
    });
  });
};

/*************COUNTERS CRUD************/

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


module.exports = {
  readUsers, addUser, updateUserRole, deleteUser, readServices, addService, updateServiceName, deleteService,
  readTicketsToBeServed, addCounter, deleteCounter, readCounters, getCounterByService, getServiceByCounter,
  addServiceToCounter, removeServiceFromCounter, ticketServed, updateServiceTime, newTicket,
  countCountersForEachService, countServicesForEachCounter, countServedTicket, countAbsentTicket,
  numberOfTicketByHour, numberOfTicketByDay, numberOfTicketByMonth, numberOfTicketByHourAndService, numberOfTicketByDayAndService, numberOfTicketByMonthAndService,
  numberOfServicesByDay
};