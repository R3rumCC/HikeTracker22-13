const APIURL = 'http://localhost:3001/api/v0';
const URL = 'http://localhost:3001/api';


function getJson(httpResponsePromise) {
	// server API always return JSON, in case of error the format is the following { error: <message> } 
	return new Promise((resolve, reject) => {
	  httpResponsePromise
		.then((response) => {
		  if (response.ok) {
  
		   // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
		   response.json()
			  .then( json => resolve(json) )
			  .catch( err => reject({ error: "Cannot parse server response" }))
  
		  } else {
			// analyzing the cause of error
			response.json()
			  .then(obj => 
				reject(obj)
				) // error msg in the response body
			  .catch(err => reject({ error: "Cannot parse server response" })) // something else
		  }
		})
		.catch(err => 
		  reject({ error: "Cannot communicate"  })
		) // connection error
	});
  }

/*************************AUTHENTICATION API**********************/

const logIn = async (credentials) => {
	return getJson( fetch(APIURL + '/sessions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify(credentials),
	})
	)
};

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
const logOut = async () => {
	const response = await fetch(APIURL + '/sessions/current', {
		method: 'DELETE',
		credentials: 'include'
	});
	if (response.ok)
		return null;
}

/*************************SERVICES API**********************/

async function getServices() {

	return getJson(fetch('http://localhost:3001' + '/api/services', {
		method: 'GET',
		credentials: 'include',
	})
	)
}

/*************************TICKET API**********************/

async function takeTicket(service) {
	return getJson( fetch('http://localhost:3001' + '/api/Ticket/' + service, {
		method: 'POST',
		credentials: 'include',
	})
	)
}

async function takeTicketsToBeServed(){
	const url = 'http://localhost:3001' + 'api/Ticket/list';
	const response= await fetch(url);
    if(response.ok) {
      const tickets= await response.json();
      return tickets;
    }
    else {
      try {
        const errDetail = await response.json();
        throw errDetail.message;
      }
      catch(err) { throw err;}
    }
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

async function readQueues(){
	const url = 'http://localhost:3001' + '/Queues';
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


/************************************************/

/*************OBJECTS API****************/

/*** API Structure left for reference
//API: readRiddles--------------------------------------------------------
async function readRiddles() {

		const url = APIURL + '/riddles';
		try {
				const response = await fetch(url);
				if (response.ok) {
						// process the response
						const list = await response.json();
						const riddleList = list.map((r) => new Riddle(r.id, r.question, r.difficulty, r.duration, r.correct_answer, r.hint_1, r.hint_2, r.status_riddle, r.user_id));
						return riddleList;
				} else {
						// application error (404, 500, ...)
						console.log(response.statusText);
						const text = await response.text();
						throw new TypeError(text);
				}
		} catch (ex) {
				// network error
				console.log(ex);
				throw ex;
		}
}

//API:addRiddle function---------------------------------
async function addRiddle(riddle_to_add) {
		const url = APIURL + '/riddles/addRiddle';
		try {
				const response = await fetch(url, {
						method: 'POST',
						credentials: 'include',
						body: JSON.stringify(riddle_to_add),
						headers: {
								'Content-Type': 'application/json'
						}

				});
				if (response.ok) {
						return true;
				} else {
						console.log(response.statusText);
						const text = await response.text();
						throw new TypeError(text);
				}
		} catch (ex) {
				throw ex;
		}
}

//API:updateRiddleStatus function--------------------
async function updateRiddleStatus(id, status) {
		const url = APIURL + `/riddles/updateRiddleStatus/${id}/${status}`;
		try {
				const response = await fetch(url, {
						method: 'PUT',
						credentials: 'include',
						headers: {
								'Content-Type': 'application/json'
						}

				});
				if (response.ok) {
						return true;
				} else {
						console.log(response.statusText);
						const text = await response.text();
						throw new TypeError(text);
				}
		} catch (ex) {
				throw ex;
		}
}
****/


//EXPORT FUNCTIONS------------------------------
const API = {
	logIn, getUserInfo, logOut, getServices, takeTicket, takeTicketsToBeServed,
	getAllUsers, deleteUser, updateUserRole, addUser, readQueues
}
export default API;