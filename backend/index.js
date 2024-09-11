// index.js
const { ApolloServer, gql } = require('apollo-server');

// Définir le schéma GraphQL
const typeDefs = gql`
    type Project {
        id: ID!
        name: String!
    }

    type Query {
        projects: [Project]
    }

    type Mutation {
        createProject(name: String!): Project
    }
`;

// Stockage temporaire des projets en mémoire
const projects = [];

// Définir les résolveurs pour les requêtes et mutations GraphQL
const resolvers = {
    Query: {
        projects: () => projects,
    },
    Mutation: {
        createProject: (parent, args) => {
            const newProject = { id: projects.length + 1, name: args.name };
            projects.push(newProject);
            return newProject;
        },
    },
};

// Créer une instance d'Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

// Démarrer le serveur
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});