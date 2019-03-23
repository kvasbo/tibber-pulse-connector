"use strict";

var _apolloLinkHttp = require("apollo-link-http");

var _apolloCacheInmemory = require("apollo-cache-inmemory");

var _apolloClient = _interopRequireDefault(require("apollo-client"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Polyfill
if (!global.fetch) global.fetch = require('node-fetch');
var ENDPOINT = "wss://api.tibber.com/v1-beta/gql/subscriptions";
var apolloClient = new _apolloClient.default({
  link: new _apolloLinkHttp.HttpLink(ENDPOINT),
  cache: new _apolloCacheInmemory.InMemoryCache()
});
/*
apolloClient.onConnected((a) => {
  console.log('connected', a);
});
*/