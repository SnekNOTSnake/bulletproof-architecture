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
};


export type AuthData = {
  __typename?: 'AuthData';
  user: User;
  token: Scalars['String'];
  tokenExpiration: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  name: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  joined: Scalars['DateTime'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createBook?: Maybe<Book>;
  deleteBook?: Maybe<Scalars['ID']>;
  signin?: Maybe<AuthData>;
  signup?: Maybe<User>;
  updateBook?: Maybe<Book>;
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
      & Pick<User, 'name'>
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
        & Pick<User, 'name'>
      ) }
    )>, pageInfo: (
      { __typename?: 'PageInfo' }
      & Pick<PageInfo, 'endCursor' | 'hasNextPage'>
    ) }
  ) }
);


export const BookDocument = gql`
    query Book($id: ID!) {
  book(id: $id) {
    id
    title
    author {
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
export const BooksDocument = gql`
    query Books($first: Int!, $after: String, $where: BooksWhereInput) {
  books(first: $first, after: $after, where: $where) {
    nodes {
      id
      title
      created
      lastChanged
      author {
        name
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