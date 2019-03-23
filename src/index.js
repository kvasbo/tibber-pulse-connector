import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';

// Polyfill
if (!global.fetch) global.fetch = require('node-fetch');

const ENDPOINT = `wss://api.tibber.com/v1-beta/gql/subscriptions`;

const apolloClient = new ApolloClient({
  link: new HttpLink(ENDPOINT),
  cache: new InMemoryCache()
});

/*
apolloClient.onConnected((a) => {
  console.log('connected', a);
});
*/