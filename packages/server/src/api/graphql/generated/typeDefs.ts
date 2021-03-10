// Do not edit directly!
export default `
schema {
  query: Query
  mutation: Mutation
}
type AuthData {
  user: User!
  accessToken: String!
  refreshToken: String!
}
type User {
  id: ID!
  name: String!
  email: String
  joined: DateTime!
  avatar: String!
}
type Mutation {
  createBook(title: String!, summary: String!, content: String!): Book @isAuthenticated
  deleteBook(id: ID!): ID @isAuthenticated
  signin(email: String!, password: String!): AuthData
  signup(name: String!, email: String!, password: String!): User
  updateBook(id: ID!, title: String!, summary: String!, content: String!): Book @isAuthenticated
  uploadAvatar(file: Upload!): File! @isAuthenticated
}
type Query {
  book(id: ID!): Book
  books(after: String, first: Int!, where: BooksWhereInput): BookConnection!
  me: User @isAuthenticated
}
type Book {
  id: ID!
  title: String!
  author: User!
  summary: String!
  content: String!
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
  _id: String
}
scalar DateTime
scalar Date
scalar Time
scalar Upload
type PageInfo {
  startCursor: String
  endCursor: String
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
}
type File {
  id: String!
  path: String!
  filename: String!
  mimetype: String!
}
directive @isAuthenticated on FIELD_DEFINITION
`