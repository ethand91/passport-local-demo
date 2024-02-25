CREATE SEQUENCE users_id_seq;

CREATE TABLE users (
    id INTEGER NOT NULL DEFAULT nextval('users_id_seq'),
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (email)
);

ALTER SEQUENCE users_id_seq OWNED BY users.id;

CREATE INDEX ON users (email);
