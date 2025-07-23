CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SCHEMA IF NOT EXISTS riderize;

CREATE TABLE IF NOT EXISTS riderize.users (
  id uuid DEFAULT gen_random_uuid() UNIQUE PRIMARY KEY,
  name varchar(256) NOT NULL,
  --The maximum length of an email address is defined in RFC 5321 and RFC 5322
  email varchar(320) NOT NULL,
  password varchar(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS riderize.rides (
  id uuid DEFAULT gen_random_uuid() UNIQUE PRIMARY KEY,
  user_id uuid REFERENCES riderize.users(id) ON DELETE CASCADE,
  name varchar(256) NOT NULL,
  start_date timestamptz NOT NULL,
  start_date_registration timestamptz NOT NULL,
  end_date_registration timestamptz NOT NULL,
  additional_information varchar(256),
  start_place varchar(256) NOT NULL,
  participants_limit integer
);

CREATE INDEX idx_rides_user_id ON riderize.rides(user_id);


CREATE TABLE IF NOT EXISTS riderize.subscriptions (
  user_id uuid REFERENCES riderize.users(id) ON DELETE CASCADE,
  ride_id uuid REFERENCES riderize.rides(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, ride_id),
  subscription_date timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_user_id ON riderize.subscriptions(ride_id);
