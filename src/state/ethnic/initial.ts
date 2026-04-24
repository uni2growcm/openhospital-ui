import { EthnicDTO } from "generated";
import { ApiResponse } from "state/types";
import { IEthnicState } from "./types";

export const initial: IEthnicState = {
  ethnicList: new ApiResponse({ status: "IDLE", data: new Array<EthnicDTO>() }),
  getById: new ApiResponse({ status: "IDLE" }),
  create: new ApiResponse({ status: "IDLE" }),
  update: new ApiResponse({ status: "IDLE" }),
  delete: new ApiResponse({ status: "IDLE" }),
};