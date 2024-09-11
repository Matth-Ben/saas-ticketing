const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');

const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const resolvers = {
  Query: {
    users: async () => await User.find(),
  },
  Mutation: {
    register: async (_, { email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ email, password: hashedPassword });
      await user.save();
      const token = generateToken(user);
      return { ...user.toObject(), token };
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('Utilisateur non trouvé');
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Mot de passe incorrect');
      const token = generateToken(user);
      return { ...user.toObject(), token };
    },
    googleLogin: async (_, { idToken }) => {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: GOOGLE_CLIENT_ID,
      });
      const { email } = ticket.getPayload();
      let user = await User.findOne({ email });
      if (!user) {
        user = new User({ email });
        await user.save();
      }
      const token = generateToken(user);
      return { ...user.toObject(), token };
    },
  },
};

module.exports = resolvers;