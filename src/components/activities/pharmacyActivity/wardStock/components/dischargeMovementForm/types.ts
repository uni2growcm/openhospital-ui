import { MedicalWardDTO, MovementWardDTO } from "generated";
export interface IWardDischargeFormProps {
  wardMedical:MedicalWardDTO;
  onCancel: () => void;
  onSubmit?: (values: MovementWardDTO) => void;
}

export type DestinationType = "patient" | "internal" | "ward";
