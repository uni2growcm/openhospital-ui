import { parseDateTime } from "libraries/formDataHandling/functions";
import { TFields } from "../../../libraries/formDataHandling/types";
import { DischargeFormFieldName } from "./dischargeForm/types";

export const initialFields: TFields<DischargeFormFieldName> = {
  disDate: {
    value: parseDateTime(Date.now().toString(), false),
    type: "date",
  },
  disType: {
    value: "",
    type: "text",
    options: [],
  },
  bedDays: {
    value: "0",
    type: "number",
  },
  diagnosisIn: {
    value: [],
    type: "array",
    options: [],
  },
  complication: {
    value: "",
    type: "text",
  },
  diagnosisOut: {
    value: [],
    type: "array",
    options: [],
  },
  anamnesis: {
    value: "",
    type: "text",
  },
  othersInformation: {
    value: "",
    type: "text",
  },
  nextAppointment: {
    value: parseDateTime(Date.now().toString(), false),
    type: "date",
  },
  deathPeriod: {
    value: "",
    type: "text",
  },
};
