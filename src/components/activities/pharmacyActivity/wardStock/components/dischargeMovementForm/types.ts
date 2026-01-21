import { MedicalDTO, MovementWardDTO, WardDTO } from "generated";
export interface IWardDischargeFormProps {
  medical: MedicalDTO & {
    ward: WardDTO;
    inQuantity: number;
    outQuantity: number;
    wardTotalQuantity: number;
  };
  onCancel: () => void;
  onSubmit?: (values: MovementWardDTO) => void;
}

export type DestinationType = "patient" | "internal" | "ward";
