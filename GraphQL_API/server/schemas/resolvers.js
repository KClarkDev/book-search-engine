const { User, Book } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    // retrieves a specific user by their username. Includes the user's saved books when returning the data
    getMe: async (parent, { username }) => {
      return User.findOne({ username }).populate("books");
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      // First we create the user
      const user = await User.create({ username, email, password });
      // To reduce friction for the user, we immediately sign a JSON Web Token and log the user in after they are created
      const token = signToken(user);
      // Return an `Auth` object that consists of the signed token and user's information
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      // Look up the user by the provided email address. Since the `email` field is unique, we know that only one person will exist with that email
      const user = await User.findOne({ email });

      // If there is no user with that email address, return an Authentication error stating so
      if (!user) {
        throw AuthenticationError;
      }

      // If there is a user found, execute the `isCorrectPassword` instance method and check if the correct password was provided
      const correctPw = await user.isCorrectPassword(password);

      // If the password is incorrect, return an Authentication error stating so
      if (!correctPw) {
        throw AuthenticationError;
      }

      // If email and password are correct, sign user into the application with a JWT
      const token = signToken(user);

      // Return an `Auth` object that consists of the signed token and user's information
      return { token, user };
    },
    saveBook: async (parent, { bookInput }, context) => {
      // Access parameters from bookInput
      if (context.user) {
        const { bookId, authors, description, title, image, link } = bookInput;

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: bookInput } }
        );

        return User;
      }
      throw AuthenticationError;
    },

    removeBook: async (parent, { bookId }) => {
      if (context.user) {
        await User.findOneAndDelete(
          { _id: context.user._id },
          { $pull: { savedBooks: bookId } }
        );

        return User;
      }
      throw AuthenticationError;
    },
  },
};

module.exports = resolvers;
