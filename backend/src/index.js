const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schemas/schema.graphql');
const resolvers = require('./resolvers');
const connectDB = require('../config/db');
const authMiddleware = require('../middlewares/authMiddleware');
require('dotenv').config();

const app = express();

// Connecter à la base de données
connectDB();

// Utiliser les middlewares
app.use(authMiddleware);

// Configurer Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });
server.start().then(res => {
  server.applyMiddleware({ app });

  // Démarrer le serveur
  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
});