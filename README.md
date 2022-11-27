# HikeTracker22-13

Technology used: Javascript - React

## DB Documentation 
The tables present in the DB are the following:

### Hikes
The list of the hikes
- title: Primary key identifyng a hike
- length: The length in kilometres of the hike
- expected_time: The expected duration in minutes of the hike
- ascent: The height difference of the ascent in metres
- difficulty: The difficulty of the hike. Three possible values: tourist, hiker, professional hiker
- start_point: The id of the starting point of the hike
- end_point: The id of the ending point of the hike
- reference_points: A string with the list reference points's id separeted by a "-"
- description: The description of the hike

### Points
The list of the points
- idPoint: Primary key identifying a point
- address: The address of the point
- nameLocation: The name of the location of the point
- gps_coordinates: A string contains the gps coordinates of the point
- type: The type of the point. Two possible values: hut or parking lot

### Users
The list of the users, their credentials and their roles
- email: Primary key identifying a user
- password: The hashed password of the user
- role: The role of the user
- name: The name of the user
- lastname: The last name of the user
- phone_number: The phone number of the user
- salt: The salt used in the encryption process

### HikePoint
The list of correlations between hikes and points
- idPoint: The id of a point
- titileHike: The title of a hike

### Verification_Code
The list of verification code for each email.
- email: User's email 
- code: Verification code for the email.

## Dao Documentation

### Users functions

- **readUsers()**, returns a list of every user with every field excepted the salt
- **addUser(name, lastname, email, password, salt, role, phone_number)**, inserts a user in the database, with the relative arguments. The password is already hashed
- **updateUserRole(email, role)**, updates the user associated with the argument *email* with the argument *role*
- **deleteUser(email)**, deletes the user associated with the argument *email*

### Hikes functions

- **readHikes()**, returns a list of every hike with every field excepted the reference points. This function returns also the fields of the starting and ending points
- **readReferencePoints(title)**, returns a list of the fields of the reference points of the hike associated with the argument *title*
- **addHike(hike)**, inserts the object hike to the database. The argument *hike*, is an object with the every fields of an hike
- **updateHikeTitle(oldName, newName)**, updates the hike identified by *oldName* with the *newName*
- **updateHikeLenght(title, length)**, updates the hike *title* with the new *length*
- **updateHikeET(title, expected_time)**, updates the hike *title* with the new *expected_time*
- **updateHikeAscent(title, ascent)**, updates the hike *title* with the new *ascent*
- **updateHikeDifficulty(title, difficulty)**, updates the hike *title* with the new *difficulty*
- **updateHikeStartPoint(title, start_point)**, updates the hike *title* with the new *start_point*
- **updateHikeEndPoint(title, end_point)**, updates the hike *title* with the new *end_point*
- **updateHikeRefPoint(title, reference_points)**, updates the hike *title* with the new *references_point*
- **updateHikeDescription(title, description)**, updates the hike *title* with the new *description*
- **updateHike(oldHikeTitle, newHike)**, updates the entire hike *oldHikeTitle* with the new *newHike*
- **deleteHike(title)**, deletes the hike *title*

### Points functions

- **readPoints()**, returns a list of every point with every field
- **addPoint(point)**, inserts the point associated with the argument *point*
- **updatePoint(oldIdPoint, newPoint)**, updates the entire point *oldIdPoint* with the new *newPoint*
- **deletePoint(id)**, deletes the point with the specified *id*
- **updatePointAddress(oldIdPoint, address)**, updates the point *oldIdPoint* with the new *address*
- **updatePointLocation(oldIdPoint, location)**, updates the point *oldIdPoint* with the new *location*
- **updatePointGpsCoordinates(oldIdPoint, gps_coordinates)**, updates the point *oldIdPoint* with the new *gps_coordinates*
- **updatePointType(oldIdPoint, type)**, updates the point *oldIdPoint* with the new *type*

## Users

Mario Rossi:
- email: mario.rossi@gmail.com
- password: hello12
- role: Hiker

Paulina Knight:
- email: paulina.knight@gmail.com
- password: hello13
- role: LocalGuide

## API

- GET `/getHikes`
  - Description: Obtain the entire list of the hikes 
  - Request body: _None_
  - Response: `200 OK` (success) 
  - Response body: Array of objects, each describing an hike:
    ``` json
    [
      {
        "title": "Hike1",
        "length": 33,
        "expected_time": 75,
        "ascent": 400,
        "difficulty": "hiker",
		"description": "A journey through the unspoilt nature of Monte Rosa",
        "start_point_idPoint": 2,
		"start_point_address": "Corso Mediterraneo 40",
		"start_point_nameLocation": "Legnano",
		"start_point_coordinates": "N 41° 53' 24″ - E 12° 29' 32″",
		"start_point_type": "hut",
		"end_point_idPoint": 4,
		"end_point_address": "Corso Francia 10",
		"start_point_nameLocation": "Fivizzano",
		"start_point_coordinates": "N 45° 83' 29″ - E 52° 09' 72″",
		"start_point_type": "parking lot",
      },
      ...
      {
        "title": "Hike7",
        "length": 75,
        "expected_time": 189,
        "ascent": 600,
        "difficulty": "professional hiker",
		"description": "A hike in the Dolomites Nature Park",
        "start_point_idPoint": 10,
		"start_point_address": "Corso Mediterraneo 120",
		"start_point_nameLocation": "Brunascola",
		"start_point_coordinates": "N 11° 23' 74″ - E 18° 89' 44″",
		"start_point_type": "parking lot",
		"end_point_idPoint": 3,
		"end_point_address": "Corso Francia 100",
		"start_point_nameLocation": "Ricortola",
		"start_point_coordinates": "N 55° 93' 21″ - E 32° 19' 70″",
		"start_point_type": "parking lot",
      },
      ...
    ]
    ```
  - Error responses: `500 Internal Server Error` (database error)

- POST `/api/v0/sessions`
  - Description: Authentication of the user trying to login
  - Request body: An object contains the credentials of the user
    ``` json
    {
    "email": "u1@p.it",
    "password": "password"
    }
    ```
  - Response: `200 OK` (success) 
  - Response body: authencticated user
    ``` json
    {
    "email": "u1@p.it", 
	"password": "password",
	"role": "local guide",
    "name": "utente1",
	"lastname": "goglia",
	"phone_number": "utente1"
    }
    ```
  - Error responses: `500 Internal Server Error` (generic error), `401 Unauthorized User` (login failed)

- GET `/api/v0/sessions/current`
  - Description: Checks whether the current user is logged in and obtains his data
  - Request body: _None_
  - Response: `200 OK` (success) 
  - Response body: authenticated user
    ``` json
    {
    "email": "u1@p.it", 
	"password": "password",
	"role": "local guide",
    "name": "utente1",
	"lastname": "goglia",
	"phone_number": "utente1"
    }
    ```
  - Error responses: `500 Internal Server Error` (generic error), `401 Unauthorized User` (login failed)

- DELETE `/api/sessions/current`
  - Description: Logout dof the current user
  - Request body: _None_
  - Response: `200 OK` (success) 
  - Response body: _None_
  - Error responses: `500 Internal Server Error` (generic error), `401 Unauthorized User` (login failed)
