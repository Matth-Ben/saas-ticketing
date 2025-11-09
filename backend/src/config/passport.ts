import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from '../utils/prisma';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:4000/api/auth/google/callback';

export function configurePassport() {
  // Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const googleId = profile.id;

          if (!email) {
            return done(new Error('Aucun email fourni par Google'), undefined);
          }

          // 1. Try to find user by Google ID
          let user = await prisma.user.findUnique({
            where: { googleId },
          });

          if (user) {
            // User found with Google ID - update last login
            await prisma.user.update({
              where: { id: user.id },
              data: {
                lastLogin: new Date(),
                sessionCount: { increment: 1 },
              },
            });
            return done(null, user);
          }

          // 2. Try to find user by email (for account linking)
          user = await prisma.user.findUnique({
            where: { email },
          });

          if (user) {
            // User exists with this email - link Google account
            user = await prisma.user.update({
              where: { id: user.id },
              data: {
                googleId,
                emailVerified: true, // Google verifies emails
                avatar: user.avatar || profile.photos?.[0]?.value,
                firstName: user.firstName || profile.name?.givenName,
                lastName: user.lastName || profile.name?.familyName,
                lastLogin: new Date(),
                sessionCount: { increment: 1 },
              },
            });
            return done(null, user);
          }

          // 3. Create new user with Google account
          user = await prisma.user.create({
            data: {
              email,
              googleId,
              firstName: profile.name?.givenName,
              lastName: profile.name?.familyName,
              avatar: profile.photos?.[0]?.value,
              emailVerified: true,
              role: 'freelance', // Default role
            },
          });

          return done(null, user);
        } catch (error) {
          return done(error as Error, undefined);
        }
      }
    )
  );

  // Serialize user for the session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from the session
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
}
