import { MovementDTO } from "generated";
import z from "zod";
import { getAdjustQuantitySchema } from "./consts";

export type TFormValues = z.infer<ReturnType<typeof getAdjustQuantitySchema>>;

export type AdjustQuantityFormProps = {
  loading?: boolean;
  movement?: MovementDTO;
  onSubmit: (values: { movement: MovementDTO; newQuantity: number }) => void;
  onCancel: () => void;
};
