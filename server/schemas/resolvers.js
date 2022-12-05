const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async () => {
      return User.find();
    },

    // User: async (parent, { UserId }) => {
    //   return User.findOne({ _id: UserId });
    // },
    // By adding context to our query, we can retrieve the logged in user without specifically searching for them
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {
    addUser: async (parent, { name, email, password }) => {
      const user = await User.create({ name, email, password });
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No User with this email found!');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect password!');
      }

      const token = signToken(user);
      return { token, user };
    },

  //   // Add a third argument to the resolver to access data in our `context`
  //   addSkill: async (parent, { UserId, skill }, context) => {
  //     // If context has a `user` property, that means the user executing this mutation has a valid JWT and is logged in
  //     if (context.user) {
  //       return User.findOneAndUpdate(
  //         { _id: UserId },
  //         {
  //           $addToSet: { skills: skill },
  //         },
  //         {
  //           new: true,
  //           runValidators: true,
  //         }
  //       );
  //     }
  //     // If user attempts to execute this mutation and isn't logged in, throw an error
  //     throw new AuthenticationError('You need to be logged in!');
  //   },
  //   // Set up mutation so a logged in user can only remove their User and no one else's
  //   removeUser: async (parent, args, context) => {
  //     if (context.user) {
  //       return User.findOneAndDelete({ _id: context.user._id });
  //     }
  //     throw new AuthenticationError('You need to be logged in!');
  //   },
  //   // Make it so a logged in user can only remove a skill from their own User
  //   removeSkill: async (parent, { skill }, context) => {
  //     if (context.user) {
  //       return User.findOneAndUpdate(
  //         { _id: context.user._id },
  //         { $pull: { skills: skill } },
  //         { new: true }
  //       );
  //     }
  //     throw new AuthenticationError('You need to be logged in!');
  //   },
  // 
},
};

module.exports = resolvers;
