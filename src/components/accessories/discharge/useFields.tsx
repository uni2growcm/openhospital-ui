import { AdmissionDTO } from "../../../generated";
import {
  differenceInDays,
  parseDateTime,
} from "../../../libraries/formDataHandling/functions";
import { TFields } from "../../../libraries/formDataHandling/types";
import { initialFields } from "./consts";
import { DischargeFormFieldName } from "./dischargeForm/types";

export const useFields = (admission?: AdmissionDTO) => {
  const fields: TFields<DischargeFormFieldName> = {
    ...initialFields,
    diagnosisIn: {
      value: admission?.diagnosisIn?.map((d) => d.code?.toString() ?? "") ?? [],
      type: "array",
    },
    complication: {
      value: admission?.complication ?? "",
      type: "text",
    },
    diagnosisOut: {
      value:
        admission?.diagnosisOut?.map((d) => d.code?.toString() ?? "") ?? [],
      type: "array",
    },
    bedDays: {
      value: differenceInDays(
        new Date(admission?.admDate ?? ""),
        new Date()
      ).toString(),
      type: "number",
    },
    anamnesis: {
      value: admission?.anamnesis ?? "",
      type: "text",
    },
    othersInformation: {
      value: admission?.othersInformation ?? "",
      type: "text",
    },
    nextAppointment: {
      value: parseDateTime(admission?.nextAppointment ?? "", false),
      type: "date",
    },
    deathPeriod: {
      value: admission?.deathPeriod ?? "",
      type: "text",
    },
  };

  return fields;
};
