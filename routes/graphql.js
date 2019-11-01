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
  type Mutation {
    createTodo(userId: Int!, content: String!, status: Boolean): Todo
    updateTodo(id: Int!, userId: Int!, content: String, status: Boolean): Boolean
    removeTodo(id: Int!, userId: Int!): Boolean
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    todos: (root, { userId }) => todolist.getTodolistById(userId),
  },
  Mutation: {
    createTodo: (root, { userId, content, status }) => (
      todolist.createTodolist({ id: userId, content, status })
        .then((todo) => todo.toJSON())
    ),
    updateTodo: (root, { id, userId, content, status }) => (
      todolist.updateTodolist(id, userId, { content, status })
    ),
    removeTodo: (root, { id, userId }) => (
      todolist.removeTodolist(id, userId)
    ),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

module.exports = server.getMiddleware();
