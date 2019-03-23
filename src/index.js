import { HttpLink, createHttpLink } from 'apollo-link-http';
import { execute, makePromise } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from "subscriptions-transport-ws";
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import gql from 'graphql-tag';
import ws from 'ws';

// Polyfill
if (!global.fetch) global.fetch = require('node-fetch');

const ENDPOINT = `wss://d1007ead2dc84a2b82f0de19451c5fb22112f7ae11d19bf2bedb224a003ff74a@api.tibber.com/v1-beta/gql/subscriptions`;
// const HOMEID = `68e6938b-91a6-4199-a0d4-f24c22be87bb`;
// const TOKEN = `d1007ead2dc84a2b82f0de19451c5fb22112f7ae11d19bf2bedb224a003ff74a`;

const HOMEID = "68e6938b-91a6-4199-a0d4-f24c22be87bb"
const TOKEN = "d1007ead2dc84a2b82f0de19451c5fb22112f7ae11d19bf2bedb224a003ff74a"

/*
const client = new SubscriptionClient(ENDPOINT, {
  reconnect: true
});
*/

const operation = {
  query: gql`{ subscription{
    liveMeasurement(homeId:"d1007ead2dc84a2b82f0de19451c5fb22112f7ae11d19bf2bedb224a003ff74a"){
      timestamp
      power    
      maxPower
    }
  } }`,
}

const link = new WebSocketLink({
  uri: ENDPOINT,
  options: {
    reconnect: true,
    connectionParams: () => ({
      // authToken: TOKEN,
      headers: {
        Authorization: `Bearer d1007ead2dc84a2b82f0de19451c5fb22112f7ae11d19bf2bedb224a003ff74a`
      }
    }),
  },
  webSocketImpl: ws
});

/*
const link = new WebSocketLink({ uri: ENDPOINT, options: {}, webSocketImpl: ws });
*/

execute(link, operation).subscribe({
  next: data => console.log(`received data: ${JSON.stringify(data, null, 2)}`),
  error: error => console.log(`received error ${error.message}`),
  complete: () => console.log(`complete`),
})


const apolloClient = new ApolloClient({
  link: link,
  cache: new InMemoryCache()
});


console.log("client created");


apolloClient.query({ query: gql`{ subscription{
  liveMeasurement(homeId:"d1007ead2dc84a2b82f0de19451c5fb22112f7ae11d19bf2bedb224a003ff74a"){
    timestamp
    power    
    maxPower
  }
} }` }).then(console.log);


/*
apolloClient.onConnected((a) => {
  console.log('connected', a);
});
*/