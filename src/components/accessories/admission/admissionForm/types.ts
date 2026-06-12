import { AdmissionDTO } from "../../../../generated";
import { TFields } from "../../../../libraries/formDataHandling/types";

interface IAdmissionProps {
  fields: TFields<AdmissionFormFieldName>;
  onSubmit: (adm: AdmissionDTO) => void;
  creationMode: boolean;
  submitButtonLabel: string;
  resetButtonLabel: string;
  isLoading: boolean;
  admitted: boolean;
  shouldResetForm: boolean;
  resetFormCallback: () => void;
  onPrint?: (adm: AdmissionDTO | undefined) => void;
  admissionToEdit?: AdmissionDTO;
}

export type AdmissionProps = IAdmissionProps;

export type AdmissionFormFieldName =
  | "ward"
  | "transUnit"
  | "admDate"
  | "admType"
  | "diseaseIn"
  | "fhu"
  | "anamnesis"
  | "disDate"
  | "disType"
  | "bedDays"
  | "cliDiaryCharge"
  | "imageryCharge"
  | "preTreatment"
  | "preAssessment"
  | "entryReason"
  | "alertReceived"
  | "referenceSheet"
  | "qualifiedAgent"
  | "transportation"
  | "referralAlert"
  | "referralReason"
  | "treatmentReceived"
  | "outcome"
  | "improvementFeedback"
  | "physicalExam"
  | "courseOfAction"
  | "nextAppointment"
  | "diagnosisIn"
  | "diagnosisOut"
  | "complicationDiagnosis"
  | "othersInformation";
