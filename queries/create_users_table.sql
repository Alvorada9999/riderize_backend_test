CREATE TABLE IF NOT EXISTS riderize.users (
  id uuid DEFAULT gen_random_uuid() UNIQUE PRIMARY KEY,
  name varchar(256) NOT NULL,
  --The maximum length of an email address is defined in RFC 5321 and RFC 5322
  email varchar(320) NOT NULL,
  password varchar(256) NOT NULL,
  password_salt varchar(32) NOT NULL
);
