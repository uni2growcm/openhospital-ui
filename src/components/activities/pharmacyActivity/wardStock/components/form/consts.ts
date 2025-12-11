import { MedicalWardDTO } from "generated";
import { z } from "zod";
import { TFormValues } from "./types";

export const MedicalWardDTOSchema = z.object({
  medical: z.number().nullish(),
  ward: z.string().nullish(),
  lot: z.string().optional(),
  actualQuantity: z.number(),
  quantity: z.number().min(0),
  reason: z.string().optional(),
});

export function getInitialValues(from?: MedicalWardDTO): Partial<TFormValues> {
  if (!from) return {};
  const actualQuantity = (from.in_quantity ?? 0) - (from.out_quantity ?? 0);
  return {
    actualQuantity,
    quantity: actualQuantity,
    medical: from.id!.medical?.code,
    ward: from.id!.ward?.code,
    lot: from.id!.lot?.code,
  };
}
