import { AdmissionDTO } from "../../../generated";
import {
  differenceInDays,
  parseDateTime,
} from "../../../libraries/formDataHandling/functions";
import { TFields } from "../../../libraries/formDataHandling/types";
import { initialFields } from "./consts";
import { DischargeFormFieldName } from "./dischargeForm/types";

export const useFields = (admission?: AdmissionDTO) => {
  const complicationDiagnosisValue =
    admission?.complicationDiagnosis
      ?.map((diagnosis) => diagnosis?.code?.toString())
      .filter((code): code is string => !!code)
      .join(", ") ?? "";

  const fields: TFields<DischargeFormFieldName> = {
    ...initialFields,
    complicationDiagnosis: {
      value: complicationDiagnosisValue,
      type: "text",
    },
    diseaseOut2: {
      value: admission?.diseaseOut2?.code?.toString() ?? "",
      type: "text",
    },
    diseaseOut3: {
      value: admission?.diseaseOut3?.code?.toString() ?? "",
      type: "text",
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
