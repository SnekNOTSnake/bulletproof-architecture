import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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
  Upload: any;
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
  created: Scalars['DateTime'];
  avatar: Scalars['String'];
  bio?: Maybe<Scalars['String']>;
  followers: Scalars['Int'];
  followings: Scalars['Int'];
  isFollowing: Scalars['Boolean'];
  isOnline: Scalars['Boolean'];
};

export type UserConnection = {
  __typename?: 'UserConnection';
  edges: Array<UserEdge>;
  nodes: Array<User>;
  pageInfo: PageInfo;
};

export type UserEdge = {
  __typename?: 'UserEdge';
  node: User;
  cursor: Scalars['String'];
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
  me?: Maybe<User>;
  notifs: NotifConnection;
  review?: Maybe<Review>;
  reviews: ReviewConnection;
  searchBooks: BookConnection;
  user?: Maybe<User>;
  users: UserConnection;
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


export type QueryNotifsArgs = {
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


export type QueryUsersArgs = {
  first: Scalars['Int'];
  after?: Maybe<Scalars['String']>;
  orderBy?: Maybe<UserOrder>;
};

export type UserOrder =
  | 'created_ASC'
  | 'created_DESC';

export type Subscription = {
  __typename?: 'Subscription';
  isUserOnline: IsUserOnlinePayload;
  notifCreated?: Maybe<Notif>;
};


export type SubscriptionIsUserOnlineArgs = {
  userId: Scalars['ID'];
};

export type IsUserOnlinePayload = {
  __typename?: 'IsUserOnlinePayload';
  userId: Scalars['ID'];
  isOnline: Scalars['Boolean'];
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

export type CreateReviewMutationVariables = Exact<{
  book: Scalars['ID'];
  content: Scalars['String'];
  rating: Scalars['Int'];
}>;


export type CreateReviewMutation = (
  { __typename?: 'Mutation' }
  & { createReview?: Maybe<(
    { __typename?: 'Review' }
    & Pick<Review, 'id' | 'content' | 'rating' | 'created'>
    & { author: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'name'>
    ), book: (
      { __typename?: 'Book' }
      & Pick<Book, 'id' | 'ratingsAverage' | 'ratingsQuantity'>
    ) }
  )> }
);

export type UpdateBookMutationVariables = Exact<{
  id: Scalars['ID'];
  title: Scalars['String'];
  summary: Scalars['String'];
  content: Scalars['String'];
}>;


export type UpdateBookMutation = (
  { __typename?: 'Mutation' }
  & { updateBook?: Maybe<(
    { __typename?: 'Book' }
    & Pick<Book, 'id' | 'title' | 'lastChanged' | 'summary' | 'content'>
  )> }
);

export type UpdateMeMutationVariables = Exact<{
  file?: Maybe<Scalars['Upload']>;
  name: Scalars['String'];
  bio?: Maybe<Scalars['String']>;
}>;


export type UpdateMeMutation = (
  { __typename?: 'Mutation' }
  & { updateMe: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'avatar' | 'name' | 'bio'>
  ) }
);

export type UpdateReviewMutationVariables = Exact<{
  id: Scalars['ID'];
  content: Scalars['String'];
  rating: Scalars['Int'];
}>;


export type UpdateReviewMutation = (
  { __typename?: 'Mutation' }
  & { updateReview?: Maybe<(
    { __typename?: 'Review' }
    & Pick<Review, 'id' | 'content' | 'rating'>
    & { book: (
      { __typename?: 'Book' }
      & Pick<Book, 'id' | 'ratingsAverage' | 'ratingsQuantity'>
    ) }
  )> }
);

export type FollowUserMutationVariables = Exact<{
  following: Scalars['ID'];
}>;


export type FollowUserMutation = (
  { __typename?: 'Mutation' }
  & { followUser?: Maybe<(
    { __typename?: 'Follow' }
    & { follower: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'followers' | 'followings' | 'isFollowing'>
    ), following: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'followers' | 'followings' | 'isFollowing'>
    ) }
  )> }
);

export type UnfollowUserMutationVariables = Exact<{
  following: Scalars['ID'];
}>;


export type UnfollowUserMutation = (
  { __typename?: 'Mutation' }
  & { unfollowUser?: Maybe<(
    { __typename?: 'Follow' }
    & { follower: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'followers' | 'followings' | 'isFollowing'>
    ), following: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'followers' | 'followings' | 'isFollowing'>
    ) }
  )> }
);

