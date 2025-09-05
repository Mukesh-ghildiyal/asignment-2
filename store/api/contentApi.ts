import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface NewsArticle {
  id: string;
  webTitle: string;
  webUrl: string;
  fields?: {
    headline?: string;
    thumbnail?: string;
    bodyText?: string;
  };
  sectionName: string;
  webPublicationDate: string;
  type: 'news';
}

export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  subject?: string[];
  type: 'book';
}

export interface SocialPost {
  id: number;
  title: string;
  body: string;
  userId: number;
  type: 'social';
}

export type ContentItem = NewsArticle | Book | SocialPost;

const GUARDIAN_API_KEY = 'test'; // In production, use environment variable

export const contentApi = createApi({
  reducerPath: 'contentApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    getNews: builder.query<{ response: { results: NewsArticle[] } }, { page?: number; query?: string }>({
      query: ({ page = 1, query = '' }) => ({
        url: `https://content.guardianapis.com/search?api-key=${GUARDIAN_API_KEY}&show-fields=headline,thumbnail,bodyText&page=${page}&q=${query}&page-size=10`,
        method: 'GET',
      }),
      transformResponse: (response: { response: { results: NewsArticle[] } }) => ({
        response: {
          results: response.response.results.map(article => ({ ...article, type: 'news' as const }))
        }
      }),
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems, { arg: { page = 1 } }) => {
        if (page === 1) {
          currentCache.response.results = newItems.response.results;
        } else {
          currentCache.response.results.push(...newItems.response.results);
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    
    getBooks: builder.query<{ docs: Book[] }, { page?: number; query?: string }>({
      query: ({ page = 1, query = '' }) => ({
        url: `https://openlibrary.org/search.json?q=${query || 'bestseller'}&limit=10&offset=${(page - 1) * 10}`,
        method: 'GET',
      }),
      transformResponse: (response: { docs: Book[] }) => ({
        docs: response.docs.map(book => ({ ...book, type: 'book' as const }))
      }),
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems, { arg: { page = 1 } }) => {
        if (page === 1) {
          currentCache.docs = newItems.docs;
        } else {
          currentCache.docs.push(...newItems.docs);
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    
    getSocialPosts: builder.query<SocialPost[], { page?: number; query?: string }>({
      query: ({ page = 1 }) => ({
        url: `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`,
        method: 'GET',
      }),
      transformResponse: (response: SocialPost[]) => 
        response.map(post => ({ ...post, type: 'social' as const })),
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      merge: (currentCache, newItems, { arg: { page = 1 } }) => {
        if (page === 1) {
          return newItems;
        } else {
          return [...currentCache, ...newItems];
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
  }),
});

export const { useGetNewsQuery, useGetBooksQuery, useGetSocialPostsQuery } = contentApi;