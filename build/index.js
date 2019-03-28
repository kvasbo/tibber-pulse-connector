"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _apolloLinkWs = require("apollo-link-ws");

var _apolloCacheInmemory = require("apollo-cache-inmemory");

var _apolloClient = _interopRequireDefault(require("apollo-client"));

var _graphqlTag = _interopRequireDefault(require("graphql-tag"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["subscription liveConsumption($homeId: ID!) {\n  liveMeasurement(homeId:$homeId)\n    {\n      timestamp\n      power\n      accumulatedConsumption\n      accumulatedCost\n      currency\n      minPower\n      averagePower\n      maxPower\n    }\n  }"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

// import ws from 'ws';
// Polyfill
// if (!global.fetch) global.fetch = require('node-fetch');
var ENDPOINT = "wss://api.tibber.com/v1-beta/gql/subscriptions";
var CONSUMPTION_QUERY = (0, _graphqlTag.default)(_templateObject());

var tibberConnector =
/*#__PURE__*/
function () {
  function tibberConnector(token, homeId, onData) {
    _classCallCheck(this, tibberConnector);

    if (!token) {
      console.log("No token provided. Computer says no.");
      return;
    }

    if (!homeId) {
      console.log("No homeId provided. Computer says no.");
      return;
    }

    if (!onData) {
      console.log("No callback function provided. Will console.log instead.");
    }

    this.homeId = homeId; // Fallback function if no callback is defined.

    this.onData = onData ? onData : function (data) {
      return console.log(data);
    }; // Create link

    this.link = new _apolloLinkWs.WebSocketLink({
      uri: ENDPOINT,
      options: {
        reconnect: true,
        connectionParams: function connectionParams() {
          return {
            token: token
          };
        }
      } // webSocketImpl: ws

    }); // Set up client

    this.client = new _apolloClient.default({
      link: this.link,
      cache: new _apolloCacheInmemory.InMemoryCache()
    });
  }

  _createClass(tibberConnector, [{
    key: "start",
    value: function start() {
      var _this = this;

      this.observer = this.client.subscribe({
        query: CONSUMPTION_QUERY,
        variables: {
          homeId: this.homeId
        }
      }).subscribe({
        next: function next(data) {
          if (data && data.liveMeasurement) {
            _this.onData(data.liveMeasurement);
          } else {
            throw new Error("No Tibber data or malformed data");
          }
        },
        error: function error(err) {
          console.error('err', err);
        }
      });
    }
  }]);

  return tibberConnector;
}();

module.exports = tibberConnector;
var _default = tibberConnector;
exports.default = _default;