export type NotifCreatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NotifCreatedSubscription = (
  { __typename?: 'Subscription' }
  & { notifCreated?: Maybe<(
    { __typename?: 'Notif' }
    & Pick<Notif, 'id' | 'type' | 'created' | 'read'>
    & { userSender: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'name'>
    ), book?: Maybe<(
      { __typename?: 'Book' }
      & Pick<Book, 'id' | 'title'>
    )>, review?: Maybe<(
      { __typename?: 'Review' }
      & Pick<Review, 'id' | 'rating' | 'content'>
    )> }
  )> }
);

export type NotifsQueryVariables = Exact<{
  first: Scalars['Int'];
  after?: Maybe<Scalars['String']>;
  orderBy?: Maybe<NotifOrder>;
  where?: Maybe<NotifWhereInput>;
}>;


export type NotifsQuery = (
  { __typename?: 'Query' }
  & { notifs: (
    { __typename?: 'NotifConnection' }
    & { nodes: Array<(
      { __typename?: 'Notif' }
      & Pick<Notif, 'id' | 'type' | 'created' | 'read'>
      & { userSender: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'name'>
      ), book?: Maybe<(
        { __typename?: 'Book' }
        & Pick<Book, 'id' | 'title'>
      )>, review?: Maybe<(
        { __typename?: 'Review' }
        & Pick<Review, 'id' | 'rating' | 'content'>
      )> }
    )>, pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<PageInfo, 'endCursor' | 'hasNextPage'>
    ) }
  ) }
);

export type ReadNotifsMutationVariables = Exact<{ [key: string]: never; }>;


export type ReadNotifsMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'readNotifs'>
);

export type DeleteReviewMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteReviewMutation = (
  { __typename?: 'Mutation' }
  & { deleteReview?: Maybe<(
    { __typename?: 'Review' }
    & Pick<Review, 'id'>
    & { book: (
      { __typename?: 'Book' }
      & Pick<Book, 'id' | 'ratingsAverage' | 'ratingsQuantity'>
    ) }
  )> }
);

export type ReviewsQueryVariables = Exact<{
  first: Scalars['Int'];
  after?: Maybe<Scalars['String']>;
  where?: Maybe<ReviewsWhereInput>;
  orderBy?: Maybe<ReviewOrder>;
}>;


export type ReviewsQuery = (
  { __typename?: 'Query' }
  & { reviews: (
    { __typename?: 'ReviewConnection' }
    & { nodes: Array<(
      { __typename?: 'Review' }
      & Pick<Review, 'id' | 'content' | 'rating' | 'created'>
      & { author: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'name'>
      ) }
    )>, pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<PageInfo, 'endCursor' | 'hasNextPage'>
    ) }
  ) }
);

export type BookQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type BookQuery = (
  { __typename?: 'Query' }
  & { book?: Maybe<(
    { __typename?: 'Book' }
    & Pick<Book, 'id' | 'title' | 'summary' | 'content' | 'ratingsAverage' | 'ratingsQuantity' | 'created' | 'lastChanged'>
    & { author: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'name'>
    ) }
  )> }
);

export type DeleteBookMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteBookMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteBook'>
);

export type CreateBookMutationVariables = Exact<{
  title: Scalars['String'];
  summary: Scalars['String'];
  content: Scalars['String'];
}>;


export type CreateBookMutation = (
  { __typename?: 'Mutation' }
  & { createBook?: Maybe<(
    { __typename?: 'Book' }
    & Pick<Book, 'id' | 'title' | 'created' | 'lastChanged' | 'summary' | 'content' | 'ratingsAverage' | 'ratingsQuantity'>
    & { author: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'name' | 'avatar'>
    ) }
  )> }
);

export type BooksQueryVariables = Exact<{
  first: Scalars['Int'];
  after?: Maybe<Scalars['String']>;
  where?: Maybe<BooksWhereInput>;
  orderBy?: Maybe<BooksOrder>;
  byFollowings?: Maybe<Scalars['Boolean']>;
}>;


export type BooksQuery = (
  { __typename?: 'Query' }
  & { books: (
    { __typename?: 'BookConnection' }
    & { nodes: Array<(
      { __typename?: 'Book' }
      & Pick<Book, 'id' | 'title' | 'created' | 'lastChanged' | 'summary' | 'ratingsAverage' | 'ratingsQuantity'>
      & { author: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'name' | 'avatar'>
      ) }
    )>, pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<PageInfo, 'endCursor' | 'hasNextPage'>
    ) }
  ) }
);

