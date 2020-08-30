const graphql = require("graphql");
const { User, Pin, SavedPins } = require("../models");

//TypeDefs
const UserType = require("./UserSchema/index");
const PinType = require("./PinSchema/index");
const SavedPinType = require("./SavedPinsSchema/index");

const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
} = graphql;

//RootQuery
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    latestPins: {
      type: new GraphQLList(PinType),
      resolve(parent, args) {
        return Pin.findAll({
          order: [["updatedAt", "DESC"]],
          limit: 20,
        });
      },
    },

    myPins: {
      type: new GraphQLList(PinType),
      args: { userId: { type: GraphQLString } },
      resolve(parent, args) {
        return Pin.findAll({
          where: {
            userId: args.userId,
          },
        });
      },
    },

    getPinByImageURL: {
      type: new GraphQLList(PinType),
      args: { imageUrl: { type: GraphQLString } },
      resolve(parent, args) {
        return Pin.findAll({
          where: {
            imageUrl: args.imageUrl,
          },
        });
      },
    },

    getSavedPins: {
      type: new GraphQLList(PinType),
      args: { googleId: { type: GraphQLString } },
      resolve(parent, args) {
        return SavedPins.findAll({
          where: {
            googleId: args.googleId,
          },
        });
      },
    },
  },
});

//Mutations
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // REGISTERS USER MUTATION
    createUser: {
      type: UserType,
      args: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        googleId: { type: GraphQLString },
      },
      resolve(parent, args) {
        User.create({
          firstName: args.firstName,
          lastName: args.lastName,
          email: args.email,
          googleId: args.googleId,
        }).catch((err) => {
          console.log(err);
        });
      },
    },

    // CREATE PIN MUTATION
    createPin: {
      type: PinType,
      args: {
        imageUrl: { type: GraphQLString },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        link: { type: GraphQLString },
        userId: { type: GraphQLString },
      },
      resolve(parent, args) {
        Pin.create({
          imageUrl: args.imageUrl,
          title: args.title,
          description: args.description,
          link: args.link,
          userId: args.userId,
        }).catch((err) => {
          console.log(err);
        });
      },
    },

    // DELETE PIN MUTATION
    deletePin: {
      type: PinType,
      args: {
        imageUrl: { type: GraphQLString },
      },
      resolve(parent, args) {
        Pin.destroy({
          where: {
            imageUrl: args.imageUrl,
          },
        }).catch((err) => {
          console.log(err);
        });
      },
    },

    // SAVE PIN MUTATION
    savePin: {
      type: SavedPinType,
      args: {
        googleId: { type: GraphQLString },
        imageUrl: { type: GraphQLString },
      },
      resolve(parent, args) {
        SavedPins.create({
          googleId: args.googleId,
          imageUrl: args.imageUrl,
        }).catch((err) => {
          console.log(err);
        });
      },
    },
  },
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation: Mutation });
