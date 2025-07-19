// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Items } from './types';

// Define a service using a base URL and expected endpoints
export const listahApi = createApi({
  reducerPath: 'listahApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_LISTAH_API_BASE_URL }),
  endpoints: (builder) => ({
    getItems: builder.query<Items, string>({
      query: (name) => `pokemon/${name}`,
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetPokemonByNameQuery } = pokemonApi
