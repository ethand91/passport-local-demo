import { Pool } from 'pg';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import bcrypt from 'bcrypt';

const pgSessionStore = pgSession(session);

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const testConnection = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        pool.connect((error, client, release) => {
            if (error || !client) {
                reject(new Error('Failed to connect to the database'));
            }

            release();
            resolve();
        })
    });   
};

const insertUser = async (email: string, password: string): Promise<void> => {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);
};

const authenticateUserByEmail = async (email: string, password: string): Promise<Express.User | Error> => {
    const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (res.rows.length) {
        const user = res.rows[0];
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            return user;
        } else {
            throw new Error('Incorrect email and/or password');
        }
    } else {
        throw new Error('User not found');
    }
};

const fetchOrCreateByGoogleId = async (googleId: string, email: string): Promise<any | Error> => {
    const res = await pool.query('SELECT * FROM users WHERE googleId = $1', [googleId]);

    if (res.rows.length) {
        return res.rows[0];
    }

    const newUser = await pool.query('INSERT INTO users (googleId, email) VALUES ($1, $2) RETURNING *', [googleId, email]);

    return newUser;
};

const deserializeUserById = async (id: number): Promise<Express.User | Error> => {
    const res = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

    if (res.rows.length) {
        return res.rows[0];
    } else {
        throw new Error('User was not found');
    }
};

export {
    pgSessionStore,
    pool,
    testConnection,
    insertUser,
    authenticateUserByEmail,
    fetchOrCreateByGoogleId,
    deserializeUserById
};
