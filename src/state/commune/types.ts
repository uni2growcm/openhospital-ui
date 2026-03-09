import { CommuneDTO } from "generated";
import { ApiResponse } from "state/types";

export type ICommuneState = {
  communeList: ApiResponse<Array<CommuneDTO>>;
  getById: ApiResponse<CommuneDTO>;
  create: ApiResponse<CommuneDTO>;
  update: ApiResponse<CommuneDTO>;
  delete: ApiResponse<CommuneDTO>;
};