CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE INDEX idx_rides_user_id ON riderize.rides(user_id);

CREATE INDEX idx_subscriptions_user_id ON riderize.subscriptions(ride_id);
