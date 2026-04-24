import { TFields } from "libraries/formDataHandling/types";
import { CareDTO } from "../../../../generated";

interface ICareFormProps {
  fields: TFields<CareFormFieldName>;
  onSubmit: (care: CareDTO) => void;
  creationMode: boolean;
  submitButtonLabel: string;
  resetButtonLabel: string;
  isLoading: boolean;
  shouldResetForm: boolean;
  resetFormCallback: () => void;
}

export type CareFormProps = ICareFormProps;

export type userOption = {
  value: string;
  label: string;
};

export type CareFormFieldName =
  | "careDate"
  | "observation"
  | "team"
  | "note"
  | "plannedCare";
