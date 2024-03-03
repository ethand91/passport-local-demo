import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { authenticateUserByEmail, deserializeUserById } from './../../../db';

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {
        try {
            const user = await authenticateUserByEmail(email, password);

            return done(null, (user as Express.User));
        } catch (error) {
            return done(error);
        }
    }
));

passport.serializeUser((user: Express.User, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
    try {
        const user = await deserializeUserById(id);

        done(null, (user as Express.User));
    } catch (error) {
        done(error, null);
    }
});

export { passport }
