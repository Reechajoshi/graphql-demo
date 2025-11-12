var { graphql, buildSchema } = require("graphql")
var express = require("express");
var { createHandler } =  require("graphql-http/lib/use/express");
var {ruruHTML} = require("ruru/server")
const {GraphQLSchema, GraphQLObjectType, GraphQLString} = require("graphql/type");

// var schema = buildSchema(`
//   type Query {
//     hello(name: String!): String
//     age: Int
//     weight: Float!
//     isOver19: Boolean
//     hobbies: [String]
//     user: User
//   }
//
//   type User {
//   id: Int
//   name: String
//   }
// `)

const User = new GraphQLObjectType({
    name: "User",
    fields: {
        id: {type: GraphQLString},
        name: {
            type: GraphQLString,
            resolve: (obj) => {
                const name = obj.name.trim().toLowerCase();
                if (obj.isAdmin) {
                    return `${name} (Admin)`
                }
                return name;
            }
        }
    }
})

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "Query",
        fields: {
            hello: {
                type: GraphQLString,
                resolve: ({name}) => `Hello ${name || "World"}!`
            },

            user: {
                type: User,
                resolve: () => ({id: 1, name: "   John Doe   ", isAdmin: true})
            }
        }
    })
})

// var rootValue = {
//     hello: ({name}) => `Hello ${name || "World"}!`,
//     age: () => 20,
//     weight: 77.7,
//     isOver19: () => true,
//     hobbies: () => ["coding", "reading"],
//     user: () => ({id: 1, name: "John Doe"})
// }

/*var source = "{ hello, age }"

graphql({ schema, source, rootValue }).then(response => {
    console.log(response)
})*/

const app = express();

app.all("/graphql", createHandler({ schema }));

app.get("/", (req, res) => {
    res.type("html");
    res.end(ruruHTML({endpoint: "/graphql"}))
})

app.listen(4000);
console.log("Server running on localhost:4000");