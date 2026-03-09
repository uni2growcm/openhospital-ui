import { ApiResponse } from "state/types";
import { CommuneDTO } from "generated";
import { ICommuneState } from "./types";

export const initial: ICommuneState = {
  communeList: new ApiResponse({ status: "IDLE", data: new Array<CommuneDTO>() }),
  getById: new ApiResponse({ status: "IDLE" }),
  create: new ApiResponse({ status: "IDLE" }),
  update: new ApiResponse({ status: "IDLE" }),
  delete: new ApiResponse({ status: "IDLE" }),
};