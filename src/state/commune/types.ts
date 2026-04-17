import { CommuneDTO } from "generated";
import { ApiResponse } from "state/types";

export type ICommuneState = {
  getCommunes: ApiResponse<Array<CommuneDTO>>;
  getCommuneById: ApiResponse<CommuneDTO>;
  createCommune: ApiResponse<CommuneDTO>;
  updateCommune: ApiResponse<CommuneDTO>;
  deleteCommune: ApiResponse<CommuneDTO>;
};
