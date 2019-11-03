import { ApolloServer, gql, IResolvers } from 'apollo-server-koa';
import { TodoRepo } from '../entities/TodoList';

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
const resolvers: IResolvers = {
  Query: {
    todos: (root, { userId }) => TodoRepo().find({ userId }),
  },
  Mutation: {
    createTodo: (root, { userId, content, status }) => (
      TodoRepo().save({ userId, content, status })
    ),
    updateTodo: async (root, { id, userId, content, status }) => {
      const todo = await TodoRepo().findOne({ id, userId });
      return todo && TodoRepo().save({ ...todo, content, status })
        .then(Boolean);
    },
    removeTodo: (root, { id, userId }) => (
      TodoRepo().delete({ id, userId }).then((res) => Boolean(res.affected))
    ),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

export default server.getMiddleware();