export type GetFollowersQueryVariables = Exact<{
  first: Scalars['Int'];
  where?: Maybe<FollowsWhereInput>;
  after?: Maybe<Scalars['String']>;
  orderBy?: Maybe<FollowOrder>;
}>;


export type GetFollowersQuery = (
  { __typename?: 'Query' }
  & { getFollows: (
    { __typename?: 'FollowConnection' }
    & { nodes: Array<(
      { __typename?: 'Follow' }
      & Pick<Follow, 'id' | 'created'>
      & { follower: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'name' | 'email' | 'avatar'>
      ) }
    )>, pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<PageInfo, 'hasNextPage' | 'endCursor'>
    ) }
  ) }
);

export type GetFollowingsQueryVariables = Exact<{
  first: Scalars['Int'];
  where?: Maybe<FollowsWhereInput>;
  after?: Maybe<Scalars['String']>;
  orderBy?: Maybe<FollowOrder>;
}>;


export type GetFollowingsQuery = (
  { __typename?: 'Query' }
  & { getFollows: (
    { __typename?: 'FollowConnection' }
    & { nodes: Array<(
      { __typename?: 'Follow' }
      & Pick<Follow, 'id' | 'created'>
      & { following: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'name' | 'email' | 'avatar'>
      ) }
    )>, pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<PageInfo, 'hasNextPage' | 'endCursor'>
    ) }
  ) }
);

export type IsUserOnlineSubscriptionVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type IsUserOnlineSubscription = (
  { __typename?: 'Subscription' }
  & { isUserOnline: (
    { __typename?: 'IsUserOnlinePayload' }
    & Pick<IsUserOnlinePayload, 'userId' | 'isOnline'>
  ) }
);

export type UserQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UserQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'name' | 'email' | 'created' | 'avatar' | 'bio' | 'followers' | 'followings' | 'isFollowing' | 'isOnline'>
  )> }
);

export type SearchQueryVariables = Exact<{
  first: Scalars['Int'];
  query: Scalars['String'];
  after?: Maybe<Scalars['String']>;
}>;


export type SearchQuery = (
  { __typename?: 'Query' }
  & { searchBooks: (
    { __typename?: 'BookConnection' }
    & { nodes: Array<(
      { __typename?: 'Book' }
      & Pick<Book, 'id' | 'title' | 'created' | 'summary'>
      & { author: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'name'>
      ) }
    )>, pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<PageInfo, 'hasNextPage' | 'endCursor'>
    ) }
  ) }
);


export const CreateReviewDocument = gql`
    mutation CreateReview($book: ID!, $content: String!, $rating: Int!) {
  createReview(book: $book, content: $content, rating: $rating) {
    id
    author {
      id
      name
    }
    book {
      id
      ratingsAverage
      ratingsQuantity
    }
    content
    rating
    created
  }
}
    `;
export type CreateReviewMutationFn = Apollo.MutationFunction<CreateReviewMutation, CreateReviewMutationVariables>;

/**
 * __useCreateReviewMutation__
 *
 * To run a mutation, you first call `useCreateReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createReviewMutation, { data, loading, error }] = useCreateReviewMutation({
 *   variables: {
 *      book: // value for 'book'
 *      content: // value for 'content'
 *      rating: // value for 'rating'
 *   },
 * });
 */
export function useCreateReviewMutation(baseOptions?: Apollo.MutationHookOptions<CreateReviewMutation, CreateReviewMutationVariables>) {
        return Apollo.useMutation<CreateReviewMutation, CreateReviewMutationVariables>(CreateReviewDocument, baseOptions);
      }
export type CreateReviewMutationHookResult = ReturnType<typeof useCreateReviewMutation>;
export type CreateReviewMutationResult = Apollo.MutationResult<CreateReviewMutation>;
export type CreateReviewMutationOptions = Apollo.BaseMutationOptions<CreateReviewMutation, CreateReviewMutationVariables>;
export const UpdateBookDocument = gql`
    mutation UpdateBook($id: ID!, $title: String!, $summary: String!, $content: String!) {
  updateBook(id: $id, title: $title, summary: $summary, content: $content) {
    id
    title
    lastChanged
    summary
    content
  }
}
    `;
export type UpdateBookMutationFn = Apollo.MutationFunction<UpdateBookMutation, UpdateBookMutationVariables>;

/**
 * __useUpdateBookMutation__
 *
 * To run a mutation, you first call `useUpdateBookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBookMutation, { data, loading, error }] = useUpdateBookMutation({
 *   variables: {
 *      id: // value for 'id'
 *      title: // value for 'title'
 *      summary: // value for 'summary'
 *      content: // value for 'content'
 *   },
 * });
 */
