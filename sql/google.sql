ALTER TABLE users
ADD COLUMN googleId VARCHAR(255);

ALTER TABLE users
ALTER COLUMN password DROP NOT NULL;
