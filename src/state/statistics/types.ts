import { ApiResponse } from "../types";

export type IAdmissionsState = {
  printAdmissionReport: ApiResponse<Blob>;
  printDeathReport: ApiResponse<Blob>;
  printDischargeReport: ApiResponse<Blob>;
  printPathologiesReport: ApiResponse<Blob>;
  printPathologyByAgeGenderReport: ApiResponse<Blob>;
};
