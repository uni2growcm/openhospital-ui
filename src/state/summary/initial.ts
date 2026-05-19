import { ApiResponse } from "../types";
import {
  EncounterSummaryGroup,
  ISummaryByEncounterState,
  ISummaryState,
  SummaryDataType,
} from "./types";

export const initial: ISummaryState = {
  summaryApisCall: new ApiResponse({
    data: new Array<SummaryDataType>(),
    status: "IDLE",
  }),
};

export const initialByEncounter: ISummaryByEncounterState = {
  summaryApisCall: new ApiResponse({
    data: new Array<EncounterSummaryGroup>(),
    status: "IDLE",
  }),
};
