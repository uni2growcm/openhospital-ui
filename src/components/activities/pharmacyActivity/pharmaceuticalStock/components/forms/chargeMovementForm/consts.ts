import { MovementDTO } from "generated";
import { z } from "zod";
import { LotDTOSchema } from "../lotFormField";
import { TFormValues } from "./types";

export const MovementDTOSchema = z.object({
  code: z.number().optional(),
  medical: z.number(),
  type: z.string().optional(),
  ward: z.string().optional(),
  lot: LotDTOSchema,
  date: z.date(),
  supplier: z.number().optional(),
  refNo: z.string(),
  quantity: z.number()
});

export function getInitialValues(from?: MovementDTO): Partial<TFormValues> {
  return {
    code: from?.code,
    medical: from?.medical.code,
    type: from?.type?.code,
    ward: from?.ward?.code,
    lot: from?.lot
      ? {
          ...from.lot,
          preparationDate: new Date(from.lot.preparationDate),
          dueDate: new Date(from.lot.dueDate),
        }
      : undefined,
    date: from?.date ? new Date(from.date) : new Date(),
    supplier: from?.supplier?.supId,
    refNo: from?.refNo,
    quantity: from?.quantity,
  };
}
