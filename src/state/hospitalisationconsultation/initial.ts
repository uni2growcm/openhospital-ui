import { ApiResponse } from "../types";
import { IHospitalisationconsultationState } from "./types";

export const initial: IHospitalisationconsultationState = {
  newHospitalizationConsultation: new ApiResponse({ status: "IDLE" }),
  updateHospitalizationConsultation: new ApiResponse({ status: "IDLE" }),
  deleteHospitalizationConsultation: new ApiResponse({ status: "IDLE" }),
  getHospitalizationConsultation: new ApiResponse({ status: "IDLE" }),
  getHospitalizationConsultations: new ApiResponse({ status: "IDLE", data: [] }),
  getHospitalizationConsultationsByDateRange: new ApiResponse({ status: "IDLE", data: [] }),
  getHospitalizationConsultationsByDateRangePageable: new ApiResponse({ status: "IDLE" }),
  getHospitalizationConsultationsByEncounter: new ApiResponse({ status: "IDLE", data: [] }),
  getHospitalizationConsultationsByEncounterPageable: new ApiResponse({ status: "IDLE" }),
  getHospitalizationConsultationsPageable: new ApiResponse({ status: "IDLE" }),
};
