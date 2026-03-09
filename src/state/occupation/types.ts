import { OccupationDTO } from "generated";
import { ApiResponse } from "state/types";

export type IOccupationState = {
  occupationList: ApiResponse<Array<OccupationDTO>>;
  getById: ApiResponse<OccupationDTO>;
  create: ApiResponse<OccupationDTO>;
  update: ApiResponse<OccupationDTO>;
  delete: ApiResponse<OccupationDTO>;
};