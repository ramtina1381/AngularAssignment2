require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const connectDB = require("./config/db");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

connectDB();

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  app.listen(4000, () => console.log("Server running on http://localhost:4000/graphql"));
}

startServer();
// require("dotenv").config();
// const express = require("express");
// const { ApolloServer } = require("apollo-server-express");
// const connectDB = require("./config/db");
// const typeDefs = require("./graphql/typeDefs");
// const resolvers = require("./graphql/resolvers");

// const app = express();

// async function createApolloHandler() {
//   await connectDB(); // Ensure DB is connected before handling requests

//   const server = new ApolloServer({ typeDefs, resolvers });
//   await server.start();
//   server.applyMiddleware({ app });

//   return app;
// }

// // Export a handler for Vercel
// module.exports = async (req, res) => {
//   const apolloApp = await createApolloHandler();
//   return apolloApp(req, res); // pass the req/res to Express app
// };