export function useUpdateBookMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBookMutation, UpdateBookMutationVariables>) {
        return Apollo.useMutation<UpdateBookMutation, UpdateBookMutationVariables>(UpdateBookDocument, baseOptions);
      }
export type UpdateBookMutationHookResult = ReturnType<typeof useUpdateBookMutation>;
export type UpdateBookMutationResult = Apollo.MutationResult<UpdateBookMutation>;
export type UpdateBookMutationOptions = Apollo.BaseMutationOptions<UpdateBookMutation, UpdateBookMutationVariables>;
export const UpdateMeDocument = gql`
    mutation UpdateMe($file: Upload, $name: String!, $bio: String) {
  updateMe(file: $file, name: $name, bio: $bio) {
    id
    avatar
    name
    bio
  }
}
    `;
export type UpdateMeMutationFn = Apollo.MutationFunction<UpdateMeMutation, UpdateMeMutationVariables>;

/**
 * __useUpdateMeMutation__
 *
 * To run a mutation, you first call `useUpdateMeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMeMutation, { data, loading, error }] = useUpdateMeMutation({
 *   variables: {
 *      file: // value for 'file'
 *      name: // value for 'name'
 *      bio: // value for 'bio'
 *   },
 * });
 */
export function useUpdateMeMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMeMutation, UpdateMeMutationVariables>) {
        return Apollo.useMutation<UpdateMeMutation, UpdateMeMutationVariables>(UpdateMeDocument, baseOptions);
      }
export type UpdateMeMutationHookResult = ReturnType<typeof useUpdateMeMutation>;
export type UpdateMeMutationResult = Apollo.MutationResult<UpdateMeMutation>;
export type UpdateMeMutationOptions = Apollo.BaseMutationOptions<UpdateMeMutation, UpdateMeMutationVariables>;
export const UpdateReviewDocument = gql`
    mutation UpdateReview($id: ID!, $content: String!, $rating: Int!) {
  updateReview(id: $id, content: $content, rating: $rating) {
    id
    book {
      id
      ratingsAverage
      ratingsQuantity
    }
    content
    rating
  }
}
    `;
export type UpdateReviewMutationFn = Apollo.MutationFunction<UpdateReviewMutation, UpdateReviewMutationVariables>;

/**
 * __useUpdateReviewMutation__
 *
 * To run a mutation, you first call `useUpdateReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateReviewMutation, { data, loading, error }] = useUpdateReviewMutation({
 *   variables: {
 *      id: // value for 'id'
 *      content: // value for 'content'
 *      rating: // value for 'rating'
 *   },
 * });
 */
export function useUpdateReviewMutation(baseOptions?: Apollo.MutationHookOptions<UpdateReviewMutation, UpdateReviewMutationVariables>) {
        return Apollo.useMutation<UpdateReviewMutation, UpdateReviewMutationVariables>(UpdateReviewDocument, baseOptions);
      }
export type UpdateReviewMutationHookResult = ReturnType<typeof useUpdateReviewMutation>;
export type UpdateReviewMutationResult = Apollo.MutationResult<UpdateReviewMutation>;
export type UpdateReviewMutationOptions = Apollo.BaseMutationOptions<UpdateReviewMutation, UpdateReviewMutationVariables>;
export const FollowUserDocument = gql`
    mutation FollowUser($following: ID!) {
  followUser(following: $following) {
    follower {
      id
      followers
      followings
      isFollowing
    }
    following {
      id
      followers
      followings
      isFollowing
    }
  }
}
    `;
export type FollowUserMutationFn = Apollo.MutationFunction<FollowUserMutation, FollowUserMutationVariables>;

/**
 * __useFollowUserMutation__
 *
 * To run a mutation, you first call `useFollowUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFollowUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [followUserMutation, { data, loading, error }] = useFollowUserMutation({
 *   variables: {
 *      following: // value for 'following'
 *   },
 * });
 */
export function useFollowUserMutation(baseOptions?: Apollo.MutationHookOptions<FollowUserMutation, FollowUserMutationVariables>) {
        return Apollo.useMutation<FollowUserMutation, FollowUserMutationVariables>(FollowUserDocument, baseOptions);
      }
