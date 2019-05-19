import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import gql from 'graphql-tag';
const ENDPOINT = `wss://api.tibber.com/v1-beta/gql/subscriptions`;
const CONSUMPTION_QUERY = gql `subscription liveConsumption($homeId: ID!) {
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
        this.start = () => {
            this.client.subscribe({ query: CONSUMPTION_QUERY, variables: { homeId: this.homeId } }).subscribe({
                next: (data) => {
                    if (data) {
                        this.onData(data);
                    }
                    else {
                        throw new Error("No Tibber data or malformed data");
                    }
                },
                error(err) { console.error('err', err); },
            });
        };
        if (!token) {
            console.log("No token provided. Computer says no.");
            throw new Error("No token supplied");
        }
        if (!homeId) {
            console.log("No homeId provided. Computer says no.");
            throw new Error("No homeID supplied");
        }
        if (!onData) {
            throw new Error("No callback supplied");
        }
        this.homeId = homeId;
        this.onData = (onData) ? onData : (data) => console.log(data);
        this.link = new WebSocketLink({
            uri: ENDPOINT,
            options: {
                reconnect: true,
                connectionParams: () => ({
                    token: token,
                }),
            },
        });
        this.client = new ApolloClient({
            link: this.link,
            cache: new InMemoryCache()
        });
    }
}
module.exports = tibberConnector;
export default tibberConnector;
//# sourceMappingURL=index.js.map