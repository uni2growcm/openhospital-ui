import { ApiResponse } from "state/types";
import { IOccupationState } from "./types";
import { OccupationDTO } from "generated";

export const initial: IOccupationState = {
  occupationList: new ApiResponse({ status: "IDLE", data: new Array<OccupationDTO>() }),
  getById: new ApiResponse({ status: "IDLE" }),
  create: new ApiResponse({ status: "IDLE" }),
  update: new ApiResponse({ status: "IDLE" }),
  delete: new ApiResponse({ status: "IDLE" }),
};