# Hotel API Documentation
The Hotel API provides information about user logins and their reservations, availability of hotels, as well as make a booking.
## User login
**Request Format:** /user endpoint with POST parameters of `name` and `password`

**Request Type:** POST

**Returned Data Format**: plain text

**Description:** Given a valid `name` and a `password` to login, the server will reply with a JSON response with the user name and its corresponding user ID `uid`.

**Example Request:** /user with POST parameters of `name=Nelson` and `password=abc`

**Example Response:**
```
1
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If passed in an invalid user name or password, returns an error with the message: `User name or password is incorrect, please try again`
- Possible 500 errors (all plain text):
  - If something else goes wrong on the server, returns an error with the message: `Something went wrong. Please try again later.`

## Get all hotel data or hotel data matching a given hotel ID

**Request Format:** /hotels

**Query Parameters:** hotel ID `hid` (optional)

**Request Type (both requests)):** GET

**Returned Data Format**: JSON

**Description 1:** If the `hid` parameter is not included in the request, gets the `hid`, `hotelName`, `country`, `imageSrc`, `description`, `rating`	`price_per_night` from the `hotel` table and outputs JSON containing the information.

**Example Request 1:** /hotels

**Example Response 1:** (abbreviated)
```json
{
  "hotels":[
    {
      "hid": 1,
      "hotelName": "Hilton",
      "country": "Singapore",
      "imageSrc": "hilton.jpg",
      "description": "Hilton Singapore Orchard is a new and inspiring landmark hotel for the brand in Singapore and the region. ...",
      "rating": 4.5,
      "price_per_night": 254
    },
    {
      "hid": 2,
      "hotelName": "Marina Bay Sands",
      "country": "Singapore",
      "imageSrc": "marina.jpg",
      "description": "Marina Bay Sands is an integrated resort located at the Bayfront Subzone in Downtown Core.  ...",
      "rating": 4.6,
      "price_per_night": 582
    },
    ...
  ]
}
```

**Description 2:** If the `hid` parameter is included in the request, only get the `hid`, `hotelName`, `country`, `imageSrc`, `description`, `rating`	`price_per_night` from the `hotel` table with the specified `hid` and outputs JSON containing the information.

**Example Request 2:** /hotels?hid=1

**Example Response 2:**
```json
{
  "hotels":[
    {
      "hid": 1,
      "hotelName": "Hilton",
      "country": "Singapore",
      "imageSrc": "hilton.jpg",
      "description": "Hilton Singapore Orchard is a new and inspiring landmark hotel for the brand in Singapore and the region. ...",
      "rating": 4.5,
      "price_per_night": 254
    }
  ]
}
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If passed in an invalid hotel ID `hid`, returns an error with the message: `hotel is not found.`
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


