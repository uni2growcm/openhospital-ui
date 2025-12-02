import { MedicalDTO, MovementWardDTO, WardDTO } from "generated";
import { z } from "zod";
import { MovementWardDTOSchema } from "./const";

export type TFormValues = z.infer<typeof MovementWardDTOSchema>;

export interface IWardDischargeFormProps {
  movement: { medical: MedicalDTO; ward: WardDTO; quantity: number } | null;
  onCancel: () => void;
  onSubmit?: (values: MovementWardDTO) => void;
}

export type DestinationType = "patient" | "internal" | "ward";
