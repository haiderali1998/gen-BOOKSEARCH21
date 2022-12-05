const { gql } = require('apollo-server-express');

//add ! to book(id & title) user(_id & name)

const typeDefs = gql`
  type User {
    _id: ID
    name: String
    email: String
    password: String
    savedbooks: [String]!
    bookcount: Int
  }

type Book {
  bookId: ID
  authors: [String]
  description: String
  image: String
  link: String
  title: String     
  
}
  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    
  }

  type Mutation {
    addUser(name: String, email: String, password: String): Auth
    login(email: String, password: String!): Auth

  
  }
`;

module.exports = typeDefs;


// addSkill(profileId: ID!, skill: String!): Profile
// removeProfile: Profile
// removeSkill(skill: String!): Profile