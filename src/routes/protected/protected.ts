import { Request, Response, NextFunction, Router } from 'express';
import { ensureAuthenticated } from './../auth';

const router = Router();

router.get('/protected', ensureAuthenticated, (req: Request, res: Response) => {
    res.send('You are logged in, so you can see this');
});

export { router }
