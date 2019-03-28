"use strict";

var _apolloLinkWs = require("apollo-link-ws");

var _apolloCacheInmemory = require("apollo-cache-inmemory");

var _apolloClient = _interopRequireDefault(require("apollo-client"));

var _graphqlTag = _interopRequireDefault(require("graphql-tag"));

var _ws = _interopRequireDefault(require("ws"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["subscription liveConsumption($homeId: ID!) {\n  liveMeasurement(homeId:$homeId)\n    {\n      timestamp\n      power\n      accumulatedConsumption\n      accumulatedCost\n      currency\n      minPower\n      averagePower\n      maxPower\n    }\n  }"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

// Polyfill
if (!global.fetch) global.fetch = require('node-fetch');
var ENDPOINT = "wss://api.tibber.com/v1-beta/gql/subscriptions"; // const HOMEID = `68e6938b-91a6-4199-a0d4-f24c22be87bb`;
// const TOKEN = `d1007ead2dc84a2b82f0de19451c5fb22112f7ae11d19bf2bedb224a003ff74a`;

var HOMEID = "68e6938b-91a6-4199-a0d4-f24c22be87bb";
var TOKEN = "d1007ead2dc84a2b82f0de19451c5fb22112f7ae11d19bf2bedb224a003ff74a";
var CONSUMPTION_QUERY = (0, _graphqlTag.default)(_templateObject());
var link = new _apolloLinkWs.WebSocketLink({
  uri: ENDPOINT,
  options: {
    reconnect: true,
    connectionParams: function connectionParams() {
      return {
        token: TOKEN
      };
    }
  },
  webSocketImpl: _ws.default
});
var apolloClient = new _apolloClient.default({
  link: link,
  cache: new _apolloCacheInmemory.InMemoryCache()
});
apolloClient;
var observer = apolloClient.subscribe({
  query: CONSUMPTION_QUERY,
  variables: {
    homeId: HOMEID
  }
});
observer.subscribe({
  next: function next(data) {
    console.log(data);
  },
  error: function error(err) {
    console.error('err', err);
  }
});