# Hotel API Documentation
The Hotel API provides information about user logins and their reservations, availability of hotels, as well as make a booking.
## User login
**Request Format:** /user endpoint with POST parameters of `name` and `password`

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** Given a valid `name` and a `password` to login, the server will reply with a JSON response with the user name and its corresponding `userID`.

**Example Request:** /user with POST parameters of `name=Nelson` and `password=abc`

**Example Response:**
```json
{
    "name": "Nelson",
    "userID": "user_123",
}
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If passed in an invalid user name or password, returns an error with the message: `User name or password is incorrect, please try again`
- Possible 500 errors (all plain text):
  - If something else goes wrong on the server, returns an error with the message: `Something went wrong. Please try again later.`

## User reservations
**Request Format:** /reservations endpoint with POST parameters of `userID`

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** Given a valid `userID` (this is the same user id format as given by the response detailed in the user login query), return a JSON response with all the reservations of that user. Each reservation record have a hotel `hotelName`, `check-in` date, and `check-out` date.

**Example Request:** /reservations with POST parameters of `userID`

**Example Response:**
```json
{
    "hotelName": "Hyatt",
    "check-in": "2023-06-07",
    "check-out": "2023-06-13"
}
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If passed in an invalid `userID`, returns an error with the message: `UserID is not found, please try again.`
- Possible 500 errors (all plain text):
  - If something else goes wrong on the server, returns an error with the message: `Something went wrong. Please try again later.`

## Hotel availability
**Request Format:** /availability?hotel_nm={hotelName}&start={check-in}&end={check-out}

**Request Type:** GET

**Returned Data Format**: plain text

**Description:** Given a valid hotelName, check-in and check-out date (this is the same format as given by the response detailed in the user reservations query), return plain text indicating the availability of the hotel.

**Example Request:** /availability?hotel_nm=Hyatt&start=2023-06-09&end=2023-06-13

**Example Response:**
```
booked
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If passed in an invalid `hotelName`, returns an error with the message: `hotelName is not found`
  - If passed in invalid `check-in` `check-out` dates, returns an error with the message: `The dates are invalivd`
- Possible 500 errors (all plain text):
  - If something else goes wrong on the server, returns an error with the message: `Something went wrong. Please try again later.`

