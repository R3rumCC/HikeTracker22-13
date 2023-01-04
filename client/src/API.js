const URL = 'http://localhost:3001/api';

/*************************AUTHENTICATION API**********************/

async function logIn(credentials) {
  let response = await fetch(URL + '/sessions', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetail = await response.json();
    throw errDetail;
  }
}

const guest = { id: 0, name: 'Guest' }; //Dummy object in case of error

//API: getUserInfo----------------------------------------------------
const getUserInfo = async () => {
  const response = await fetch(URL + '/sessions/current', {
    credentials: 'include',
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    return guest;
  }
};

//FINAL STEP-->LOGOUT-->Destroy the session info associated to the authorized user
async function logOut() {
  await fetch(URL + '/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });
}
/*************************FILE UPLOAD API**********************/

async function getMap(name) {
  name = name.replace(/\s/g, '') 
  const url = 'http://localhost:3001/api/Maps/'+name;
  try {
      const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
          'Content-Type': 'text/plain'
      }
      });
      if (response.ok) {
      const map = await response.text();
      return map;
      }
      else {
      const text = await response.text();
      throw new TypeError(text);
      }
  }
  catch (e) {
      console.log(e);
      throw e;
  }
  }


/*************************ADMIN API**********************/

//necessary?
async function getAllUsers() {
  return new Promise((resolve, reject) => {
    fetch(URL + '/User')
      .then((response) => {
        if (response.ok) {
          response.json()
            .then(json => resolve(json.map((user) => ({
              id: user.Id,
              name: user.Name,
              lastname: user.Lastname,
              email: user.Email,
              role: user.Role,
            }))))
            .catch(err => reject({ error: "Cannot parse server response" }))
        } else {
          response.json()
            .then((obj) => { reject(obj); })
            .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
        }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
};

//necessary?
function deleteUser(user) {
  return new Promise((resolve, reject) => {
    fetch(URL + '/User/' + user.id, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        response.json()
          .then((message) => { reject(message); })
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

function updateUserRole(user, newRole) {
  return new Promise((resolve, reject) => {
    fetch(URL + '/User', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: user.id, role: newRole }),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        response.json()
          .then((obj) => { reject(obj); })
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

function addUser(user) {
  return new Promise((resolve, reject) => {
    fetch(URL + '/User', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user }),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        response.json()
          .then((obj) => { reject(obj); })
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

async function checkUser(email) {
  const response = await fetch(`http://localhost:3001/api/User/${email}`, {
    credentials: 'include',
  });

  const resJson = await response.json();

  if (response.ok) {
    return resJson;
  }
  else
    throw resJson;

};

/*************************HIKES API**********************/

async function getHikes() {
  const url = 'http://localhost:3001' + '/api/getHikes';
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      const list = await response.json();
      return list;
    }
    else {
      const text = await response.text();
      throw new TypeError(text);
    }
  }
  catch (e) {
    throw e;
  }
}

/*************************HIKER API****************************/

async function getHuts() {
  const url = 'http://localhost:3001' + '/api/getHuts';
  try {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      const list = await response.json();
      return list;
    }
    else {
      const text = await response.text();
      throw new TypeError(text);
    }
  }
  catch (e) {
    console.log(e);
    throw e;
  }
}

async function getPoints() {
  const url = 'http://localhost:3001' + '/api/getPoints';
  try {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.ok) {
      const list = await response.json();
      return list;
    }
    else {
      const text = await response.text();
      throw new TypeError(text);
    }
  }
  catch (e) {
    console.log(e);
    throw e;
  }
}

/*************************LOCAL GUIDE API**********************/

function addNewHike(newHike) {
  console.log('addNewHike in API');
  return new Promise((resolve, reject) => {
    fetch(URL + '/newHike', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newHike }),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        response.json()
          .then((obj) => { reject(obj); })
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

function updateHike(oldHikeTitle, hike) {
  return new Promise((resolve, reject) => {
    fetch(URL + '/updateHike', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ oldHikeTitle, hike }),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        response.json()
          .then((obj) => { reject(obj); })
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

function addPoint(point) {
  return new Promise((resolve, reject) => {

    fetch(URL + '/Point', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ point }),
    }).then((response) => {
      if (response.ok) {
        return(response);
      } else {
        response.json()
          .then((obj) => { reject(obj); })
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

function addHut(hut) {
  return new Promise((resolve, reject) => {
    fetch(URL + '/Huts', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hut }),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        response.json()
          .then((obj) => { reject(obj); })
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

/*************************Email Verification**********************/

async function sendEmail(email) {
  const response = await fetch(`http://localhost:3001/email/getCode/${email}`, {
    credentials: 'include',
  });



  if (response.ok) {
    return null;
  }

}

async function checkCode(email) {
  const response = await fetch(`http://localhost:3001/api/Code/${email}`, {
    credentials: 'include',
  });

  const resJson = await response.json();

  if (response.ok) {

    return resJson;
  }
  else
    throw resJson;
}

/*************HikerHike API************/

function startHike(hiker_email, hike_title, start_time) {
  return new Promise((resolve, reject) => {
    fetch(URL + '/startHike', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hiker_email, hike_title, start_time }),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        response.json()
          .then((obj) => { reject(obj); })
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

function updateEndTime(hiker_email, hike_title, start_time, end_time) {
  return new Promise((resolve, reject) => {
    fetch(URL + '/updateEndTime', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hiker_email, hike_title, start_time, end_time }),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        response.json()
          .then((obj) => { reject(obj); })
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

function endHike(hiker_email, hike_title, duration) {
  return new Promise((resolve, reject) => {
    fetch(URL + '/endHikeFirstTime', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hiker_email, hike_title, duration }),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        response.json()
          .then((obj) => { reject(obj); })
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

function updateEndHike(hiker_email, hike_title, duration) {
  return new Promise((resolve, reject) => {
    fetch(URL + '/endHike', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ hiker_email, hike_title, duration }),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        response.json()
          .then((obj) => { reject(obj); })
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

async function getOnGoingHike(hiker_email) {
  return new Promise((resolve, reject) => {
    fetch(URL + '/getOnGoingHike/'+hiker_email)
      .then((response) => {
        if (response.ok) {
          response.json()
            .then(json => resolve(json.map((row) => ({
              title: row.hike.title,
              length: row.hike.length,
              expected_time: row.hike.expected_time,
              ascent: row.hike.ascent,
              difficulty: row.hike.difficulty,
              start_point_nameLocation: row.hike.start_point,
              end_point_nameLocation: row.hike.end_point,
              reference_points : row.hike.reference_points,
              description: row.hike.description,
              gpx_track: row.hike.gpx_track,
              hike_condition: row.hike.hike_condition,
              hike_condition_description: row.hike.hike_condition_description,
              local_guide: row.hike.local_guide,
              start_time: row.start_time
            }))))
            .catch(err => reject({ error: "Cannot parse server response" }))
        } else {
          response.json()
            .then((obj) => { reject(obj); })
            .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
        }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
};

async function getFinishedHikes() {
  return new Promise((resolve, reject) => {
    fetch(URL + '/getFinishedHikes')
      .then((response) => {
        if (response.ok) {
          response.json()
            .then(json => resolve(json.map((row) => ({
              hiker: row.hiker,
              hike: row.hike,
              start_time: row.start_time,
              end_time: row.end_time
            }))))
            .catch(err => reject({ error: "Cannot parse server response" }))
        } else {
          response.json()
            .then((obj) => { reject(obj); })
            .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
        }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
};

async function getDistinctFinishedHikes() {
  return new Promise((resolve, reject) => {
    fetch(URL + '/getDistinctFinishedHikes')
      .then((response) => {
        if (response.ok) {
          response.json()
            .then(json => resolve(json.map((row) => ({
              hike: row.hike,
            }))))
            .catch(err => reject({ error: "Cannot parse server response" }))
        } else {
          response.json()
            .then((obj) => { reject(obj); })
            .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
        }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
};

async function getFinishedHikesByHiker(hiker_email) {
  return new Promise((resolve, reject) => {
    fetch(URL + '/getFinishedHikesByHiker/'+hiker_email)
      .then((response) => {
        if (response.ok) {
          response.json()
            .then(json => resolve(json.map((row) => ({
              title: row.hike.title,
              length: row.hike.length,
              expected_time: row.hike.expected_time,
              ascent: row.hike.ascent,
              difficulty: row.hike.difficulty,
              start_point_nameLocation: row.hike.start_point,
              end_point_nameLocation: row.hike.end_point,
              reference_points : row.hike.reference_points,
              description: row.hike.description,
              gpx_track: row.hike.gpx_track,
              hike_condition: row.hike.hike_condition,
              hike_condition_description: row.hike.hike_condition_description,
              local_guide: row.hike.local_guide,
              start_time: row.start_time,
              end_time: row.end_time
            }))))
            .catch(err => reject({ error: "Cannot parse server response" }))
        } else {
          response.json()
            .then((obj) => { reject(obj); })
            .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
        }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
};

//EXPORT FUNCTIONS------------------------------
const API = {
  logIn, getUserInfo, logOut,
  getAllUsers, deleteUser, updateUserRole, addUser,
  addNewHike, updateHike, getHikes, getMap,
  addPoint, addHut, getHuts, getPoints,
  checkUser, sendEmail, checkCode,
  startHike, updateEndTime, endHike, updateEndHike,
  getOnGoingHike, getFinishedHikes, getDistinctFinishedHikes, getFinishedHikesByHiker
}
export default API;