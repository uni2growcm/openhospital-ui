import { TFields } from "libraries/formDataHandling/types";
import { DischargeAgainstMedicalAdviceField } from "./types";
import { parseDateTime } from "libraries/formDataHandling/functions";

export const initialFields: TFields<DischargeAgainstMedicalAdviceField> = {
  madeOnDate: {
    value: parseDateTime(Date.now().toString(), false),
    type: "date",
  },
  commune: {
    value: "",
    type: "text",
  },
  name: {
    value: "",
    type: "text",
  },
  district: {
    value: "",
    type: "text",
  },
  phone: {
    value: "",
    type: "text",
  },
  occupation: {
    value: "",
    type: "text",
  },
  localisation: {
    value: "",
    type: "text",
  },
  reference: {
    value: "",
    type: "text",
  },
  relationshipType: {
    value: "",
    type: "text",
  },
  hospitalisationDate: {
    value: parseDateTime(Date.now().toString(), false),
    type: "date",
  },
};
