import { Request, Response, NextFunction, Router } from 'express';
import { localPassport, googlePassport } from './passport';
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

router.post('/login', localPassport.authenticate('local'), (req: Request, res: Response) => {
    res.send('Logged in successfully');
});

router.get('/auth/google', googlePassport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', googlePassport.authenticate('google'), (req: Request, res: Response) => {
    res.send('Google auth login successful'); 
});

export { router };
