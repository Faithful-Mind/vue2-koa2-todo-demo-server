import { ApolloServer, gql, IResolvers } from 'apollo-server-koa';
import { getRepository } from 'typeorm';
import { TodoList } from '../entities/TodoList';

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
    todos: (root, { userId }) => getRepository(TodoList).find({ userId }),
  },
  Mutation: {
    createTodo: (root, { userId, content, status }) => (
      getRepository(TodoList).save({ userId, content, status })
    ),
    updateTodo: async (root, { id, userId, content, status }) => {
      const todo = await getRepository(TodoList).findOne({ id, userId });
      return todo && getRepository(TodoList).save({ ...todo, content, status })
        .then(Boolean);
    },
    removeTodo: (root, { id, userId }) => (
      getRepository(TodoList).delete({ id, userId }).then((res) => Boolean(res.affected))
    ),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

export default server.getMiddleware();
