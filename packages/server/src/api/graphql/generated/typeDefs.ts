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
  bio: String
  followers: Int!
  followings: Int!
  isFollowing: Boolean!
}
type Mutation {
  createBook(title: String!, summary: String!, content: String!): Book @isAuthenticated
  createReview(book: ID!, content: String!, rating: Int!): Review @isAuthenticated
  deleteBook(id: ID!): ID @isAuthenticated
  deleteNotif(id: ID!): Boolean! @isAuthenticated
  deleteReview(id: ID!): Review @isAuthenticated
  followUser(following: ID!): Follow @isAuthenticated
  readNotifs: Boolean! @isAuthenticated
  signin(email: String!, password: String!): AuthData
  signup(name: String!, email: String!, password: String!): User
  unfollowUser(following: ID!): Follow @isAuthenticated
  updateBook(id: ID!, title: String!, summary: String!, content: String!): Book @isAuthenticated
  updateMe(file: Upload, name: String!, bio: String): User! @isAuthenticated
  updateReview(id: ID!, content: String!, rating: Int!): Review @isAuthenticated
}
type Query {
  book(id: ID!): Book
  books(first: Int!, after: String, where: BooksWhereInput, orderBy: BooksOrder = created_DESC, byFollowings: Boolean = false): BookConnection!
  getFollows(first: Int!, after: String, where: FollowsWhereInput, orderBy: FollowOrder = created_DESC): FollowConnection!
  getNotifs(first: Int!, after: String, where: NotifWhereInput, orderBy: NotifOrder = created_DESC): NotifConnection! @isAuthenticated
  me: User @isAuthenticated
  review(id: ID!): Review
  reviews(first: Int!, after: String, where: ReviewsWhereInput, orderBy: ReviewOrder = created_DESC): ReviewConnection!
  searchBooks(first: Int!, after: String, query: String!): BookConnection!
  user(id: ID!): User
}
type Book {
  id: ID!
  title: String!
  author: User!
  summary: String!
  content: String!
  ratingsAverage: Float!
  ratingsQuantity: Int!
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
enum BooksOrder {
  created_ASC
  created_DESC
  ratingsQuantity_ASC
  ratingsQuantity_DESC
}
input BooksWhereInput {
  author: ID
}
type Follow {
  id: String!
  follower: User!
  following: User!
  created: DateTime!
}
type FollowConnection {
  edges: [FollowEdge!]!
  nodes: [Follow!]!
  pageInfo: PageInfo!
}
type FollowEdge {
  node: Follow!
  cursor: String!
}
enum FollowOrder {
  created_ASC
  created_DESC
}
input FollowsWhereInput {
  follower: ID
  following: ID
}
type Notif {
  id: String!
  userSender: User!
  userTarget: User!
  book: Book
  review: Review
  follow: Follow
  created: DateTime!
  read: Boolean!
}
type NotifConnection {
  edges: [NotifEdge!]!
  nodes: [Notif!]!
  pageInfo: PageInfo!
}
type NotifEdge {
  node: Notif!
  cursor: String!
}
enum NotifOrder {
  created_ASC
  created_DESC
}
input NotifWhereInput {
  read: Boolean
}
type Review {
  id: ID!
  book: Book!
  author: User!
  content: String!
  rating: Int!
  created: DateTime!
}
type ReviewConnection {
  edges: [ReviewEdge!]!
  nodes: [Review!]!
  pageInfo: PageInfo!
}
type ReviewEdge {
  node: Review!
  cursor: String!
}
enum ReviewOrder {
  created_ASC
  created_DESC
  rating_ASC
  rating_DESC
}
input ReviewsWhereInput {
  book: String
  author: String
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