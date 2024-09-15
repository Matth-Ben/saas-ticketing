const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/User')

passport.use(new GoogleStrategy({
    clientID: '',
    clientSecret: '',
    callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    const { id, emails } = profile
    try {
        let user = await User.findOne({ googleId: id })
        if (!user) {
            user = new User({ googleId: id, email: emails[0].value })
            await user.save()
        }
        done(null, user)
    } catch (error) {
        done(error, null)
    }
}))

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})