export type FollowUserMutationHookResult = ReturnType<typeof useFollowUserMutation>;
export type FollowUserMutationResult = Apollo.MutationResult<FollowUserMutation>;
export type FollowUserMutationOptions = Apollo.BaseMutationOptions<FollowUserMutation, FollowUserMutationVariables>;
export const UnfollowUserDocument = gql`
    mutation UnfollowUser($following: ID!) {
  unfollowUser(following: $following) {
    follower {
      id
      followers
      followings
      isFollowing
    }
    following {
      id
      followers
      followings
      isFollowing
    }
  }
}
    `;
export type UnfollowUserMutationFn = Apollo.MutationFunction<UnfollowUserMutation, UnfollowUserMutationVariables>;

/**
 * __useUnfollowUserMutation__
 *
 * To run a mutation, you first call `useUnfollowUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnfollowUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unfollowUserMutation, { data, loading, error }] = useUnfollowUserMutation({
 *   variables: {
 *      following: // value for 'following'
 *   },
 * });
 */
export function useUnfollowUserMutation(baseOptions?: Apollo.MutationHookOptions<UnfollowUserMutation, UnfollowUserMutationVariables>) {
        return Apollo.useMutation<UnfollowUserMutation, UnfollowUserMutationVariables>(UnfollowUserDocument, baseOptions);
      }
export type UnfollowUserMutationHookResult = ReturnType<typeof useUnfollowUserMutation>;
export type UnfollowUserMutationResult = Apollo.MutationResult<UnfollowUserMutation>;
export type UnfollowUserMutationOptions = Apollo.BaseMutationOptions<UnfollowUserMutation, UnfollowUserMutationVariables>;
export const NotifCreatedDocument = gql`
    subscription NotifCreated {
  notifCreated {
    id
    userSender {
      id
      name
    }
    type
    book {
      id
      title
    }
    review {
      id
      rating
      content
    }
    created
    read
  }
}
    `;

/**
 * __useNotifCreatedSubscription__
 *
 * To run a query within a React component, call `useNotifCreatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNotifCreatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNotifCreatedSubscription({
 *   variables: {
 *   },
 * });
 */
export function useNotifCreatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<NotifCreatedSubscription, NotifCreatedSubscriptionVariables>) {
        return Apollo.useSubscription<NotifCreatedSubscription, NotifCreatedSubscriptionVariables>(NotifCreatedDocument, baseOptions);
      }
export type NotifCreatedSubscriptionHookResult = ReturnType<typeof useNotifCreatedSubscription>;
export type NotifCreatedSubscriptionResult = Apollo.SubscriptionResult<NotifCreatedSubscription>;
export const NotifsDocument = gql`
    query Notifs($first: Int!, $after: String, $orderBy: NotifOrder, $where: NotifWhereInput) {
  notifs(first: $first, after: $after, orderBy: $orderBy, where: $where) {
    nodes {
      id
      userSender {
        id
        name
      }
      type
      book {
        id
        title
      }
      review {
        id
        rating
        content
      }
      created
      read
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
    `;

/**
 * __useNotifsQuery__
 *
 * To run a query within a React component, call `useNotifsQuery` and pass it any options that fit your needs.
 * When your component renders, `useNotifsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNotifsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      orderBy: // value for 'orderBy'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useNotifsQuery(baseOptions: Apollo.QueryHookOptions<NotifsQuery, NotifsQueryVariables>) {
        return Apollo.useQuery<NotifsQuery, NotifsQueryVariables>(NotifsDocument, baseOptions);
      }
export function useNotifsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NotifsQuery, NotifsQueryVariables>) {
          return Apollo.useLazyQuery<NotifsQuery, NotifsQueryVariables>(NotifsDocument, baseOptions);
        }
export type NotifsQueryHookResult = ReturnType<typeof useNotifsQuery>;
export type NotifsLazyQueryHookResult = ReturnType<typeof useNotifsLazyQuery>;
export type NotifsQueryResult = Apollo.QueryResult<NotifsQuery, NotifsQueryVariables>;
export const ReadNotifsDocument = gql`
    mutation ReadNotifs {
  readNotifs
}
    `;
export type ReadNotifsMutationFn = Apollo.MutationFunction<ReadNotifsMutation, ReadNotifsMutationVariables>;

/**
 * __useReadNotifsMutation__
 *
 * To run a mutation, you first call `useReadNotifsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReadNotifsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [readNotifsMutation, { data, loading, error }] = useReadNotifsMutation({
 *   variables: {
 *   },
 * });
 */
export function useReadNotifsMutation(baseOptions?: Apollo.MutationHookOptions<ReadNotifsMutation, ReadNotifsMutationVariables>) {
        return Apollo.useMutation<ReadNotifsMutation, ReadNotifsMutationVariables>(ReadNotifsDocument, baseOptions);
      }
