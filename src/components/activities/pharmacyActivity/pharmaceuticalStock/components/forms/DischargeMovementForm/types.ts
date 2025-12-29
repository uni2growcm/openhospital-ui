import {
  MedicalWardDTO,
  MovementDTO,
  MovementWardDTO,
  WardDTO,
} from "generated";
import { Control } from "react-hook-form";
import z from "zod";
import { MovementDTOSchema } from "./consts";

export type TFormValues = z.infer<typeof MovementDTOSchema>;

export type DisChargeMovementProps = {
  loading?: boolean;
  movement?: MovementDTO;
  onSubmit: (values: MovementDTO[]) => void;
  onCancel: () => void;
};

export type DischargeLotFormFieldProps = {
  wards: WardDTO[];
  control: Control<TFormValues>;
};

export interface IWardDischargeFormProps {
  destinationType: MedicalWardDTO;
  onCancel: () => void;
  onSubmit?: (values: MovementWardDTO) => void;
}
