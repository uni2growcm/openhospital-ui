import { HospitalizationConsultationDTO } from "../../../../generated";
import { TFields } from "libraries/formDataHandling/types";

export type HospitalisationconsultationFormFieldName =
  | "consultationDate"
  | "teams"
  | "parentComplaints"
  | "physicalExamination"
  | "diagnosis"
  | "managementPlan";

export interface HospitalisationconsultationFormProps {
  fields: TFields<HospitalisationconsultationFormFieldName>;
  onSubmit: (values: HospitalizationConsultationDTO) => void;
  creationMode?: boolean;
  submitButtonLabel: string;
  resetButtonLabel: string;
  isLoading?: boolean;
  shouldResetForm?: boolean;
  resetFormCallback?: () => void;
}