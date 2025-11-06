import z from "zod";
import { ajustSchema } from "./consts";

export type AjustFormValues = z.infer<typeof ajustSchema>;

export type AjustProps = {
  loading?: boolean;
  ajustValues?: AjustFormValues;
  onSubmit: (values: AjustFormValues) => void;
};
