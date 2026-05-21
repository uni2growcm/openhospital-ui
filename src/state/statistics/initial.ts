import { ApiResponse } from "../types";
import { IAdmissionsState } from "./types";

export const initial: IAdmissionsState = {
  printAdmissionReport: new ApiResponse({ status: "IDLE" }),
  printDeathReport: new ApiResponse({ status: "IDLE" }),
  printDischargeReport: new ApiResponse({ status: "IDLE" }),
  printPathologiesReport: new ApiResponse({ status: "IDLE" }),
  printPathologyByAgeGenderReport: new ApiResponse({ status: "IDLE" }),
};
