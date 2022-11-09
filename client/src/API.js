const APIURL = 'http://localhost:3001/api/v0';
const URL = 'http://localhost:3001/api';

/*************************AUTHENTICATION API**********************/

async function logIn(credentials) {
	let response = await fetch(APIURL + '/sessions', {
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
	const response = await fetch(APIURL + '/sessions/current', {
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
	await fetch(URL + 'sessions/current', {
	  method: 'DELETE',
	  credentials: 'include'
	});
  }

/*************************ADMIN API**********************/

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

/*************************HIKES API**********************/

async function getHikes(){
	const url = 'http://localhost:3001' + '/api/getHikes';
	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
		}
		});
		if(response.ok){
			const list = await response.json();
			return list;
		}
		else{
			console.log(response.statusText);
			const text = await response.text();
			throw new TypeError(text);
		}
	}
	catch(e){
		console.log(e);
		throw e;
	}
}

/*************************LOCAL GUIDE API**********************/

function addNewHike(newHike) {
	return new Promise((resolve, reject) => {
	  fetch(URL + '/hike', {
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

//EXPORT FUNCTIONS------------------------------
const API = {
	logIn, getUserInfo, logOut, getAllUsers, deleteUser, updateUserRole, addUser, getHikes, addNewHike
}
export default API;