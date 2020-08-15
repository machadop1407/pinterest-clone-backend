const graphql = require("graphql");

const { GraphQLObjectType, GraphQLString, GraphQLID } = graphql;

const SavedPinType = new GraphQLObjectType({
  name: "SavedPins",
  fields: () => ({
    id: { type: GraphQLID },
    googleId: { type: GraphQLString },
    imageUrl: { type: GraphQLString },
  }),
});

module.exports = SavedPinType;
