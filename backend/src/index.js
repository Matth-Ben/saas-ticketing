const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const { loadSchemaSync } = require('@graphql-tools/load');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');
const resolvers = require('./resolvers');
const connectDB = require('../config/db');

const typeDefs = loadSchemaSync('./src/schemas/schema.graphql', {
  loaders: [new GraphQLFileLoader()],
});

const app = express();

async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start(); // Démarre le serveur Apollo

  server.applyMiddleware({ app });

  connectDB(); // Connexion à MongoDB

  app.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  });
}

startServer(); // Appelle la fonction asynchrone pour démarrer le serveur
