export interface ApiResponseData {
  timestamp: string;
  power: number;
  powerProduction: number;
  accumulatedConsumption: number;
  accumulatedProduction: number | null;
  accumulatedCost: number;
  accumulatedReward: number;
  currency: string;
  minPower: number;
  averagePower: number;
  maxPower: number;
  minPowerProduction: number;
  maxPowerProduction: number;
  lastMeterConsumption: number;
  lastMeterProduction: number | null;
  voltagePhase1: number | null;
  voltagePhase2: number | null;
  voltagePhase3: number | null;
  currentPhase1: number | null;
  currentPhase2: number | null;
  currentPhase3: number | null;
}

export interface ApiResponse {
  data: {
    liveMeasurement: ApiResponseData;
  };
}

export type CorrectResponseCallback = (
  data: ApiResponse,
  id: string
) => unknown;

export type ErrorCallback = (e: Error, id?: string) => unknown;
