import { parseDateTime } from "libraries/formDataHandling/functions";
import { TFields } from "libraries/formDataHandling/types";
import { CareFormFieldName } from "./careForm/types";

export const initialFields: TFields<CareFormFieldName> = {
  careDate: {
    value: parseDateTime(new Date().toISOString(), false),
    type: "date",
  },
  team: {
    value: [],
    type: "array",
  },
  observation: {
    value: "",
    type: "text",
  },
  plannedCare: {
    value: "",
    type: "number",
  },
  note: {
    value: "",
    type: "text",
  },
};
