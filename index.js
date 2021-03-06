const { GraphQLServer } = require("graphql-yoga");

const typeDefs = `
    type Query {
        hello(name: String!): String!
        getUsers: [User]!
        getUser(id: ID!): User!
    }

    type Mutation{
        createUser(name:String!, age:Int!): User!
        updateUser(id: ID!, name:String!, age:Int!): User!
        deleteUser(id: ID!): String!
    }

    type User {
        id: Int!
        name: String!
        age: Int!
    }
`;

const users = [];

const resolvers = {
  Query: {
    hello: (root, params, context, info) => `Hola ${params.name}`,
    getUsers: (root, params, context, info) => users,
    getUser: (root, { id }, context, info) => users.find(u => u.id == id)
  },
  Mutation: {
    createUser: (root, { name, age }, context, info) => {
      const user = {
        id: users.length + 123214,
        name,
        age
      };
      users.push(user);
      return user;
    },
    updateUser: (root, { id, name, age }, context, info) => {
      users.map(item => {
        if (item.id == id) {
          item.name = name;
          item.age = age;
        }
      });
      return users.find(u => u.id == id);
    },
    deleteUser: (root, { id }, context, info) => {
      users.find((u, i) => {
        if (u.id == id) {
          users.splice(i, 1);
        }
      });
      return "Usuario eliminado";
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => console.log("Servidor arriba en puerto 4000"));
