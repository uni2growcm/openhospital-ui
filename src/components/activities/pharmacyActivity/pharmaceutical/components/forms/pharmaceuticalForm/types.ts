import { z } from "zod";
import { MedicalDTO } from "~/generated";
import { MedicalDTOSchema } from "./consts";

export type TFormValues = z.infer<typeof MedicalDTOSchema>;

export type PharmaceuticalFormProps = {
  onSubmit: (values: MedicalDTO) => void;
  loading?: boolean;
  pharmaceutical?: MedicalDTO;
};
