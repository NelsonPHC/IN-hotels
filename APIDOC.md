# Hotel API Documentation
The Hotel API provides information about user logins and their reservations, as well as availability of hotels.
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
    "check-in": "2023/6/7",
    "check-out": "2023/6/13"
}
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If passed in an invalid `userID`, returns an error with the message: `UserID is not found, please try again.`
- Possible 500 errors (all plain text):
  - If something else goes wrong on the server, returns an error with the message: `Something went wrong. Please try again later.`

