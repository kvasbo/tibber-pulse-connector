import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import gql from 'graphql-tag';

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
  private homeId: string;
  private onData: Function;
  private link: WebSocketLink;
  private client: any;

  constructor(token: string, homeId: string, onData: Function, ws: WebSocket = undefined) {
    if (!token) {
      console.log("No token provided. Computer says no.")
      throw new Error("No token supplied");
    }
    if (!homeId) {
      console.log("No homeId provided. Computer says no.")
      throw new Error("No homeID supplied");
    }
    if (!onData) {
      throw new Error("No callback supplied");
    }

    this.homeId = homeId;

    // Fallback function if no callback is defined.
    this.onData = (onData) ? onData : (data: any) => console.log(data);

    const linkOptions: WebSocketLink.Configuration = {
      uri: ENDPOINT,
      options: {
        reconnect: true,
        connectionParams: () => ({
          token: token,
        }),
      },
    }

    // Add websocket if defined
    if (ws) {
      linkOptions.webSocketImpl = ws;
    }

    // Create link
    this.link = new WebSocketLink(linkOptions);

    // Set up client
    this.client = new ApolloClient({
      link: this.link,
      cache: new InMemoryCache()
    });
  }

  public start = () => {
    this.client.subscribe({ query: CONSUMPTION_QUERY, variables: { homeId: this.homeId } }).subscribe({
      next: (data: object) => {
        if (data) {
          this.onData(data);
        } else {
          throw new Error("No Tibber data or malformed data");
        }
        
      },
      error(err: Error) { console.error('err', err); },
    });
  }

}

module.exports = tibberConnector;

export default tibberConnector;