import { ApiResponse } from "../types";
import { ICaresState } from "./types";

export const initial: ICaresState = {
  newCare: new ApiResponse({ status: "IDLE" }),
  updateCare: new ApiResponse({ status: "IDLE" }),
  getCareByPatientCode: new ApiResponse({ status: "IDLE", data: [] }),
};
