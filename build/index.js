"use strict";

var _apolloLinkHttp = require("apollo-link-http");

var _apolloLink = require("apollo-link");

var _apolloLinkWs = require("apollo-link-ws");

var _subscriptionsTransportWs = require("subscriptions-transport-ws");

var _apolloCacheInmemory = require("apollo-cache-inmemory");

var _apolloClient = _interopRequireDefault(require("apollo-client"));

var _graphqlTag = _interopRequireDefault(require("graphql-tag"));

var _ws = _interopRequireDefault(require("ws"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject2() {
  var data = _taggedTemplateLiteral(["{ subscription{\n  liveMeasurement(homeId:\"d1007ead2dc84a2b82f0de19451c5fb22112f7ae11d19bf2bedb224a003ff74a\"){\n    timestamp\n    power    \n    maxPower\n  }\n} }"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["{ subscription{\n    liveMeasurement(homeId:\"d1007ead2dc84a2b82f0de19451c5fb22112f7ae11d19bf2bedb224a003ff74a\"){\n      timestamp\n      power    \n      maxPower\n    }\n  } }"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

// Polyfill
if (!global.fetch) global.fetch = require('node-fetch');
var ENDPOINT = "wss://d1007ead2dc84a2b82f0de19451c5fb22112f7ae11d19bf2bedb224a003ff74a@api.tibber.com/v1-beta/gql/subscriptions"; // const HOMEID = `68e6938b-91a6-4199-a0d4-f24c22be87bb`;
// const TOKEN = `d1007ead2dc84a2b82f0de19451c5fb22112f7ae11d19bf2bedb224a003ff74a`;

var HOMEID = "68e6938b-91a6-4199-a0d4-f24c22be87bb";
var TOKEN = "d1007ead2dc84a2b82f0de19451c5fb22112f7ae11d19bf2bedb224a003ff74a";
/*
const client = new SubscriptionClient(ENDPOINT, {
  reconnect: true
});
*/

var operation = {
  query: (0, _graphqlTag.default)(_templateObject())
};
var link = new _apolloLinkWs.WebSocketLink({
  uri: ENDPOINT,
  options: {
    reconnect: true,
    connectionParams: function connectionParams() {
      return {
        // authToken: TOKEN,
        headers: {
          Authorization: "Bearer d1007ead2dc84a2b82f0de19451c5fb22112f7ae11d19bf2bedb224a003ff74a"
        }
      };
    }
  },
  webSocketImpl: _ws.default
});
/*
const link = new WebSocketLink({ uri: ENDPOINT, options: {}, webSocketImpl: ws });
*/

(0, _apolloLink.execute)(link, operation).subscribe({
  next: function next(data) {
    return console.log("received data: ".concat(JSON.stringify(data, null, 2)));
  },
  error: function error(_error) {
    return console.log("received error ".concat(_error.message));
  },
  complete: function complete() {
    return console.log("complete");
  }
});
var apolloClient = new _apolloClient.default({
  link: link,
  cache: new _apolloCacheInmemory.InMemoryCache()
});
console.log("client created");
apolloClient.query({
  query: (0, _graphqlTag.default)(_templateObject2())
}).then(console.log);
/*
apolloClient.onConnected((a) => {
  console.log('connected', a);
});
*/