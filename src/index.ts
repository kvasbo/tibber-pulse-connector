import { WebSocketLink } from "apollo-link-ws";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import gql from "graphql-tag";
import axios from "axios";
import {
  ApiResponse,
  ErrorCallback,
  CorrectResponseCallback,
  PowerPrice,
  Consumption,
} from "./types";

const ENDPOINT = `wss://api.tibber.com/v1-beta/gql/subscriptions`;
const ENDPOINT_REST = `https://api.tibber.com/v1-beta/gql`;

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
  private token: string;

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

    this.token = token;
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

  public getPowerPrices = async (homeId: string): Promise<PowerPrice[]> => {
    const queryPrices = `
    {
      viewer {
        home(id: "${homeId}") {
          currentSubscription {
            priceInfo {
              today {
                total
                energy
                tax
                startsAt
              }
            }
          }
        }
      }
    }
`;

    const data = await this.getRestData(queryPrices);

    if (data.status === 200) {
      // Parse power prices
      const prices =
        data.data.data.viewer.home.currentSubscription.priceInfo.today;
      const powerPrices: PowerPrice[] = [];
      prices.forEach((p: PowerPrice) => {
        powerPrices.push(p);
      });
      return powerPrices;
    } else {
      throw new Error("Failed to get data from tibber");
    }
  };

  public getConsumption = async (
    homeId: string,
    count = 24,
    resolution = "HOURLY"
  ): Promise<Consumption[]> => {
    const queryUsage = `
    {
      viewer {
        home(id: "${homeId}") {
          consumption(resolution: ${resolution.toUpperCase()}, last: ${count}) {
            nodes {
              from
              to
              cost
              unitPrice
              unitPriceVAT
              consumption
              consumptionUnit
            }
          }
        }
      }
    }
`;

    const data = await this.getRestData(queryUsage);
    if (data.status === 200) {
      return data.data.data.viewer.home.consumption.nodes as Consumption[];
    }
    return [];
  };

  private getRestData = async (query: string) => {
    const data = await axios({
      url: ENDPOINT_REST,
      method: "post",
      headers: {
        Authorization: `bearer ${this.token}`,
      },
      data: {
        query,
      },
    });
    return data;
  };

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
