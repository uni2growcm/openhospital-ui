import { ConditioningDTO } from "generated";
import { parseDateTime } from "libraries/formDataHandling/functions";
import { TFields } from "libraries/formDataHandling/types";
import { ConditioningFormFieldName } from "./conditioningForm/types";
import { initialFields } from "./consts";

export const useFields = (conditioning?: ConditioningDTO) => {
  const fields: TFields<ConditioningFormFieldName> = {
    ...initialFields,
    aspiration: {
      value: conditioning?.aspiration ? "true" : "false",
      type: "boolean",
    },
    cpap: {
      value: conditioning?.cpap ? "true" : "false",
      type: "boolean",
    },
    mceDuree: {
      value: conditioning?.mceDuree?.toString() ?? "",
      type: "number",
    },
    ventilationDuree: {
      value: conditioning?.ventilationDuree?.toString() ?? "",
      type: "number",
    },
    oxygeneDebit: {
      value: conditioning?.oxygeneDebit?.toString() ?? "",
      type: "number",
    },
    sgVolume: {
      value: conditioning?.sgVolume?.toString() ?? "",
      type: "number",
    },
    diazepamDose: {
      value: conditioning?.diazepamDose?.toString() ?? "",
      type: "number",
    },
    bolusSsVolume: {
      value: conditioning?.bolusSsVolume?.toString() ?? "",
      type: "number",
    },
    sngNumero: {
      value: conditioning?.sngNumero ?? "",
      type: "text",
    },
    others: {
      value: conditioning?.others ?? "",
      type: "text",
    },
    date: {
      value: parseDateTime(conditioning?.date.toString()!, false),
      type: "date",
    },
  };

  return fields;
};
