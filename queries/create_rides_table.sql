CREATE TABLE IF NOT EXISTS riderize.rides (
  id uuid DEFAULT gen_random_uuid() UNIQUE PRIMARY KEY,
  user_id uuid REFERENCES riderize.users(id) ON DELETE CASCADE,
  name varchar(256) NOT NULL,
  start_date timestamptz NOT NULL,
  start_date_registration timestamptz NOT NULL
  end_date_registration timestamptz NOT NULL
  additional_information varchar(256),
  start_place varchar(256) NOT NULL,
  participants_limit integer
);
