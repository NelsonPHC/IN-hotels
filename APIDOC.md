# Hotel API Documentation
The Hotel API provides information about user logins and their reservations, availability of hotels, as well as make a booking.
## 1. User login
**Request Format:** /login

**Request Parameters:** POST parameters `name`, `password`

**Request Type:** POST

**Returned Data Format**: plain text

**Description:** Given a valid `name` and a `password` to login, the server will set the cookie with key `uid` to the corresponding user ID and reply with a plain text response indicating if the login is succesful.

**Example Request:** /login with POST parameters of `name=Nelson` and `password=Nel123`

**Example Response:**
```
you are now logged in
```
(Now cookie has key `uid` set to `1`)

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If missing username or password, returns an error with the message: `Please enter both Username and Password`
  - If passed in an invalid username or password, returns an error with the message: `Username or Password is incorrect, please try again`
- Possible 500 errors (all plain text):
  - If something else goes wrong on the server, returns an error with the message: `An error occurred on the server. Try again later.`

## 1-1. Create a New User
**Request Format:** /create

**Request Parameters:** POST parameters `name`, `password`, and `email`

**Request Type:** POST

**Returned Data Format**: plain text

**Description:** Given a `name` and a `password`, and `email` to create, the server  reply with a plain text response indicating if the user `name` is created succesfully.

**Example Request:** /create with POST parameters of `name=Nelson`, `password=Nel123`, `email=nelsonpc@uw.edu`

**Example Response:**
```
User Nelson is created!
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If missing any of `name`, `email`, or `password`, returns an error with the message: `Please enter Email, Username and Password`
  - If passed in an existing `name` or `email`, returns an error with the message: `Username or Email is already registered, please try again`
- Possible 500 errors (all plain text):
  - If something else goes wrong on the server, returns an error with the message: `An error occurred on the server. Try again later.`

## 2. Get all hotel data or hotel data that matches the search and/or filter criteria

**Request Format:** /hotels

**Query Parameters (optional):** `search`, `country_filter`, `min`, `max`

**Request Type (both requests)):** GET

**Returned Data Format**: JSON

**Description 1:** If the parameters are not included in the request, gets the `hid`, `hotelName`, `country`, `imageSrc`, `citation`, `description`, `rating`	`price_per_night` from the `hotel` table and outputs JSON containing the information in alphabetical order of `hotelName`, breaking ties by `country` alphabetically.

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
      "citation": "Trip Advisor",
      "description": "Hilton Singapore Orchard is a new and inspiring landmark hotel for the brand in Singapore and the region. ...",
      "rating": 4.5,
      "price_per_night": 254
    },
    {
      "hid": 2,
      "hotelName": "Marina Bay Sands",
      "country": "Singapore",
      "imageSrc": "marina.jpg",
      "citation": "Veena World",
      "description": "Marina Bay Sands is an integrated resort located at the Bayfront Subzone in Downtown Core.  ...",
      "rating": 4.6,
      "price_per_night": 582
    },
    ...
  ]
}
```

**Description 2:** If at least one of the `search`, `country_filter`, `min`, `max` parameters are included in the request, respond with all the ordered hotel IDs (`hid`) of the hotels whose `hotelName` matches the term passed in the `search` query parameter and/or `country` equals the filtering country passed in the `country_filter` query parameter and/or having `price_per_night` >= `min` and/or `price_per_night` <= `max`. A "match" in `search` would be any `hotelName` that has the `search` term in any position meaning that the term "hilton" should match any `hotelName` containing the words "hilton", "DoubleTree by Hilton Taipei Zhongshan" or "Hilton Queenstown Resort & Spa" (as an example, not exhaustive, more matches are possible).

**Example Request 2-1:** /hotels?search=hilton

**Example Response 2-1:**
```json
{
  "hotels":[
    {
      "hid": 1
    },
    {
      "hid": 4
    },
    {
      "hid": 24
    }
  ]
}
```

**Example Request 2-2:** /hotels?search=hilton&country_filter=singapore

**Example Response 2-2:**
```json
{
  "hotels":[
    {
      "hid": 1
    }
  ]
}
```

**Example Request 2-3:** /hotels?search=hilton&min=200

**Example Response 2-3:**
```json
{
  "hotels": [
    {
      "hid": 1
    },
    {
      "hid": 4
    }
  ]
}
```

**Example Request 2-4:** /hotels?search=hilton&min=200&max=250

**Example Response 2-4:**
```json
{
  "hotels": [
    {
      "hid": 4
    }
  ]
}
```
- Possible 400 (invalid request) errors (all plain text):
  - If `min` or `max` is not of proper integer string format (including integer strings with leading zeros), returns an error with the message: `please input proper integer string format for min and max`
  - If `min` is bigger than `max`, returns an error with the message: `min must be less than or equal to max`
