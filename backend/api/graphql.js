// backend/api/graphql.js

const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const connectDB = require("../config/db");
const typeDefs = require("../graphql/typeDefs");
const resolvers = require("../graphql/resolvers");
require("dotenv").config();

let cachedServer = null;

async function createServer() {
  await connectDB();

  const app = express();
  const apolloServer = new ApolloServer({ typeDefs, resolvers });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: "/" }); // root path

  return app;
}

module.exports = async (req, res) => {
  if (!cachedServer) {
    cachedServer = await createServer();
  }
  return cachedServer(req, res);
};
