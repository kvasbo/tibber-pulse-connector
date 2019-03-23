"use strict";

var _apolloLinkHttp = require("apollo-link-http");

var _apolloLinkWs = require("apollo-link-ws");

var _subscriptionsTransportWs = require("subscriptions-transport-ws");

var _apolloCacheInmemory = require("apollo-cache-inmemory");

var _apolloClient = _interopRequireDefault(require("apollo-client"));

var _graphqlTag = _interopRequireDefault(require("graphql-tag"));

var _ws = _interopRequireDefault(require("ws"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Polyfill
if (!global.fetch) global.fetch = require('node-fetch');
var ENDPOINT = "wss://api.tibber.com/v1-beta/gql/subscriptions";
/*
const client = new SubscriptionClient(ENDPOINT, {
  reconnect: true
});
*/

var link = new _apolloLinkWs.WebSocketLink({
  uri: ENDPOINT,
  options: {
    reconnect: true,
    connectionParams: function connectionParams() {
      return {
        authToken: '1a3772d944bcf972f1ee84cf45d769de1c80e4f0173d665328287d1e2a746004'
      };
    }
  },
  webSocketImpl: _ws.default
});
/*
const link = new WebSocketLink({ uri: ENDPOINT, options: {}, webSocketImpl: ws });
*/

var apolloClient = new _apolloClient.default({
  link: link,
  cache: new _apolloCacheInmemory.InMemoryCache()
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