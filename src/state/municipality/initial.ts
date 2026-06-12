import { MunicipalityDTO } from "generated";
import { ApiResponse } from "state/types";
import { IMunicipalityState } from "./types";

export const initial: IMunicipalityState = {
  getMunicipalities: new ApiResponse({
    status: "IDLE",
    data: new Array<MunicipalityDTO>(),
  }),
  getMunicipalityById: new ApiResponse({ status: "IDLE" }),
  createMunicipality: new ApiResponse({ status: "IDLE" }),
  updateMunicipality: new ApiResponse({ status: "IDLE" }),
  deleteMunicipality: new ApiResponse({ status: "IDLE" }),
};
