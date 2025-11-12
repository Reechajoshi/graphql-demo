var { graphql, buildSchema } = require("graphql")
var express = require("express");
var { createHandler } =  require("graphql-http/lib/use/express");
var {ruruHTML} = require("ruru/server")

var schema = buildSchema(`
  type Query {
    hello(name: String!): String
    age: Int
    weight: Float!
    isOver19: Boolean
    hobbies: [String]
  }
`)

var rootValue = {
    hello: ({name}) => `Hello ${name || "World"}!`,
    age: () => 20,
    weight: 77.7,
    isOver19: () => true,
    hobbies: () => ["coding", "reading"]
}

/*var source = "{ hello, age }"

graphql({ schema, source, rootValue }).then(response => {
    console.log(response)
})*/

const app = express();

app.all("/graphql", createHandler({ schema, rootValue }));

app.get("/", (req, res) => {
    res.type("html");
    res.end(ruruHTML({endpoint: "/graphql"}))
})

app.listen(4000);
console.log("Server running on localhost:4000");