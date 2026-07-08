import { CareDTO } from "generated";
import { parseDateTime } from "libraries/formDataHandling/functions";
import { TFields } from "libraries/formDataHandling/types";
import { CareFormFieldName } from "./careForm/types";
import { initialFields } from "./consts";

export const useFields = (care?: CareDTO) => {
  const fields: TFields<CareFormFieldName> = {
    ...initialFields,
    plannedCare: {
      value: care?.plannedCare ?? "",
      type: "text",
    },
    careDate: {
      value: parseDateTime(care?.careDate?.toString()!, false),
      type: "date",
    },
    observation: {
      value: care?.observation ? "true" : "false",
      type: "boolean",
    },
    note: {
      value: care?.note ?? "",
      type: "text",
    },
    team: {
      value: care?.team ?? [],
      type: "array",
    },
  };

  return fields;
};