export type ReadNotifsMutationHookResult = ReturnType<typeof useReadNotifsMutation>;
export type ReadNotifsMutationResult = Apollo.MutationResult<ReadNotifsMutation>;
export type ReadNotifsMutationOptions = Apollo.BaseMutationOptions<ReadNotifsMutation, ReadNotifsMutationVariables>;
export const DeleteReviewDocument = gql`
    mutation DeleteReview($id: ID!) {
  deleteReview(id: $id) {
    id
    book {
      id
      ratingsAverage
      ratingsQuantity
    }
  }
}
    `;
export type DeleteReviewMutationFn = Apollo.MutationFunction<DeleteReviewMutation, DeleteReviewMutationVariables>;

/**
 * __useDeleteReviewMutation__
 *
 * To run a mutation, you first call `useDeleteReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteReviewMutation, { data, loading, error }] = useDeleteReviewMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteReviewMutation(baseOptions?: Apollo.MutationHookOptions<DeleteReviewMutation, DeleteReviewMutationVariables>) {
        return Apollo.useMutation<DeleteReviewMutation, DeleteReviewMutationVariables>(DeleteReviewDocument, baseOptions);
      }
export type DeleteReviewMutationHookResult = ReturnType<typeof useDeleteReviewMutation>;
export type DeleteReviewMutationResult = Apollo.MutationResult<DeleteReviewMutation>;
export type DeleteReviewMutationOptions = Apollo.BaseMutationOptions<DeleteReviewMutation, DeleteReviewMutationVariables>;
export const ReviewsDocument = gql`
    query Reviews($first: Int!, $after: String, $where: ReviewsWhereInput, $orderBy: ReviewOrder) {
  reviews(first: $first, after: $after, where: $where, orderBy: $orderBy) {
    nodes {
      id
      author {
        id
        name
      }
      content
      rating
      created
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
    `;

/**
 * __useReviewsQuery__
 *
 * To run a query within a React component, call `useReviewsQuery` and pass it any options that fit your needs.
 * When your component renders, `useReviewsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReviewsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      where: // value for 'where'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useReviewsQuery(baseOptions: Apollo.QueryHookOptions<ReviewsQuery, ReviewsQueryVariables>) {
        return Apollo.useQuery<ReviewsQuery, ReviewsQueryVariables>(ReviewsDocument, baseOptions);
      }
export function useReviewsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ReviewsQuery, ReviewsQueryVariables>) {
          return Apollo.useLazyQuery<ReviewsQuery, ReviewsQueryVariables>(ReviewsDocument, baseOptions);
        }
export type ReviewsQueryHookResult = ReturnType<typeof useReviewsQuery>;
export type ReviewsLazyQueryHookResult = ReturnType<typeof useReviewsLazyQuery>;
export type ReviewsQueryResult = Apollo.QueryResult<ReviewsQuery, ReviewsQueryVariables>;
export const BookDocument = gql`
    query Book($id: ID!) {
  book(id: $id) {
    id
    title
    summary
    content
    ratingsAverage
    ratingsQuantity
    author {
      id
      name
    }
    created
    lastChanged
  }
}
    `;

/**
 * __useBookQuery__
 *
 * To run a query within a React component, call `useBookQuery` and pass it any options that fit your needs.
 * When your component renders, `useBookQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBookQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useBookQuery(baseOptions: Apollo.QueryHookOptions<BookQuery, BookQueryVariables>) {
        return Apollo.useQuery<BookQuery, BookQueryVariables>(BookDocument, baseOptions);
      }
export function useBookLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BookQuery, BookQueryVariables>) {
          return Apollo.useLazyQuery<BookQuery, BookQueryVariables>(BookDocument, baseOptions);
        }
export type BookQueryHookResult = ReturnType<typeof useBookQuery>;
export type BookLazyQueryHookResult = ReturnType<typeof useBookLazyQuery>;
export type BookQueryResult = Apollo.QueryResult<BookQuery, BookQueryVariables>;
export const DeleteBookDocument = gql`
    mutation DeleteBook($id: ID!) {
  deleteBook(id: $id)
}
    `;
export type DeleteBookMutationFn = Apollo.MutationFunction<DeleteBookMutation, DeleteBookMutationVariables>;

/**
 * __useDeleteBookMutation__
 *
 * To run a mutation, you first call `useDeleteBookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteBookMutation, { data, loading, error }] = useDeleteBookMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteBookMutation(baseOptions?: Apollo.MutationHookOptions<DeleteBookMutation, DeleteBookMutationVariables>) {
        return Apollo.useMutation<DeleteBookMutation, DeleteBookMutationVariables>(DeleteBookDocument, baseOptions);
      }
export type DeleteBookMutationHookResult = ReturnType<typeof useDeleteBookMutation>;
export type DeleteBookMutationResult = Apollo.MutationResult<DeleteBookMutation>;
export type DeleteBookMutationOptions = Apollo.BaseMutationOptions<DeleteBookMutation, DeleteBookMutationVariables>;
export const CreateBookDocument = gql`
    mutation CreateBook($title: String!, $summary: String!, $content: String!) {
  createBook(title: $title, summary: $summary, content: $content) {
    id
    title
    created
    lastChanged
    summary
    content
    ratingsAverage
    ratingsQuantity
    author {
      id
      name
      avatar
    }
  }
}
    `;
export type CreateBookMutationFn = Apollo.MutationFunction<CreateBookMutation, CreateBookMutationVariables>;

/**
 * __useCreateBookMutation__
 *
 * To run a mutation, you first call `useCreateBookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBookMutation, { data, loading, error }] = useCreateBookMutation({
 *   variables: {
 *      title: // value for 'title'
 *      summary: // value for 'summary'
 *      content: // value for 'content'
 *   },
 * });
 */
