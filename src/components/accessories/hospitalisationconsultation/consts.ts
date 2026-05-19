import { parseDateTime } from "libraries/formDataHandling/functions";
import { TFields } from "libraries/formDataHandling/types";
import { HospitalisationconsultationFormFieldName } from "./hospitalisationconsultationForm/types";

export const initialFields: TFields<HospitalisationconsultationFormFieldName> = {
  consultationDate: {
    value: parseDateTime(new Date().toISOString(), false),
    type: "date",
  },
  teams: {
    value: "",
    type: "text",
  },
  parentComplaints: {
    value: "",
    type: "text",
  },
  physicalExamination: {
    value: "",
    type: "text",
  },
  diagnosis: {
    value: "",
    type: "text",
  },
  instructions: {
    value: "",
    type: "text",
  },
};