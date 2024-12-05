import { ApiResponse } from "../types";
import { IHospitalState } from "./types";

export const initial: IHospitalState = {
  studies: new ApiResponse({ status: "IDLE", data: [] }),
  series: new ApiResponse({ status: "IDLE", data: [] }),
  instances: new ApiResponse({ status: "IDLE", data: [] }),
};
