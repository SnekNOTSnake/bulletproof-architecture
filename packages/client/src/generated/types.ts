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
  joined: Scalars['DateTime'];
  avatar: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createBook?: Maybe<Book>;
  deleteBook?: Maybe<Scalars['ID']>;
  signin?: Maybe<AuthData>;
  signup?: Maybe<User>;
  updateBook?: Maybe<Book>;
  uploadAvatar: File;
};


export type MutationCreateBookArgs = {
  title: Scalars['String'];
};


export type MutationDeleteBookArgs = {
  id: Scalars['ID'];
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


export type MutationUpdateBookArgs = {
  id: Scalars['ID'];
  title: Scalars['String'];
};


export type MutationUploadAvatarArgs = {
  file: Scalars['Upload'];
};

export type Query = {
  __typename?: 'Query';
  book?: Maybe<Book>;
  books: BookConnection;
  me?: Maybe<User>;
};


export type QueryBookArgs = {
  id: Scalars['ID'];
};


export type QueryBooksArgs = {
  after?: Maybe<Scalars['String']>;
  first: Scalars['Int'];
  where?: Maybe<BooksWhereInput>;
};

export type Book = {
  __typename?: 'Book';
  id: Scalars['ID'];
  title: Scalars['String'];
  author: User;
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

export type BooksWhereInput = {
  _id?: Maybe<Scalars['String']>;
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

export type UpdateBookMutationVariables = Exact<{
  id: Scalars['ID'];
  title: Scalars['String'];
}>;


export type UpdateBookMutation = (
  { __typename?: 'Mutation' }
  & { updateBook?: Maybe<(
    { __typename?: 'Book' }
    & Pick<Book, 'id' | 'title' | 'created' | 'lastChanged'>
    & { author: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'name' | 'email'>
    ) }
  )> }
);

export type BookQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type BookQuery = (
  { __typename?: 'Query' }
  & { book?: Maybe<(
    { __typename?: 'Book' }
    & Pick<Book, 'id' | 'title' | 'created' | 'lastChanged'>
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
}>;


export type CreateBookMutation = (
  { __typename?: 'Mutation' }
  & { createBook?: Maybe<(
    { __typename?: 'Book' }
    & Pick<Book, 'id' | 'title' | 'created' | 'lastChanged'>
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
}>;


export type BooksQuery = (
  { __typename?: 'Query' }
  & { books: (
    { __typename?: 'BookConnection' }
    & { nodes: Array<(
      { __typename?: 'Book' }
      & Pick<Book, 'id' | 'title' | 'created' | 'lastChanged'>
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

export type UploadAvatarMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type UploadAvatarMutation = (
  { __typename?: 'Mutation' }
  & { uploadAvatar: (
    { __typename?: 'File' }
    & Pick<File, 'id' | 'filename'>
  ) }
);


export const UpdateBookDocument = gql`
    mutation UpdateBook($id: ID!, $title: String!) {
  updateBook(id: $id, title: $title) {
    id
    title
    created
    lastChanged
    author {
      id
      name
      email
    }
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
 *   },
 * });
 */
export function useUpdateBookMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBookMutation, UpdateBookMutationVariables>) {
        return Apollo.useMutation<UpdateBookMutation, UpdateBookMutationVariables>(UpdateBookDocument, baseOptions);
      }
export type UpdateBookMutationHookResult = ReturnType<typeof useUpdateBookMutation>;
export type UpdateBookMutationResult = Apollo.MutationResult<UpdateBookMutation>;
export type UpdateBookMutationOptions = Apollo.BaseMutationOptions<UpdateBookMutation, UpdateBookMutationVariables>;
export const BookDocument = gql`
    query Book($id: ID!) {
  book(id: $id) {
    id
    title
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
    mutation CreateBook($title: String!) {
  createBook(title: $title) {
    id
    title
    created
    lastChanged
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
    query Books($first: Int!, $after: String, $where: BooksWhereInput) {
  books(first: $first, after: $after, where: $where) {
    nodes {
      id
      title
      created
      lastChanged
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
export const UploadAvatarDocument = gql`
    mutation UploadAvatar($file: Upload!) {
  uploadAvatar(file: $file) {
    id
    filename
  }
}
    `;
export type UploadAvatarMutationFn = Apollo.MutationFunction<UploadAvatarMutation, UploadAvatarMutationVariables>;

/**
 * __useUploadAvatarMutation__
 *
 * To run a mutation, you first call `useUploadAvatarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadAvatarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadAvatarMutation, { data, loading, error }] = useUploadAvatarMutation({
 *   variables: {
 *      file: // value for 'file'
 *   },
 * });
 */
export function useUploadAvatarMutation(baseOptions?: Apollo.MutationHookOptions<UploadAvatarMutation, UploadAvatarMutationVariables>) {
        return Apollo.useMutation<UploadAvatarMutation, UploadAvatarMutationVariables>(UploadAvatarDocument, baseOptions);
      }
export type UploadAvatarMutationHookResult = ReturnType<typeof useUploadAvatarMutation>;
export type UploadAvatarMutationResult = Apollo.MutationResult<UploadAvatarMutation>;
export type UploadAvatarMutationOptions = Apollo.BaseMutationOptions<UploadAvatarMutation, UploadAvatarMutationVariables>;