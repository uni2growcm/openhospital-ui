import { TownDTO } from "../../generated";
import { ApiResponse } from "../types";
import { ITownState } from "./types";

export const initial: ITownState = {
  townList: new ApiResponse({ status: "IDLE", data: new Array<TownDTO>() }),
  getById: new ApiResponse({ status: "IDLE" }),
  create: new ApiResponse({ status: "IDLE" }),
  update: new ApiResponse({ status: "IDLE" }),
  delete: new ApiResponse({ status: "IDLE" }),
};