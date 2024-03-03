import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import { fetchOrCreateByGoogleId, deserializeUserById } from './../../../db';
require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: (process.env.GOOGLE_CLIENT_ID as string),
    clientSecret: (process.env.GOOGLE_CLIENT_SECRET as string),
    callbackURL: '/auth/google/callback'
}, async (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void) => {
    try {
        const user = await fetchOrCreateByGoogleId(profile.id, profile.emails![0].value);

        return done(null, user);
    } catch (error) {
        console.error(error);

        return done(error);
    }
}));

passport.serializeUser((user: any, done) => {
    done(null, user.rows[0].id);
});

passport.deserializeUser(async (id: number, done) => {
    try {
        const user = await deserializeUserById(id);

        done(null, (user as Express.User));
    } catch (error) {
        done(error, null);
    }
});

export { passport };
