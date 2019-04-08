import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import gql from 'graphql-tag';
// import ws from 'ws';

// Polyfill
// if (!global.fetch) global.fetch = require('node-fetch');

const ENDPOINT = `wss://api.tibber.com/v1-beta/gql/subscriptions`;

const CONSUMPTION_QUERY = gql`subscription liveConsumption($homeId: ID!) {
  liveMeasurement(homeId:$homeId)
    {
      timestamp
      power
      powerProduction
      accumulatedConsumption
      accumulatedProduction
      accumulatedCost
      accumulatedReward
      currency
      minPower
      averagePower
      maxPower
      minPowerProduction
      maxPowerProduction
      lastMeterConsumption
      lastMeterProduction
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
      console.log("No callback function provided. Will console.log instead.")
    }

    this.homeId = homeId;

    // Fallback function if no callback is defined.
    this.onData = (onData) ? onData : (data) => console.log(data);

    // Create link
    this.link = new WebSocketLink({
      uri: ENDPOINT,
      options: {
        reconnect: true,
        connectionParams: () => ({
          token: token,
        }),
      },
      // webSocketImpl: ws
    });

    // Set up client
    this.client = new ApolloClient({
      link: this.link,
      cache: new InMemoryCache()
    });
  }

  start() {
    this.observer = this.client.subscribe({ query: CONSUMPTION_QUERY, variables: { homeId: this.homeId } }).subscribe({
      next: (data) => {
        if (data) {
          this.onData(data);
        } else {
          throw new Error("No Tibber data or malformed data");
        }
        
      },
      error(err) { console.error('err', err); },
    });
  }

}

module.exports = tibberConnector;
export default tibberConnector;