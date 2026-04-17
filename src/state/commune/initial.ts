import { CommuneDTO } from "generated";
import { ApiResponse } from "state/types";
import { ICommuneState } from "./types";

export const initial: ICommuneState = {
  getCommunes: new ApiResponse({
    status: "IDLE",
    data: new Array<CommuneDTO>(),
  }),
  getCommuneById: new ApiResponse({ status: "IDLE" }),
  createCommune: new ApiResponse({ status: "IDLE" }),
  updateCommune: new ApiResponse({ status: "IDLE" }),
  deleteCommune: new ApiResponse({ status: "IDLE" }),
};
