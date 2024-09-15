const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
require('./config/passport')

const app = express()
app.use(express.json())

// Configuration session
app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: true,
}))

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/saas-ticketing', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connecté'))
  .catch((err) => console.log(err))

// Routes d'authentification
app.use('/api/auth', require('./routes/auth'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`)
})