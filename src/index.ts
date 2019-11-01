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
      voltagePhase1
      voltagePhase2
      voltagePhase3
      currentPhase1
      currentPhase2
      currentPhase3
    }
  }`;

export interface tibberConnectorOptions {
  token: string;
  homeId: string | string[];
  onData?: Function;
  onError?: Function;
  ws?: WebSocket;
}

class tibberConnector {
  private homeId: string[];
  private onData: Function;
  private onError: Function;
  private link: WebSocketLink;
  private client: any;

  constructor(options: tibberConnectorOptions) {
    const { token, homeId, onData, ws, onError } = options;
    if (!token) {
      console.log("No token provided. Computer says no.")
      throw new Error("No token supplied");
    }
    if (!homeId) {
      console.log("No homeId provided. Computer says no.")
      throw new Error("No homeID supplied");
    }

    // Fallback function if no callbacks defined.
    this.onData = (onData) ? onData : (data: any) => console.log('Data', data);
    this.onError = (onError) ? onError : (error: any) => console.log('Error', error);
    
    // Make sure we have an array of ids.
    if (Array.isArray(homeId)) {
      this.homeId = [...homeId];
    } else {
      this.homeId = [homeId];
    }
    
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
    this.homeId.forEach((id) => {
      this.client.subscribe({ query: CONSUMPTION_QUERY, variables: { homeId: id } }).subscribe({
        next: (data: object) => {
          this.onData(data, id);
        },
        error: (err: Error) => { this.onError(err, id); },
      });
    });
  }

}

module.exports = tibberConnector;

export default tibberConnector;