import { ApiResponse } from "../types";

export type SummaryDataType = {
  date: string;
  type: string;
  [key: string]: any;
};

export type EncounterSummaryGroup = {
  encounter: any;
  summaryData: SummaryDataType[];
};

export type ISummaryState = {
  summaryApisCall: ApiResponse<Array<SummaryDataType>>;
};

export type ISummaryByEncounterState = {
  summaryApisCall: ApiResponse<Array<EncounterSummaryGroup>>;
};
