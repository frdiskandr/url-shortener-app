CREATE DATABASE shortener_url;

CREATE Table Users(
  ID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE Table Shorter_url(
  ID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_ID INT NOT NULL,
  original_url VARCHAR(500) NOT NULL,
  shorter_url VARCHAR(500) NOT NULL,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER Table Shorter_url ADD constraint fk_user
Foreign Key (user_ID) REFERENCES Users(ID);

insert into Users (username) VALUES ('farid');
insert into Shorter_url(user_ID, Shorter_url, original_url) VALUES (1, 'none', 'none');

CREATE TABLE RequestLogs(
  ID INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ipAddress VARCHAR(24),
  userAgent VARCHAR(255),
  referrer VARCHAR(255),
  timeReq TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  url VARCHAR(255),
  method VARCHAR(20),
  protocol VARCHAR(28),
  hostname VARCHAR(255)
);

SELECT * FROM requestLogs;