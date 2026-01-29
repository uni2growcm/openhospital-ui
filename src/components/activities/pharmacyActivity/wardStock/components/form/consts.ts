import { z } from "zod";
import { TFormValues } from "./types";

export type QuantityErrorKey =
  | "pharmacy.stock.ward.quantityGreaterThanZero"
  | "pharmacy.stock.ward.quantityMustBeDifferent";

export type ReasonErrorKey = "pharmacy.stock.ward.reasonRequired";

export type MedicalWardErrorKey = QuantityErrorKey | ReasonErrorKey;

const BaseMedicalWardDTOSchema = z.object({
  medical: z.string().nullish(),
  ward: z.string().nullish(),
  lot: z.string().optional(),

  actualQuantity: z.number(),

  quantity: z.number().min(0, {
    message: "pharmacy.stock.ward.quantityGreaterThanZero" as QuantityErrorKey,
  }),

  reason: z.string().optional(),
});

export type MedicalWardFormValues = z.infer<typeof BaseMedicalWardDTOSchema>;

export const MedicalWardDTOSchema = (() => {
  let schema = BaseMedicalWardDTOSchema.refine(
    (data) => data.quantity !== data.actualQuantity,
    {
      message:
        "pharmacy.stock.ward.quantityMustBeDifferent" as QuantityErrorKey,
      path: ["quantity"],
    }
  );

  schema = schema.refine(
    (data) =>
      data.quantity === data.actualQuantity ||
      (data.reason && data.reason.trim().length > 0),
    {
      message: "pharmacy.stock.ward.reasonRequired" as ReasonErrorKey,
      path: ["reason"],
    }
  );

  return schema;
})();

export function getInitialValues(from?: any): Partial<TFormValues> {
  if (!from) return {};

  return {
    actualQuantity: from.quantity ?? 0,
    quantity: 0,
    medical: `${from.code} - ${from.description}`,
    ward: from.wardCode,
    lot: from.lots?.[0]?.code,
    reason: "",
  };
}
