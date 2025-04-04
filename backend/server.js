// require("dotenv").config();
// const express = require("express");
// const { ApolloServer } = require("apollo-server-express");
// const connectDB = require("./config/db");
// const typeDefs = require("./graphql/typeDefs");
// const resolvers = require("./graphql/resolvers");

// connectDB();

// const app = express();
// const server = new ApolloServer({ typeDefs, resolvers });

// async function startServer() {
//   await server.start();
//   server.applyMiddleware({ app });

//   app.listen(4000, () => console.log("Server running on http://localhost:4000/graphql"));
// }

// startServer();
require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const connectDB = require("./config/db");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

connectDB();

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

let apolloServerStarted = false;

async function startApolloServer() {
  await server.start();
  server.applyMiddleware({ app, path: '/api/graphql' }); // Specify the /api/graphql path
  apolloServerStarted = true;
}

async function initializeServer() {
  if (!apolloServerStarted) {
    await startApolloServer();
  }
}

module.exports = async (req, res) => {
  await initializeServer();
  return app(req, res);
};

// Optional: Handle the root path if you want a message there
app.get('/', (req, res) => {
  res.send('GraphQL API is available at /api/graphql');
});

// Optional: Handle favicon requests
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});