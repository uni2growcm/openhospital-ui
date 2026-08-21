import { MovementDTO } from "generated";
import { z } from "zod";
import { LotDTOSchema } from "../lotFormField";
import { TFormValues } from "./types";

export const MovementDTOSchema = z.object({
  code: z.number().optional(),
  medical: z.preprocess(
    (value) =>
      value === "" || value === null || value === undefined
        ? undefined
        : Number(value),
    z.number({ error: "pharmacy.validation.medicalRequired" })
  ),
  type: z.string().optional(),
  ward: z.string().optional(),
  lot: LotDTOSchema.optional().refine(
    (lot) => !!lot,
    "pharmacy.validation.lotRequired"
  ),
  date: z.date(),
  supplier: z.preprocess(
    (value) =>
      value === "" || value === null || value === undefined
        ? undefined
        : Number(value),
    z.number({ error: "pharmacy.validation.supplierRequired" })
  ),
  refNo: z
    .string({ error: "pharmacy.validation.referenceRequired" })
    .trim()
    .min(1, "pharmacy.validation.referenceRequired"),
  quantity: z.preprocess(
    (value) =>
      value === "" || value === null || value === undefined
        ? undefined
        : Number(value),
    z
      .number({ error: "pharmacy.validation.quantityRequired" })
      .positive("pharmacy.validation.quantityPositive")
  ),
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
          cost: from.lot.cost ?? 0,
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
