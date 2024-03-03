import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import { authRoutes, localPassport, googlePassport, protectedRoutes } from './routes';
import { pool, pgSessionStore, testConnection } from './db';
require('dotenv').config();

declare global {
    namespace Express {
        interface User {
            id: number;
            email: string;
            password: string
        }
    }
}

const app = express();

app.use(bodyParser.json());

app.use(session({
    store: new pgSessionStore({
        pool,
        tableName: 'session'
    }),
    secret: (process.env.SESSION_SECRET as string),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    }
}));

app.use(localPassport.initialize());
app.use(localPassport.session());

app.use(googlePassport.initialize());
app.use(googlePassport.session());

app.use(authRoutes);
app.use(protectedRoutes);

testConnection()
    .then(() => {
        console.log('Connection to database success');
    }).catch(() => {
        console.error('Failed to connect to database');
        process.exit(1);
    });

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
