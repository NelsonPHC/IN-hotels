# Hotel API Documentation
The Hotel API provides information about user logins and their reservations, availability of hotels, as well as make a booking.
## User login
**Request Format:** /user endpoint with POST parameters of `name` and `password`

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** Given a valid `name` and a `password` to login, the server will reply with a JSON response with the user name and its corresponding user ID `uid`.

**Example Request:** /user with POST parameters of `name=Nelson` and `password=abc`

**Example Response:**
```json
{
    "uid": "1",
    "name": "Nelson"
}
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If passed in an invalid user name or password, returns an error with the message: `User name or password is incorrect, please try again`
- Possible 500 errors (all plain text):
  - If something else goes wrong on the server, returns an error with the message: `Something went wrong. Please try again later.`

## User reservations
**Request Format:** /reservations endpoint with POST parameters of user ID `uid`

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** Given a valid user ID `uid` (this is the same user id format as given by the response detailed in the user login query), return a JSON response with all the reservations of that user. Each reservation record have a hotel `hotelName`, `check-in` date, and `check-out` date.

**Example Request:** /reservations with POST parameters of user ID `uid` (Hyatt has `hid`=1 in our example here)

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
  - If passed in an invalid user ID `uid`, returns an error with the message: `User is not found, please try again.`
- Possible 500 errors (all plain text):
  - If something else goes wrong on the server, returns an error with the message: `Something went wrong. Please try again later.`

## Make a booking
**Request Format:** /book endpoint with POST parameters of user ID `uid`, hotel ID `hid`, `check-in`, `check-out`.

**Request Type:** POST

**Returned Data Format**: plain text

**Description:** Given a valid `uid`, `hid`, `check-in` and `check-out` date, return plain text indicating if the reservation is success ('success'/'fail').

**Example Request:** /book with POST parameters of `uid=1`, `hid=1`, `check-in=2023-06-07` and `check-out=2023-06-13`

**Example Response:**
```
success
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If passed in an invalid hotel ID `hid`, returns an error with the message: `hotel is not found`
  - If passed in an invalid user ID `uid`, returns an error with the message: `user is not found`
  - If passed in invalid `check-in` `check-out` dates, returns an error with the message: `The dates are invalid`
- Possible 500 errors (all plain text):
  - If something else goes wrong on the server, returns an error with the message: `Something went wrong. Please try again later.`

## Hotel availability
**Request Format:** /availability?hotel_id={hid}&start={check-in}&end={check-out}

**Request Type:** GET

**Returned Data Format**: plain text

**Description:** Given a valid hotel ID `hid`, `check-in` and `check-out` date (this is the same format as given by the response detailed in the user reservations query), return plain text indicating the availability of the hotel ('unavailable'/'available').

**Example Request:** /availability?hotel_id=1&start=2023-06-09&end=2023-06-13

**Example Response:**
```
unavailable
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If passed in an invalid hotel ID `hid`, returns an error with the message: `hotel is not found`
  - If passed in invalid `check-in` `check-out` dates, returns an error with the message: `The dates are invalid`
- Possible 500 errors (all plain text):
  - If something else goes wrong on the server, returns an error with the message: `Something went wrong. Please try again later.`


