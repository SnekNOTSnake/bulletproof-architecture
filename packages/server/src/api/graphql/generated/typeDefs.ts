export default `
directive @isAuthenticated on FIELD_DEFINITION

type AuthData {
  user: User!
  token: String!
  tokenExpiration: String!
}

type User {
  id: ID!
  name: String!
  email: String!
  joined: DateTime!
}

type Mutation {
  createBook(title: String!): Book
  deleteBook(id: ID!): ID
  signin(email: String!, password: String!): AuthData
  signup(name: String!, email: String!, password: String!): User
  updateBook(id: ID!, title: String!): Book
}

type Query {
  book(id: ID!): Book
  books(after: String, first: Int!, where: BooksWhereInput): BookConnection!
  me: User
}

type Book {
  id: ID!
  title: String!
  author: User!
  created: DateTime!
  lastChanged: DateTime!
}

type BookConnection {
  edges: [BookEdge!]!
  nodes: [Book!]!
  pageInfo: PageInfo!
}

type BookEdge {
  node: Book!
  cursor: String!
}

input BooksWhereInput {
  id: String
}

scalar DateTime

scalar Date

scalar Time

type PageInfo {
  startCursor: String
  endCursor: String
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
}

`