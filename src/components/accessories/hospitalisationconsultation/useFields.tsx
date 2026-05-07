import { HospitalizationConsultationDTO } from "generated";
import { parseDateTime } from "libraries/formDataHandling/functions";
import { TFields } from "libraries/formDataHandling/types";
import { HospitalisationconsultationFormFieldName } from "./hospitalisationconsultationForm/types";
import { initialFields } from "./consts";

export const useFields = (consultation?: HospitalizationConsultationDTO) => {
  const fields: TFields<HospitalisationconsultationFormFieldName> = {
    ...initialFields,
    dateTime: {
      value: parseDateTime(consultation?.dateTime?.toString()!, false),
      type: "date",
    },
    teams: {
      value: consultation?.teams ?? "",
      type: "text",
    },
    parentComplaints: {
      value: consultation?.parentComplaints ?? "",
      type: "text",
    },
    physicalExamination: {
      value: consultation?.physicalExamination ?? "",
      type: "text",
    },
    diagnosis: {
      value: consultation?.diagnosis ?? "",
      type: "text",
    },
    managementPlan: {
      value: consultation?.managementPlan ?? "",
      type: "text",
    },
  };

  return fields;
};