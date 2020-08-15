const graphql = require("graphql");

const { GraphQLObjectType, GraphQLString, GraphQLID } = graphql;

const PinType = new GraphQLObjectType({
  name: "Pin",
  fields: () => ({
    id: { type: GraphQLID },
    imageUrl: { type: GraphQLString },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    link: { type: GraphQLString },
    userId: { type: GraphQLString },
  }),
});

module.exports = PinType;
