# HikeTracker22-13

Technology used: Javascript - React

## DB Documentation 
The tables present in the DB are the following:

### Hikes
The list of the hikes
- title: Primary key identifyng a hike
- length: The length in kilometres of the hike
- expected_time: The expected duration in hours of the hike
- ascent: The height difference of the ascent in metres
- difficulty: The difficulty of the hike. Three possible values: tourist, hiker, professional hiker
- start_point: The id of the starting point of the hike
- end_point: The id of the ending point of the hike
- reference_points: A string with the list reference points's id separeted by a "-"
- description: The description of the hike
- gpx_track: A string with the name of gpx file (?)
- hike_condition: The condition of the hike. Four possible values: open, closed, partly blocked, requires special gear
- hike_condition_description: A description of the causes of the condition
- local_guide: The email of the local guide who added the hike

### Points
The list of the points
- idPoint: Primary key identifying a point
- address: The address of the point
- nameLocation: The name of the location of the point
- gps_coordinates: A string contains the gps coordinates of the point
- type: The type of the point. Two possible values: hut or parking lot
- capacity: An integer for Huts and Parking lots, in the first case is related to the number of beds and in the second case to the number of cars.
- altitude: The altitude in kilometres of the point

### Users
The list of the users, their credentials and their roles
- email: Primary key identifying a user
- password: The hashed password of the user
- role: The role of the user
- name: The name of the user
- lastname: The last name of the user
- phone_number: The phone number of the user
- salt: The salt used in the encryption process

### Verification_Code
The list of verification code for each email.
- email: User's email 
- code: Verification code for the email.

### HikePoint
The list of correlations between hikes and points
- idPoint: The id of a point
- titileHike: The title of a hike

### Huts
The list of the huts
- idHut: Primary key identifying a hut
- nameHut: The name of the hut, references to the nameLocation of Points
- phone: The phone number of the hut
- email: The email of the hut
- web_site: The URL of the website of the hut
- description: The description of the hut

## Dao Documentation

### Users functions

- **readUsers()**, returns a list of every user with every field excepted the salt
- **getUserByEmail(email)**, returns a specific user, with every field excepted the salt, associated with the argument *email*. If the *email* hasn't a match it returns a object with a field error: 'NOT found'
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
- **deleteHike(title)**, deletes the hike associated with the argument *title*

### Points functions

- **readPoints()**, returns a list of every point with every field
- **readPointById(id)**, returns a specific point, with every field, associated with the argument *id*. If the *id* hasn't a match it returns a object with a field error: 'NOT found'
- **checkPresenceByAddress(addr)**, returns an idPoint of the point associated with the argument *addr*. It the *addr* hasn't a mathc it returns *null*
- **addPoint(point)**, inserts the point associated with the argument *point*, that is a point with all necessary fields
- **updatePoint(oldIdPoint, newPoint)**, updates the entire point *oldIdPoint* with the new *newPoint*
- **deletePoint(id)**, deletes the point with the specified *id*
- **updatePointAddress(oldIdPoint, address)**, updates the point *oldIdPoint* with the new *address*
- **updatePointLocation(oldIdPoint, location)**, updates the point *oldIdPoint* with the new *location*
- **updatePointGpsCoordinates(oldIdPoint, gps_coordinates)**, updates the point *oldIdPoint* with the new *gps_coordinates*
- **updatePointType(oldIdPoint, type)**, updates the point *oldIdPoint* with the new *type*

### Verification Code functions

- **addCode(email, code)**, inserts the pair (email,code) in the table
- **getCode(email)**, returns a specific codeassociated with the argument *email*. If the *email* hasn't a match it returns a object with a field error: 'NOT found'
- **deleteCode(email)**, deletes the row associated with the argument *email*
- **updateCode(email, code)**, updates the code associated with the argument *email* with the new *code* passed from arguments

### Huts functions

- **readHuts()**, returns a list of every huts with every field


## Users

Mario Rossi:
- email: mario.rossi@gmail.com
- password: hello12
- role: Hiker
- name: Mario
- lastname: Rossi
- phone_number: +39 3486289468

Paulina Knight:
- email: paulina.knight@gmail.com
- password: hello13
- role: LocalGuide
- name: Paulina
- lastname: Knight
- phone_number: +39 3276958421

## API

## HIKES API

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
        "start_point_coordinates": "45.177786,7.083372",
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
        "start_point_coordinates": "47.156786,4.018970",
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

## AUTHENTICATION API

- POST `/api/v0/sessions`
  - Description: Authentication of the user trying to login
  - Request body: An object contains the credentials of the user
    ``` json
    {
      "email": "mario.rossi@gmail.com",
      "password": "hello12"
    }
    ```
  - Response: `200 OK` (success) 
  - Response body: authencticated user
    ``` json
    {
      "email": "mario.rossi@gmail.com", 
	    "password": "hello12",
	    "role": "Hiker",
      "name": "Mario",
      "lastname": "Rossi",
      "phone_number": "+39 3486289468"
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
      "email": "mario.rossi@gmail.com", 
	    "password": "hello12",
	    "role": "Hiker",
      "name": "Mario",
      "lastname": "Rossi",
      "phone_number": "+39 3486289468"
    }
    ```
  - Error responses: `500 Internal Server Error` (generic error), `401 Unauthorized User` (login failed)

- DELETE `/api/sessions/current`
  - Description: Logout dof the current user
  - Request body: _None_
  - Response: `200 OK` (success) 
  - Response body: _None_
  - Error responses: `500 Internal Server Error` (generic error), `401 Unauthorized User` (login failed)

## FILE UPLOAD API

- GET `/Maps/:name`
  - Description: Obtain the map as text
  - Request body: The name of the file contains the map
  - Response: `200 OK` (success) 
  - Response body: A string with the filename
    ``` json
      {
        "filename": "Form Pian Belota to la Vacca",
      },
    ```
  - Error responses: `500 Internal Server Error` (database error)

## ADMIN API

