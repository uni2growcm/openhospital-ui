import { MedicalDTO, MedicalWardDTO, MovementWardDTO, WardDTO } from "generated";
import { z } from "zod";
import { MovementWardDTOSchema } from "./const";

export type TFormValues = z.infer<typeof MovementWardDTOSchema>;

export interface IWardDischargeFormProps {
  wardMedical:MedicalWardDTO;
  onCancel: () => void;
  onSubmit?: (values: MovementWardDTO) => void;
}

export type DestinationType = "patient" | "internal" | "ward";
