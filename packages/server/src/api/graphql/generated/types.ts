import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { IUser } from '../../../models/User';
import { IBook } from '../../../models/Book';
import { IReview } from '../../../models/Review';
import { IFollow } from '../../../models/Follow';
import { INotif } from '../../../models/Notif';
import { MyContext } from '../../../utils/context';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  Date: any;
  Time: any;
  Upload: Promise<GraphQLFileUpload>;
};


export type AuthData = {
  __typename?: 'AuthData';
  user: User;
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  name: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  joined: Scalars['DateTime'];
  avatar: Scalars['String'];
  bio?: Maybe<Scalars['String']>;
  followers: Scalars['Int'];
  followings: Scalars['Int'];
  isFollowing: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createBook?: Maybe<Book>;
  createReview?: Maybe<Review>;
  deleteBook?: Maybe<Scalars['ID']>;
  deleteNotif: Scalars['Boolean'];
  deleteReview?: Maybe<Review>;
  followUser?: Maybe<Follow>;
  readNotifs: Scalars['Boolean'];
  signin?: Maybe<AuthData>;
  signup?: Maybe<User>;
  unfollowUser?: Maybe<Follow>;
  updateBook?: Maybe<Book>;
  updateMe: User;
  updateReview?: Maybe<Review>;
};


export type MutationCreateBookArgs = {
  title: Scalars['String'];
  summary: Scalars['String'];
  content: Scalars['String'];
};


export type MutationCreateReviewArgs = {
  book: Scalars['ID'];
  content: Scalars['String'];
  rating: Scalars['Int'];
};


export type MutationDeleteBookArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteNotifArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteReviewArgs = {
  id: Scalars['ID'];
};


export type MutationFollowUserArgs = {
  following: Scalars['ID'];
};


