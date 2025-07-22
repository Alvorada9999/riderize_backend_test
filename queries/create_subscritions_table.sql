CREATE TABLE IF NOT EXISTS riderize.subscriptions (
  user_id uuid REFERENCES riderize.users(id) ON DELETE CASCADE,
  ride_id uuid REFERENCES riderize.rides(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, ride_id),
  subscription_date timestamptz DEFAULT CURRENT_TIMESTAMP
);
