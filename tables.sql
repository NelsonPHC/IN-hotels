CREATE TABLE "users" (
	"uid"	INTEGER,
	"name"	TEXT,
	"password"	TEXT,
	"email"	TEXT,
	PRIMARY KEY("uid" AUTOINCREMENT)
);

CREATE TABLE "hotels" (
	"hid"	INTEGER,
	"hotelName"	TEXT,
	"country"	TEXT,
	"imageSrc"	TEXT,
	"citation"	TEXT,
	"description"	TEXT,
	"rating"	REAL,
	"price_per_night"	INTEGER,
	PRIMARY KEY("hid" AUTOINCREMENT)
);

CREATE TABLE "bookings" (
	"bid"	INTEGER,
	"uid"	INTEGER,
	"hid"	INTEGER,
	"checkin"	TEXT,
	"checkout"	TEXT,
	PRIMARY KEY("bid" AUTOINCREMENT),
	FOREIGN KEY("hid") REFERENCES "hotels"("hid"),
	FOREIGN KEY("uid") REFERENCES "users"("uid")
);