export type MutationSigninArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationSignupArgs = {
  name: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationUnfollowUserArgs = {
  following: Scalars['ID'];
};


export type MutationUpdateBookArgs = {
  id: Scalars['ID'];
  title: Scalars['String'];
  summary: Scalars['String'];
  content: Scalars['String'];
};


export type MutationUpdateMeArgs = {
  file?: Maybe<Scalars['Upload']>;
  name: Scalars['String'];
  bio?: Maybe<Scalars['String']>;
};


export type MutationUpdateReviewArgs = {
  id: Scalars['ID'];
  content: Scalars['String'];
  rating: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  book?: Maybe<Book>;
  books: BookConnection;
  getFollows: FollowConnection;
  getNotifs: NotifConnection;
  me?: Maybe<User>;
  review?: Maybe<Review>;
  reviews: ReviewConnection;
  searchBooks: BookConnection;
  user?: Maybe<User>;
};


export type QueryBookArgs = {
  id: Scalars['ID'];
};


export type QueryBooksArgs = {
  first: Scalars['Int'];
  after?: Maybe<Scalars['String']>;
  where?: Maybe<BooksWhereInput>;
  orderBy?: Maybe<BooksOrder>;
  byFollowings?: Maybe<Scalars['Boolean']>;
};


export type QueryGetFollowsArgs = {
  first: Scalars['Int'];
  after?: Maybe<Scalars['String']>;
  where?: Maybe<FollowsWhereInput>;
  orderBy?: Maybe<FollowOrder>;
};


export type QueryGetNotifsArgs = {
  first: Scalars['Int'];
  after?: Maybe<Scalars['String']>;
  where?: Maybe<NotifWhereInput>;
  orderBy?: Maybe<NotifOrder>;
};


export type QueryReviewArgs = {
  id: Scalars['ID'];
};


export type QueryReviewsArgs = {
  first: Scalars['Int'];
  after?: Maybe<Scalars['String']>;
  where?: Maybe<ReviewsWhereInput>;
  orderBy?: Maybe<ReviewOrder>;
};


export type QuerySearchBooksArgs = {
  first: Scalars['Int'];
  after?: Maybe<Scalars['String']>;
  query: Scalars['String'];
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};

export type Book = {
  __typename?: 'Book';
  id: Scalars['ID'];
  title: Scalars['String'];
  author: User;
  summary: Scalars['String'];
  content: Scalars['String'];
  ratingsAverage: Scalars['Float'];
  ratingsQuantity: Scalars['Int'];
  created: Scalars['DateTime'];
  lastChanged: Scalars['DateTime'];
};

export type BookConnection = {
  __typename?: 'BookConnection';
  edges: Array<BookEdge>;
  nodes: Array<Book>;
  pageInfo: PageInfo;
};

export type BookEdge = {
  __typename?: 'BookEdge';
  node: Book;
  cursor: Scalars['String'];
};

export type BooksOrder =
  | 'created_ASC'
  | 'created_DESC'
  | 'ratingsQuantity_ASC'
  | 'ratingsQuantity_DESC';

export type BooksWhereInput = {
  author?: Maybe<Scalars['ID']>;
};

export type Follow = {
  __typename?: 'Follow';
  id: Scalars['String'];
  follower: User;
  following: User;
  created: Scalars['DateTime'];
};

export type FollowConnection = {
  __typename?: 'FollowConnection';
  edges: Array<FollowEdge>;
  nodes: Array<Follow>;
  pageInfo: PageInfo;
};

export type FollowEdge = {
  __typename?: 'FollowEdge';
  node: Follow;
  cursor: Scalars['String'];
};

export type FollowOrder =
  | 'created_ASC'
  | 'created_DESC';

export type FollowsWhereInput = {
  follower?: Maybe<Scalars['ID']>;
  following?: Maybe<Scalars['ID']>;
};

export type Notif = {
  __typename?: 'Notif';
  id: Scalars['String'];
  userSender: User;
  userTarget: User;
  type: NotifTypes;
  book?: Maybe<Book>;
  review?: Maybe<Review>;
  created: Scalars['DateTime'];
  read: Scalars['Boolean'];
};

export type NotifConnection = {
  __typename?: 'NotifConnection';
  edges: Array<NotifEdge>;
  nodes: Array<Notif>;
  pageInfo: PageInfo;
};

export type NotifEdge = {
  __typename?: 'NotifEdge';
  node: Notif;
  cursor: Scalars['String'];
};

export type NotifTypes =
  | 'REVIEW'
  | 'NEW_BOOK'
  | 'FOLLOW';

export type NotifOrder =
  | 'created_ASC'
  | 'created_DESC';

export type NotifWhereInput = {
  read?: Maybe<Scalars['Boolean']>;
};

export type Test = {
  __typename?: 'Test';
  darn?: Maybe<Scalars['String']>;
};

export type Review = {
  __typename?: 'Review';
  id: Scalars['ID'];
  book: Book;
  author: User;
  content: Scalars['String'];
  rating: Scalars['Int'];
  created: Scalars['DateTime'];
};

export type ReviewConnection = {
  __typename?: 'ReviewConnection';
  edges: Array<ReviewEdge>;
  nodes: Array<Review>;
  pageInfo: PageInfo;
};

export type ReviewEdge = {
  __typename?: 'ReviewEdge';
  node: Review;
  cursor: Scalars['String'];
};

export type ReviewOrder =
  | 'created_ASC'
  | 'created_DESC'
  | 'rating_ASC'
  | 'rating_DESC';

export type ReviewsWhereInput = {
  book?: Maybe<Scalars['String']>;
  author?: Maybe<Scalars['String']>;
};





export type PageInfo = {
  __typename?: 'PageInfo';
  startCursor?: Maybe<Scalars['String']>;
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
};

export type File = {
  __typename?: 'File';
  id: Scalars['String'];
  path: Scalars['String'];
  filename: Scalars['String'];
  mimetype: Scalars['String'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AuthData: ResolverTypeWrapper<Omit<AuthData, 'user'> & { user: ResolversTypes['User'] }>;
  String: ResolverTypeWrapper<Scalars['String']>;
  User: ResolverTypeWrapper<IUser>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  Book: ResolverTypeWrapper<IBook>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  BookConnection: ResolverTypeWrapper<Omit<BookConnection, 'edges' | 'nodes'> & { edges: Array<ResolversTypes['BookEdge']>, nodes: Array<ResolversTypes['Book']> }>;
  BookEdge: ResolverTypeWrapper<Omit<BookEdge, 'node'> & { node: ResolversTypes['Book'] }>;
  BooksOrder: BooksOrder;
  BooksWhereInput: BooksWhereInput;
  Follow: ResolverTypeWrapper<IFollow>;
  FollowConnection: ResolverTypeWrapper<Omit<FollowConnection, 'edges' | 'nodes'> & { edges: Array<ResolversTypes['FollowEdge']>, nodes: Array<ResolversTypes['Follow']> }>;
  FollowEdge: ResolverTypeWrapper<Omit<FollowEdge, 'node'> & { node: ResolversTypes['Follow'] }>;
  FollowOrder: FollowOrder;
  FollowsWhereInput: FollowsWhereInput;
  Notif: ResolverTypeWrapper<INotif>;
  NotifConnection: ResolverTypeWrapper<Omit<NotifConnection, 'edges' | 'nodes'> & { edges: Array<ResolversTypes['NotifEdge']>, nodes: Array<ResolversTypes['Notif']> }>;
  NotifEdge: ResolverTypeWrapper<Omit<NotifEdge, 'node'> & { node: ResolversTypes['Notif'] }>;
  NotifTypes: NotifTypes;
  NotifOrder: NotifOrder;
  NotifWhereInput: NotifWhereInput;
  Test: ResolverTypeWrapper<Test>;
  Review: ResolverTypeWrapper<IReview>;
  ReviewConnection: ResolverTypeWrapper<Omit<ReviewConnection, 'edges' | 'nodes'> & { edges: Array<ResolversTypes['ReviewEdge']>, nodes: Array<ResolversTypes['Review']> }>;
  ReviewEdge: ResolverTypeWrapper<Omit<ReviewEdge, 'node'> & { node: ResolversTypes['Review'] }>;
  ReviewOrder: ReviewOrder;
  ReviewsWhereInput: ReviewsWhereInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Time: ResolverTypeWrapper<Scalars['Time']>;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  File: ResolverTypeWrapper<File>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AuthData: Omit<AuthData, 'user'> & { user: ResolversParentTypes['User'] };
  String: Scalars['String'];
  User: IUser;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Boolean: Scalars['Boolean'];
  Mutation: {};
  Query: {};
  Book: IBook;
  Float: Scalars['Float'];
  BookConnection: Omit<BookConnection, 'edges' | 'nodes'> & { edges: Array<ResolversParentTypes['BookEdge']>, nodes: Array<ResolversParentTypes['Book']> };
  BookEdge: Omit<BookEdge, 'node'> & { node: ResolversParentTypes['Book'] };
  BooksWhereInput: BooksWhereInput;
  Follow: IFollow;
  FollowConnection: Omit<FollowConnection, 'edges' | 'nodes'> & { edges: Array<ResolversParentTypes['FollowEdge']>, nodes: Array<ResolversParentTypes['Follow']> };
  FollowEdge: Omit<FollowEdge, 'node'> & { node: ResolversParentTypes['Follow'] };
  FollowsWhereInput: FollowsWhereInput;
  Notif: INotif;
  NotifConnection: Omit<NotifConnection, 'edges' | 'nodes'> & { edges: Array<ResolversParentTypes['NotifEdge']>, nodes: Array<ResolversParentTypes['Notif']> };
  NotifEdge: Omit<NotifEdge, 'node'> & { node: ResolversParentTypes['Notif'] };
  NotifWhereInput: NotifWhereInput;
  Test: Test;
  Review: IReview;
  ReviewConnection: Omit<ReviewConnection, 'edges' | 'nodes'> & { edges: Array<ResolversParentTypes['ReviewEdge']>, nodes: Array<ResolversParentTypes['Review']> };
  ReviewEdge: Omit<ReviewEdge, 'node'> & { node: ResolversParentTypes['Review'] };
  ReviewsWhereInput: ReviewsWhereInput;
  DateTime: Scalars['DateTime'];
  Date: Scalars['Date'];
  Time: Scalars['Time'];
  Upload: Scalars['Upload'];
  PageInfo: PageInfo;
  File: File;
};

export type IsAuthenticatedDirectiveArgs = {  };

export type IsAuthenticatedDirectiveResolver<Result, Parent, ContextType = MyContext, Args = IsAuthenticatedDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AuthDataResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['AuthData'] = ResolversParentTypes['AuthData']> = {
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  joined?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  avatar?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  followers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  followings?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  isFollowing?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createBook?: Resolver<Maybe<ResolversTypes['Book']>, ParentType, ContextType, RequireFields<MutationCreateBookArgs, 'title' | 'summary' | 'content'>>;
  createReview?: Resolver<Maybe<ResolversTypes['Review']>, ParentType, ContextType, RequireFields<MutationCreateReviewArgs, 'book' | 'content' | 'rating'>>;
  deleteBook?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType, RequireFields<MutationDeleteBookArgs, 'id'>>;
  deleteNotif?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteNotifArgs, 'id'>>;
  deleteReview?: Resolver<Maybe<ResolversTypes['Review']>, ParentType, ContextType, RequireFields<MutationDeleteReviewArgs, 'id'>>;
  followUser?: Resolver<Maybe<ResolversTypes['Follow']>, ParentType, ContextType, RequireFields<MutationFollowUserArgs, 'following'>>;
  readNotifs?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  signin?: Resolver<Maybe<ResolversTypes['AuthData']>, ParentType, ContextType, RequireFields<MutationSigninArgs, 'email' | 'password'>>;
  signup?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationSignupArgs, 'name' | 'email' | 'password'>>;
  unfollowUser?: Resolver<Maybe<ResolversTypes['Follow']>, ParentType, ContextType, RequireFields<MutationUnfollowUserArgs, 'following'>>;
  updateBook?: Resolver<Maybe<ResolversTypes['Book']>, ParentType, ContextType, RequireFields<MutationUpdateBookArgs, 'id' | 'title' | 'summary' | 'content'>>;
  updateMe?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateMeArgs, 'name'>>;
  updateReview?: Resolver<Maybe<ResolversTypes['Review']>, ParentType, ContextType, RequireFields<MutationUpdateReviewArgs, 'id' | 'content' | 'rating'>>;
};

export type QueryResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  book?: Resolver<Maybe<ResolversTypes['Book']>, ParentType, ContextType, RequireFields<QueryBookArgs, 'id'>>;
  books?: Resolver<ResolversTypes['BookConnection'], ParentType, ContextType, RequireFields<QueryBooksArgs, 'first' | 'orderBy' | 'byFollowings'>>;
  getFollows?: Resolver<ResolversTypes['FollowConnection'], ParentType, ContextType, RequireFields<QueryGetFollowsArgs, 'first' | 'orderBy'>>;
  getNotifs?: Resolver<ResolversTypes['NotifConnection'], ParentType, ContextType, RequireFields<QueryGetNotifsArgs, 'first' | 'orderBy'>>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  review?: Resolver<Maybe<ResolversTypes['Review']>, ParentType, ContextType, RequireFields<QueryReviewArgs, 'id'>>;
  reviews?: Resolver<ResolversTypes['ReviewConnection'], ParentType, ContextType, RequireFields<QueryReviewsArgs, 'first' | 'orderBy'>>;
  searchBooks?: Resolver<ResolversTypes['BookConnection'], ParentType, ContextType, RequireFields<QuerySearchBooksArgs, 'first' | 'query'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
};

export type BookResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Book'] = ResolversParentTypes['Book']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  summary?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ratingsAverage?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  ratingsQuantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  created?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  lastChanged?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookConnectionResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['BookConnection'] = ResolversParentTypes['BookConnection']> = {
  edges?: Resolver<Array<ResolversTypes['BookEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['Book']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BookEdgeResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['BookEdge'] = ResolversParentTypes['BookEdge']> = {
  node?: Resolver<ResolversTypes['Book'], ParentType, ContextType>;
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FollowResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Follow'] = ResolversParentTypes['Follow']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  follower?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  following?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  created?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FollowConnectionResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['FollowConnection'] = ResolversParentTypes['FollowConnection']> = {
  edges?: Resolver<Array<ResolversTypes['FollowEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['Follow']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FollowEdgeResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['FollowEdge'] = ResolversParentTypes['FollowEdge']> = {
  node?: Resolver<ResolversTypes['Follow'], ParentType, ContextType>;
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NotifResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Notif'] = ResolversParentTypes['Notif']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userSender?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  userTarget?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['NotifTypes'], ParentType, ContextType>;
  book?: Resolver<Maybe<ResolversTypes['Book']>, ParentType, ContextType>;
  review?: Resolver<Maybe<ResolversTypes['Review']>, ParentType, ContextType>;
  created?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  read?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NotifConnectionResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['NotifConnection'] = ResolversParentTypes['NotifConnection']> = {
  edges?: Resolver<Array<ResolversTypes['NotifEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['Notif']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type NotifEdgeResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['NotifEdge'] = ResolversParentTypes['NotifEdge']> = {
  node?: Resolver<ResolversTypes['Notif'], ParentType, ContextType>;
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TestResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Test'] = ResolversParentTypes['Test']> = {
  darn?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReviewResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Review'] = ResolversParentTypes['Review']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  book?: Resolver<ResolversTypes['Book'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rating?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  created?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReviewConnectionResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['ReviewConnection'] = ResolversParentTypes['ReviewConnection']> = {
  edges?: Resolver<Array<ResolversTypes['ReviewEdge']>, ParentType, ContextType>;
  nodes?: Resolver<Array<ResolversTypes['Review']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReviewEdgeResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['ReviewEdge'] = ResolversParentTypes['ReviewEdge']> = {
  node?: Resolver<ResolversTypes['Review'], ParentType, ContextType>;
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface TimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Time'], any> {
  name: 'Time';
}

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type PageInfoResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  startCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FileResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['File'] = ResolversParentTypes['File']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  path?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  filename?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mimetype?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = MyContext> = {
  AuthData?: AuthDataResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Book?: BookResolvers<ContextType>;
  BookConnection?: BookConnectionResolvers<ContextType>;
  BookEdge?: BookEdgeResolvers<ContextType>;
  Follow?: FollowResolvers<ContextType>;
  FollowConnection?: FollowConnectionResolvers<ContextType>;
  FollowEdge?: FollowEdgeResolvers<ContextType>;
  Notif?: NotifResolvers<ContextType>;
  NotifConnection?: NotifConnectionResolvers<ContextType>;
  NotifEdge?: NotifEdgeResolvers<ContextType>;
  Test?: TestResolvers<ContextType>;
  Review?: ReviewResolvers<ContextType>;
  ReviewConnection?: ReviewConnectionResolvers<ContextType>;
  ReviewEdge?: ReviewEdgeResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Date?: GraphQLScalarType;
  Time?: GraphQLScalarType;
  Upload?: GraphQLScalarType;
  PageInfo?: PageInfoResolvers<ContextType>;
  File?: FileResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = MyContext> = Resolvers<ContextType>;
export type DirectiveResolvers<ContextType = MyContext> = {
  isAuthenticated?: IsAuthenticatedDirectiveResolver<any, any, ContextType>;
};


/**
 * @deprecated
 * Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
 */
export type IDirectiveResolvers<ContextType = MyContext> = DirectiveResolvers<ContextType>;