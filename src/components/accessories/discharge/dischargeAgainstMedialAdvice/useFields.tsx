import { TFields } from "libraries/formDataHandling/types";
import { initialFields } from "./consts";
import { DischargeAgainstMedicalAdviceField } from "./types";

export const useFields = () => {
  const fields: TFields<DischargeAgainstMedicalAdviceField> = {
    ...initialFields
  };

  return fields;
};