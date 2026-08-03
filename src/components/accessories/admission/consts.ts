import { parseDate } from "../../../libraries/formDataHandling/functions";
import { TFields } from "../../../libraries/formDataHandling/types";
import { AdmissionFormFieldName } from "./admissionForm/types";

export const initialFields: TFields<AdmissionFormFieldName> = {
  ward: {
    value: "",
    type: "text",
    options: [],
  },
  transUnit: {
    value: "10",
    type: "number",
  },
  fhu: {
    value: "",
    type: "text",
  },
  admDate: {
    value: parseDate(Date.now().toString()),
    type: "date",
  },
  admType: {
    value: "",
    type: "text",
    options: [],
  },
  anamnesis: {
    value: "",
    type: "text",
  },
  disDate: {
    value: "",
    type: "date",
  },
  disType: {
    value: "",
    type: "text",
  },
  bedDays: {
    value: "0",
    type: "number",
  },
  cliDiaryCharge: {
    value: "",
    type: "text",
  },
  imageryCharge: {
    value: "",
    type: "text",
  },
  preTreatment: {
    value: "",
    type: "text",
  },
  preAssessment: {
    value: "",
    type: "text",
  },
  entryReason: {
    value: "",
    type: "array",
  },
  alertReceived: {
    value: "",
    type: "boolean",
  },
  referenceSheet: {
    value: "",
    type: "boolean",
  },
  qualifiedAgent: {
    value: "",
    type: "boolean",
  },
  transportation: {
    value: "",
    type: "text",
  },
  physicalExam: {
    value: "",
    type: "text",
  },
  courseOfAction: {
    value: "",
    type: "text",
  },
  nextAppointment: {
    value: "",
    type: "date",
  },
  referralAlert: {
    value: "",
    type: "text",
  },
  referralReason: {
    value: "",
    type: "text",
  },
  treatmentReceived: {
    value: "",
    type: "text",
  },
  outcome: {
    value: "",
    type: "text",
  },
  improvementFeedback: {
    value: "",
    type: "text",
  },
  diagnosisIn: {
    value: [],
    type: "array",
  },
  diagnosisOut: {
    value: [],
    type: "array",
  },
  complication: {
    value: "",
    type: "text",
  },
  othersInformation: {
    value: "",
    type: "text",
  },
  note: {
    value: "",
    type: "text",
  },
};
