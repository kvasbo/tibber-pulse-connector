import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import gql from 'graphql-tag';
import ws from 'ws';

// Polyfill
if (!global.fetch) global.fetch = require('node-fetch');

const ENDPOINT = `wss://api.tibber.com/v1-beta/gql/subscriptions`;

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

class tibberConnector {
  constructor(token, homeId, onData) {
    if (!token) {
      console.log("No token provided. Computer says no.")
      return;
    }
    if (!homeId) {
      console.log("No homeId provided. Computer says no.")
      return;
    }
    if (!onData) {
      console.log("No callback function provided, will simply log to console.")
    }

    this.homeId = homeId;    

    // Create link
    this.link = new WebSocketLink({
      uri: ENDPOINT,
      options: {
        reconnect: true,
        connectionParams: () => ({
          token: token,
        }),
      },
      webSocketImpl: ws
    });

    this.client = new ApolloClient({
      link: this.link,
      cache: new InMemoryCache()
    });
  }

  onData(data) { console.log(data) };

  start() {
    this.observer = this.client.subscribe({ query: CONSUMPTION_QUERY, variables: { homeId: this.homeId } }).subscribe({
      next(data) {
        console.log(data);
      },
      error(err) { console.error('err', err); },
    });

  }

}

/*
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
*/

/*
const apolloClient = new ApolloClient({
  link: link,
  cache: new InMemoryCache()
});
*/

/*
const observer = apolloClient.subscribe({ query: CONSUMPTION_QUERY, variables: { homeId: HOMEID } });

observer.subscribe({
  next(data) {
    console.log(data);
  },
  error(err) { console.error('err', err); },
});
*/

module.exports = tibberConnector;
export default tibberConnector;