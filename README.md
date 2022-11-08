# OfficeQueueManagement22-13

Technology used: Javascript - React

## DB Documentation 
The tables present in the DB are the following:

### Counters
The list of the counters available in the office
- Id: Primary key identifying the counters of the office

### Services
The list of the services available in the office
- ServiceName: Primary key identifying a type of service
- AverageTime: The average time needed to deliver the associated service

### Users
The list of the users, their credentials and their roles
- Id: Primary key identifying a user
- Name: The name of the user
- Lastname: The last name of the user
- Email: The email of the user
- Role: The role of the user
- Password: The hashed password of the user
- Salt: The salt used in the encryption process

### Counters_Services
Association table that links counters with the services they provide
- IdCounter: The Id of a counter
- ServiceName: The name of the service provided

Both these fields are primary key

### Queues
Table that saves all the tickets of the day, both served and not, for synchronization purposes
- IdTicket: Primary key identifying a single ticket, of type XYY, where X is a letter identifying a type service and YY are numbers
- IsCalled: Boolean specifying whether a ticket has already been called or not 

### Service_Data
Table that saves each time a service is delivered and by who
- ServiceName: The name of the service delivered
- User: The email of the user that delivered the service
- DateTime: The time at which the service was delivered
- IsServed: Boolean specifying whether the ticket called was served or absent

The first three fields are primary key

## Dao Documentation

### Users functions

- **readUsers()**, returns a list of every user with every field
- **addUser(name, lastname, email, password, salt, role)**, inserts a user in the database, with the relative arguments. The password is already hashed
- **updateUserRole(id, role)**, updates the user associated with the argument *id* with the argument *role*
- **deleteUser(id)**, deletes the user associated with the argument *id*

### Services functions

- **readServices()**, returns a list of every service with every field
- **addService(service)**, inserts the object service to the database. The argument *service*, is an object with a *name* and a *averageTime* field
- **updateServiceName(oldName, newName)**, updates the service identified by *oldName* with the *newName*
- **updateServiceTime(name, time)**, updates the service *name* with the new *time*
- **deleteService(name)**, deletes the service *name*

### Counters functions

- **readCounters()**, returns a list of every counter with every field
- **addCounter(id)**, inserts the counter with the specified *id*
- **deleteCounter(id)**, deletes the counter with the specified *id*

### Queues functions

- **readTicketsToBeServed()**, returns a list of all the tickets with the IsCalled field equal to 0/false (the tickets are yet to be called by a counter)
- **newTicket(IdTicket)**, inserts the ticket *IdTicket* into the queue, with IsCalled = 0 by default
- **ticketServed(IdTicket)**, updates the IsCalled field of the ticket *IdTicket* to 1/true (the ticket has been called by a counter)

### Counters_Services functions

- **getCounterByService(serviceName)**, returns a list of counters that provide the service *serviceName*
- **getServiceByCounter(idCounter)**, returns a list of services provided by the counter *idCounter*
- **addServiceToCounter(idCounter, serviceName)**, associates *serviceName* to the counter *idCounter*
- **removeServiceFromCounter(idCounter, serviceName)**, deletes the association between the *serviceName* and the counter *idCounter*
- **countCountersForEachService()**, returns the number of counters that provide each service
- **countServicesForEachCounter()**, returns the number of services provided by each counter

### Service_Data functions

- **countServedTicket()**, returns the number of tickets that have been served 
- **countAbsentTicket()**, returns the number of tickets that were not present when they where called to be served
- **numberOfTicketByHour()**, returns the number of tickets served each hour
- **numberOfTicketByHourAndService()**, returns the number of tickets served each hour and the service they required
- **numberOfTicketByDay()**, returns the number of tickets served each day
- **numberOfTicketsByDayAndService()**, returns the number of tickets served each day and the service they required
- **numberOfTicketByMonth()**, returns the number of tickets served each month
- **numberOfTicketByMonthAndService()**, returns the number of tickets served each month and the service they required
- **numberOfServicesByDay()**, returns the number of services provided each day

## Users

Mario Rossi:
- email: mario.rossi@gmail.com
- password: hello12
- role: officier

Paulina Knight:
- email: paulina.knight@gmail.com
- password: hello13
- role: manager

Carlene Ross:
- email: carlene.ross@gmail.com
- password: hello14
- role: admin 

## API

#### GET /api/Services

- **Get all existing services**.
- **Response**: `200 OK` (success); body: List with service name and average required time.

```
[
	{
		"ServiceName": "Managment",
		"AverageTime": 15
	},
	{
		"ServiceName": "Accountant",
		"AverageTime": 30
	},
	{
		"ServiceName": "Help",
		"AverageTime": 5
	}
]
```

- **Error responses**: `500 Internal Server Error` (generic error).

#### POST /api/Ticket/:ServiceName

- **Generate a new ticket**.
- **Response**: `200 OK` (success); body: Value of the ticket ID i.e 'M12'.
- **Error responses**: `500 Internal Server Error` (generic error).
