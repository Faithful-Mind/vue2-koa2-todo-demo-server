const { ApolloServer, gql } = require('apollo-server-koa');
const todolist = require('../models/todolist.js');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Todo {
    id: Int
    status: Boolean
    content: String
  }
  type Query {
    todos(userId: Int!): [Todo]
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    todos: (root, { userId }) => todolist.getTodolistById(userId),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

module.exports = server.getMiddleware();
