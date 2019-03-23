import { HttpLink, createHttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from "subscriptions-transport-ws";
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import gql from 'graphql-tag';
import ws from 'ws';

// Polyfill
if (!global.fetch) global.fetch = require('node-fetch');

const ENDPOINT = `wss://api.tibber.com/v1-beta/gql/subscriptions`;

/*
const client = new SubscriptionClient(ENDPOINT, {
  reconnect: true
});
*/

const link = new WebSocketLink({
  uri: ENDPOINT,
  options: {
    reconnect: true,
    connectionParams: () => ({
      authToken: '1a3772d944bcf972f1ee84cf45d769de1c80e4f0173d665328287d1e2a746004',
    }),
  },
  webSocketImpl: ws
});

/*
const link = new WebSocketLink({ uri: ENDPOINT, options: {}, webSocketImpl: ws });
*/


const apolloClient = new ApolloClient({
  link: link,
  cache: new InMemoryCache()
});


console.log("client created");

/*
apolloClient.query({ query: gql`{ hello }` }).then(console.log);
*/

/*
apolloClient.onConnected((a) => {
  console.log('connected', a);
});
*/