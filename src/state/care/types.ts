import { CareDTO } from "../../generated";
import { ApiResponse } from "../types";

export type ICaresState = {
  newCare: ApiResponse<CareDTO>;
  updateCare: ApiResponse<CareDTO>;
  getCareByPatientCode: ApiResponse<Array<CareDTO>>;
};