export function useCreateBookMutation(baseOptions?: Apollo.MutationHookOptions<CreateBookMutation, CreateBookMutationVariables>) {
        return Apollo.useMutation<CreateBookMutation, CreateBookMutationVariables>(CreateBookDocument, baseOptions);
      }
export type CreateBookMutationHookResult = ReturnType<typeof useCreateBookMutation>;
export type CreateBookMutationResult = Apollo.MutationResult<CreateBookMutation>;
export type CreateBookMutationOptions = Apollo.BaseMutationOptions<CreateBookMutation, CreateBookMutationVariables>;
export const BooksDocument = gql`
    query Books($first: Int!, $after: String, $where: BooksWhereInput, $orderBy: BooksOrder, $byFollowings: Boolean) {
  books(
    first: $first
    after: $after
    where: $where
    orderBy: $orderBy
    byFollowings: $byFollowings
  ) {
    nodes {
      id
      title
      created
      lastChanged
      summary
      ratingsAverage
      ratingsQuantity
      author {
        id
        name
        avatar
      }
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
    `;

/**
 * __useBooksQuery__
 *
 * To run a query within a React component, call `useBooksQuery` and pass it any options that fit your needs.
 * When your component renders, `useBooksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBooksQuery({
 *   variables: {
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      where: // value for 'where'
 *      orderBy: // value for 'orderBy'
 *      byFollowings: // value for 'byFollowings'
 *   },
 * });
 */
export function useBooksQuery(baseOptions: Apollo.QueryHookOptions<BooksQuery, BooksQueryVariables>) {
        return Apollo.useQuery<BooksQuery, BooksQueryVariables>(BooksDocument, baseOptions);
      }
export function useBooksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BooksQuery, BooksQueryVariables>) {
          return Apollo.useLazyQuery<BooksQuery, BooksQueryVariables>(BooksDocument, baseOptions);
        }
export type BooksQueryHookResult = ReturnType<typeof useBooksQuery>;
export type BooksLazyQueryHookResult = ReturnType<typeof useBooksLazyQuery>;
export type BooksQueryResult = Apollo.QueryResult<BooksQuery, BooksQueryVariables>;
export const GetFollowersDocument = gql`
    query GetFollowers($first: Int!, $where: FollowsWhereInput, $after: String, $orderBy: FollowOrder) {
  getFollows(first: $first, where: $where, after: $after, orderBy: $orderBy) {
    nodes {
      id
      created
      follower {
        id
        name
        email
        avatar
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
    `;