- Possible 500 errors (all plain text):
  - If something else goes wrong on the server, returns an error with the message: `An error occurred on the server. Try again later.`

## 3. Get hotel data by a given hotel ID

**Request Format:** /hotels/:hid

**Query Parameters:** none.

**Request Type (both requests)):** GET

**Returned Data Format**: JSON

**Description:** Gets the `hid`, `hotelName`, `country`, `imageSrc`, `citation`, `description`, `rating`	`price_per_night` from the `hotel` table with the specified `hid`. The `hid` is taken exactly as passed in the request. This endpoint is intended for our item page.

**Example Request:** /hotels/1

**Example Response:**
```json
{
  "hid": 1,
  "hotelName": "Hilton",
  "country": "Singapore",
  "imageSrc": "hilton.jpg",
  "citation": "Trip Advisor",
  "description": "Hilton Singapore Orchard is a new and inspiring landmark hotel for the brand in Singapore and the region. ...",
  "rating": 4.5,
  "price_per_night": 254
}
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If `hid` is not an existing hotel ID, returns an error with the message: `hotel is not found`
- Possible 500 errors (all plain text):
  - If something else goes wrong on the server, returns an error with the message: `An error occurred on the server. Try again later.`

## 4. Make a booking
**Request Format:** /book

**Request Parameters:** POST parameters of hotel ID `hid`, `checkin`, and `checkout`; cookie key `uid`.

**Request Type:** POST

**Returned Data Format**: plain text

**Description:** Given a valid `uid`, `hid`, `checkin` and `checkout` datetime, return plain text indicating if the reservation is success.

**Example Request:** /book with POST parameters of `hid=1`, `checkin=2023-06-07 13:00`, `checkout=2023-06-13 13:00`, and cookie key `uid=1`

**Example Response:**
```
Booking has been successful! Your transaction number is 1. Please wait for a moment!
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If `uid` is missing, returns an error with the message: `You need to log in first to make a booking`
  - If any of the POST parameters `hid`, `checkin`, and `checkout` is missing, returns an error with the message: `Missing required parameters`
  - If passed in an invalid user ID `uid`, returns an error with the message: `user is not found`
  - If passed in an invalid hotel ID `hid`, returns an error with the message: `hotel is not found`
  - If passed in invalid `checkin` `checkout` datetimes (e.g., datetimes are not of format YYYY-MM-DD HH:MI, `checkin` is before `checkout`), returns an error with the message: `The datetimes are invalid`
  - If the hotel is already booked between the `checkin` `checkout` datetimes, returns an error with the message: `We're sorry, this hotel has already been booked in this timeslot, please choose a different date.`
- Possible 500 errors (all plain text):
  - If something else goes wrong on the server, returns an error with the message: `An error occurred on the server. Try again later.`

## 5. Get all previous reservations for a designated user
**Request Format:** /reservations endpoint with POST parameters of user ID `uid`

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** Given a valid user ID `uid` (this is the same user id format as given by the response detailed in the user login query), return a JSON response with all the reservations of that user, ordered by `checkin` date, breaking ties by `checkout`. Each reservation record have a transaction number `bid`, hotel name `hotelName`, `imageSrc`, `checkin` datetime, `checkout` datetime, and `price_per_night`.

**Example Request:** /reservations with POST parameters of user ID `uid`=1 (Hilton has `hid`=1 in our example here)

**Example Response:**
```json
[
  {
    "bid": 1,
    "hotelName": "Hilton",
    "imageSrc": "hilton.jpg",
    "checkin": "2023-06-07",
    "checkout": "2023-06-13",
    "price_per_night": 254
  }
]

```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If passed in an invalid user ID `uid`, returns an error with the message: `user is not found`
- Possible 500 errors (all plain text):
  - If something else goes wrong on the server, returns an error with the message: `An error occurred on the server. Try again later.`

## 6. Hotel availability (X)
**Request Format:** /availability?hotel_id={hid}&start={checkin}&end={checkout}

**Request Type:** GET

**Returned Data Format**: plain text

**Description:** Given a valid hotel ID `hid`, `checkin` and `checkout` datetimes (this is the same format as given by the response detailed in the user reservations query), return plain text indicating the availability of the hotel ('unavailable'/'available').

**Example Request:** /availability?hotel_id=1&start=2023-06-09&end=2023-06-13

**Example Response:**
```
unavailable
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If passed in an invalid hotel ID `hid`, returns an error with the message: `hotel is not found`
  - If passed in invalid `checkin` `checkout` dates, returns an error with the message: `The dates are invalid`
- Possible 500 errors (all plain text):
  - If something else goes wrong on the server, returns an error with the message: `An error occurred on the server. Try again later.`
