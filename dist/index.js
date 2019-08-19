"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _apolloLinkWs = require("apollo-link-ws");

var _apolloCacheInmemory = require("apollo-cache-inmemory");

var _apolloClient = _interopRequireDefault(require("apollo-client"));

var _graphqlTag = _interopRequireDefault(require("graphql-tag"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _templateObject() {
  var data = _taggedTemplateLiteral(["subscription liveConsumption($homeId: ID!) {\n  liveMeasurement(homeId:$homeId)\n    {\n      timestamp\n      power\n      powerProduction\n      accumulatedConsumption\n      accumulatedProduction\n      accumulatedCost\n      accumulatedReward\n      currency\n      minPower\n      averagePower\n      maxPower\n      minPowerProduction\n      maxPowerProduction\n      lastMeterConsumption\n      lastMeterProduction\n    }\n  }"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var ENDPOINT = "wss://api.tibber.com/v1-beta/gql/subscriptions";
var CONSUMPTION_QUERY = (0, _graphqlTag["default"])(_templateObject());

var tibberConnector = function tibberConnector(options) {
  var _this = this;

  _classCallCheck(this, tibberConnector);

  this.start = function () {
    _this.client.subscribe({
      query: CONSUMPTION_QUERY,
      variables: {
        homeId: _this.homeId
      }
    }).subscribe({
      next: function next(data) {
        if (data) {
          _this.onData(data);
        } else {
          _this.onError(new Error('Data error'));
        }
      },
      error: function error(err) {
        this.onError(err);
      }
    });
  };

  var token = options.token,
      homeId = options.homeId,
      onData = options.onData,
      ws = options.ws,
      onError = options.onError;

  if (!token) {
    console.log("No token provided. Computer says no.");
    throw new Error("No token supplied");
  }

  if (!homeId) {
    console.log("No homeId provided. Computer says no.");
    throw new Error("No homeID supplied");
  }

  this.onData = onData ? onData : function (data) {
    return console.log('Data', data);
  };
  this.onError = onError ? onError : function (error) {
    return console.log('Error', error);
  };
  this.homeId = homeId;
  var linkOptions = {
    uri: ENDPOINT,
    options: {
      reconnect: true,
      connectionParams: function connectionParams() {
        return {
          token: token
        };
      }
    }
  };

  if (ws) {
    linkOptions.webSocketImpl = ws;
  }

  this.link = new _apolloLinkWs.WebSocketLink(linkOptions);
  this.client = new _apolloClient["default"]({
    link: this.link,
    cache: new _apolloCacheInmemory.InMemoryCache()
  });
};

module.exports = tibberConnector;
var _default = tibberConnector;
exports["default"] = _default;