/**
 * __useGetFollowersQuery__
 *
 * To run a query within a React component, call `useGetFollowersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFollowersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFollowersQuery({
 *   variables: {
 *      first: // value for 'first'
 *      where: // value for 'where'
 *      after: // value for 'after'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useGetFollowersQuery(baseOptions: Apollo.QueryHookOptions<GetFollowersQuery, GetFollowersQueryVariables>) {
        return Apollo.useQuery<GetFollowersQuery, GetFollowersQueryVariables>(GetFollowersDocument, baseOptions);
      }
export function useGetFollowersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFollowersQuery, GetFollowersQueryVariables>) {
          return Apollo.useLazyQuery<GetFollowersQuery, GetFollowersQueryVariables>(GetFollowersDocument, baseOptions);
        }
export type GetFollowersQueryHookResult = ReturnType<typeof useGetFollowersQuery>;
export type GetFollowersLazyQueryHookResult = ReturnType<typeof useGetFollowersLazyQuery>;
export type GetFollowersQueryResult = Apollo.QueryResult<GetFollowersQuery, GetFollowersQueryVariables>;
export const GetFollowingsDocument = gql`
    query GetFollowings($first: Int!, $where: FollowsWhereInput, $after: String, $orderBy: FollowOrder) {
  getFollows(first: $first, where: $where, after: $after, orderBy: $orderBy) {
    nodes {
      id
      created
      following {
        id
        name
        email
        avatar
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
    `;

/**
 * __useGetFollowingsQuery__
 *
 * To run a query within a React component, call `useGetFollowingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFollowingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFollowingsQuery({
 *   variables: {
 *      first: // value for 'first'
 *      where: // value for 'where'
 *      after: // value for 'after'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useGetFollowingsQuery(baseOptions: Apollo.QueryHookOptions<GetFollowingsQuery, GetFollowingsQueryVariables>) {
        return Apollo.useQuery<GetFollowingsQuery, GetFollowingsQueryVariables>(GetFollowingsDocument, baseOptions);
      }
export function useGetFollowingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFollowingsQuery, GetFollowingsQueryVariables>) {
          return Apollo.useLazyQuery<GetFollowingsQuery, GetFollowingsQueryVariables>(GetFollowingsDocument, baseOptions);
        }
export type GetFollowingsQueryHookResult = ReturnType<typeof useGetFollowingsQuery>;
export type GetFollowingsLazyQueryHookResult = ReturnType<typeof useGetFollowingsLazyQuery>;
export type GetFollowingsQueryResult = Apollo.QueryResult<GetFollowingsQuery, GetFollowingsQueryVariables>;
export const IsUserOnlineDocument = gql`
    subscription IsUserOnline($userId: ID!) {
  isUserOnline(userId: $userId) {
    userId
    isOnline
  }
}
    `;

/**
 * __useIsUserOnlineSubscription__
 *
 * To run a query within a React component, call `useIsUserOnlineSubscription` and pass it any options that fit your needs.
 * When your component renders, `useIsUserOnlineSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIsUserOnlineSubscription({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useIsUserOnlineSubscription(baseOptions: Apollo.SubscriptionHookOptions<IsUserOnlineSubscription, IsUserOnlineSubscriptionVariables>) {
        return Apollo.useSubscription<IsUserOnlineSubscription, IsUserOnlineSubscriptionVariables>(IsUserOnlineDocument, baseOptions);
      }
export type IsUserOnlineSubscriptionHookResult = ReturnType<typeof useIsUserOnlineSubscription>;
export type IsUserOnlineSubscriptionResult = Apollo.SubscriptionResult<IsUserOnlineSubscription>;
export const UserDocument = gql`
    query User($id: ID!) {
  user(id: $id) {
    id
    name
    email
    created
    avatar
    bio
    followers
    followings
    isFollowing
    isOnline
  }
}
    `;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserQuery(baseOptions: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>) {
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, baseOptions);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, baseOptions);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export const SearchDocument = gql`
    query Search($first: Int!, $query: String!, $after: String) {
  searchBooks(first: $first, query: $query, after: $after) {
    nodes {
      id
      title
      created
      summary
      author {
        id
        name
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
    `;

/**
 * __useSearchQuery__
 *
 * To run a query within a React component, call `useSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchQuery({
 *   variables: {
 *      first: // value for 'first'
 *      query: // value for 'query'
 *      after: // value for 'after'
 *   },
 * });
 */
export function useSearchQuery(baseOptions: Apollo.QueryHookOptions<SearchQuery, SearchQueryVariables>) {
        return Apollo.useQuery<SearchQuery, SearchQueryVariables>(SearchDocument, baseOptions);
      }
export function useSearchLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchQuery, SearchQueryVariables>) {
          return Apollo.useLazyQuery<SearchQuery, SearchQueryVariables>(SearchDocument, baseOptions);
        }
export type SearchQueryHookResult = ReturnType<typeof useSearchQuery>;
export type SearchLazyQueryHookResult = ReturnType<typeof useSearchLazyQuery>;
export type SearchQueryResult = Apollo.QueryResult<SearchQuery, SearchQueryVariables>;