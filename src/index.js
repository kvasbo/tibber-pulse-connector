import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import gql from 'graphql-tag';
import ws from 'ws';

// Polyfill
if (!global.fetch) global.fetch = require('node-fetch');

const ENDPOINT = `wss://api.tibber.com/v1-beta/gql/subscriptions`;
// const HOMEID = `68e6938b-91a6-4199-a0d4-f24c22be87bb`;
// const TOKEN = `d1007ead2dc84a2b82f0de19451c5fb22112f7ae11d19bf2bedb224a003ff74a`;

const HOMEID = "68e6938b-91a6-4199-a0d4-f24c22be87bb"
const TOKEN = "d1007ead2dc84a2b82f0de19451c5fb22112f7ae11d19bf2bedb224a003ff74a"

const CONSUMPTION_QUERY = gql`subscription liveConsumption($homeId: ID!) {
  liveMeasurement(homeId:$homeId)
    {
      timestamp
      power
      accumulatedConsumption
      accumulatedCost
      currency
      minPower
      averagePower
      maxPower
    }
  }`;

const link = new WebSocketLink({
  uri: ENDPOINT,
  options: {
    reconnect: true,
    connectionParams: () => ({
      token: TOKEN,
    }),
  },
  webSocketImpl: ws
});

const apolloClient = new ApolloClient({
  link: link,
  cache: new InMemoryCache()
});

apolloClient

const observer = apolloClient.subscribe({ query: CONSUMPTION_QUERY, variables: { homeId: HOMEID } });

observer.subscribe({
  next(data) {
    console.log(data);
  },
  error(err) { console.error('err', err); },
});