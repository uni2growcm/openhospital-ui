import { HospitalizationConsultationDTO, PageHospitalizationConsultationDTO } from "../../generated";
import { ApiResponse } from "../types";

export type IHospitalisationconsultationState = {
  newHospitalizationConsultation: ApiResponse<HospitalizationConsultationDTO>;
  updateHospitalizationConsultation: ApiResponse<HospitalizationConsultationDTO>;
  deleteHospitalizationConsultation: ApiResponse<void>;
  getHospitalizationConsultation: ApiResponse<HospitalizationConsultationDTO>;
  getHospitalizationConsultations: ApiResponse<Array<HospitalizationConsultationDTO>>;
  getHospitalizationConsultationsByDateRange: ApiResponse<Array<HospitalizationConsultationDTO>>;
  getHospitalizationConsultationsByDateRangePageable: ApiResponse<PageHospitalizationConsultationDTO>;
  getHospitalizationConsultationsByEncounter: ApiResponse<Array<HospitalizationConsultationDTO>>;
  getHospitalizationConsultationsByEncounterPageable: ApiResponse<PageHospitalizationConsultationDTO>;
  getHospitalizationConsultationsPageable: ApiResponse<PageHospitalizationConsultationDTO>;
};
