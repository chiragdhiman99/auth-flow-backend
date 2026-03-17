const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/usermodel");
const sendEmail = require("../utils/sendemail");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
   async (accessToken, refreshToken, profile, done) => {
  try {
      const user = await User.findOne({ email: profile.emails[0].value });
      if (user) {
          return done(null, user);
      } else {
          const newUser = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              avatar: profile.photos[0].value,
              googleId: profile.id,
          });
            await sendEmail(
        profile.emails[0].value,
        'Welcome to AuthApp!',
        `<h1>Welcome ${profile.displayName}!</h1><p>Your account has been created successfully.</p>`
    )
          return done(null, newUser);
      }
  } catch (error) {
      return done(error, null)
  }
}
  ),
);

module.exports = passport;
