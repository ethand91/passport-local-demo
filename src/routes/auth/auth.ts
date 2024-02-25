import { Request, Response, NextFunction, Router } from 'express';
import { passport } from './passport';
import { insertUser } from './../../db';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
    try {
        if (req.body.password !== req.body.passwordConfirmation) {
            res.status(401).send('Passwords do not match');

            return;
        }

        await insertUser(req.body.email, req.body.password);

        res.status(201).send('User was created');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

router.post('/login', passport.authenticate('local'), (req: Request, res: Response) => {
    console.log('login request');
    res.send('Logged in successfully');
});

export { router };
