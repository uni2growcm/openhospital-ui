import { MunicipalityDTO } from "generated/models/MunicipalityDTO";
import { ApiResponse } from "state/types";

export type IMunicipalityState = {
  getMunicipalities: ApiResponse<Array<MunicipalityDTO>>;
  getMunicipalityById: ApiResponse<MunicipalityDTO>;
  createMunicipality: ApiResponse<MunicipalityDTO>;
  updateMunicipality: ApiResponse<MunicipalityDTO>;
  deleteMunicipality: ApiResponse<MunicipalityDTO>;
};
