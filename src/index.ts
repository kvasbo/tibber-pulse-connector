import { WebSocketLink } from "apollo-link-ws";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import gql from "graphql-tag";
import { ApiResponse, ErrorCallback, CorrectResponseCallback } from "./types";

const ENDPOINT = `wss://api.tibber.com/v1-beta/gql/subscriptions`;

const CONSUMPTION_QUERY = gql`
  subscription liveConsumption($homeId: ID!) {
    liveMeasurement(homeId: $homeId) {
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
  }
`;

interface TibberConnectorOptions {
  token: string;
  homeId: string | string[];
  onData?: CorrectResponseCallback;
  onError?: ErrorCallback;
  ws?: WebSocket;
}

class TibberConnector {
  private homeId: string[];
  private onData: CorrectResponseCallback;
  private onError: ErrorCallback;
  private link: WebSocketLink;
  private client: ApolloClient<NormalizedCacheObject>;

  constructor(options: TibberConnectorOptions) {
    const { token, homeId, onData, ws, onError } = options;
    if (!token) {
      throw new Error("No token supplied");
    }
    if (!homeId) {
      throw new Error("No homeID supplied");
    }
    if (!onData) {
      throw new Error("No data callback function supplied");
    }

    this.onData = onData;

    // Fallback function if no callbacks defined.
    /* eslint-disable @typescript-eslint/indent, prettier/prettier */
    this.onError = onError
      ? onError
      : (error: Error) => {
          throw error;
        };
    /* eslint-enable @typescript-eslint/indent, prettier/prettier */

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
    };

    // Add websocket if defined (needed with node)
    if (ws) {
      linkOptions.webSocketImpl = ws;
    }

    // Create link
    this.link = new WebSocketLink(linkOptions);

    // Set up client
    this.client = new ApolloClient({
      link: this.link,
      cache: new InMemoryCache(),
    });
  }

  public start = (): void => {
    this.homeId.forEach((id) => {
      this.client
        .subscribe({ query: CONSUMPTION_QUERY, variables: { homeId: id } })
        .subscribe({
          next: (data: ApiResponse) => {
            if (!data.data || !data.data.liveMeasurement) {
              this.onError(Error("Malformed response"), id);
            } else {
              this.onData(data, id);
            }
          },
          error: (err: Error) => {
            this.onError(err, id);
          },
        });
    });
  };
}

module.exports = TibberConnector;
