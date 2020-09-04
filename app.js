const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

//GraphQL imports
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schemas");

//MySLQ Connection
const db = require("./models");

const app = express();

app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

db.sequelize.sync().then((req) => {
  app.listen(process.env.PORT || 3001, () => {
    console.log("server running on port 3001");
  });
});
