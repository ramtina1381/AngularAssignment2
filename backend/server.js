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
// const server = new ApolloServer({ typeDefs, resolvers });

// async function startServer() {
//   await server.start();
//   server.applyMiddleware({ app });
//   console.log(`Server running on http://localhost:${process.env.PORT || 4000}/graphql`);
// }

// // Vercel expects an exported async handler
// module.exports = async (req, res) => {
//   if (!server.listening) {
//     await startServer();
//   }
//   return app(req, res); // Respond with the app's express request handler
// };

