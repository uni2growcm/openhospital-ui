import { MedicalDTO } from "generated";
import { z } from "zod";
import { TFormValues } from "./types";

export const LotDTOSchema = z
  .object({
    code: z.string(),
    preparationDate: z.date(),
    dueDate: z.date(),
    cost: z.number().nullish(),
    ward: z.string().optional(),
    quantity: z.number().optional(),
    mainStoreQuantity: z.number().optional(),
    wardsTotalQuantity: z.number().optional(),
    overallQuantity: z.number().optional(),
  })
  .superRefine((lot, ctx) => {
    const hasWard = !!lot.ward;
    const hasQuantity =
      lot.quantity !== undefined && lot.quantity !== null && lot.quantity > 0;
    if (hasWard && !hasQuantity) {
      ctx.addIssue({
        code: "custom",
        path: ["quantity"],
        message: "pharmacy.validation.quantityRequired",
      });
    }
    if (!hasWard && hasQuantity) {
      ctx.addIssue({
        code: "custom",
        path: ["ward"],
        message: "pharmacy.validation.wardRequired",
      });
    }
    if (!hasWard && !hasQuantity) {
      ctx.addIssue({
        code: "custom",
        path: ["ward"],
        message: "pharmacy.validation.wardRequired",
      });
      ctx.addIssue({
        code: "custom",
        path: ["quantity"],
        message: "pharmacy.validation.quantityRequired",
      });
    }
    if (lot.quantity && lot.quantity > (lot.mainStoreQuantity ?? 0)) {
      ctx.addIssue({
        code: "custom",
        path: ["quantity"],
        message: "pharmacy.validation.quantityExceedsStock",
      });
    }
  });

export const MovementDTOSchema = z
  .object({
    code: z.number().nullish(),
    medical: z.preprocess(
      (value) =>
        value === "" || value === null || value === undefined
          ? undefined
          : Number(value),
      z.number({ message: "pharmacy.validation.medicalRequired" })
    ),
    type: z.string(),
    ward: z.string().nullish(),
    lots: z.array(LotDTOSchema).nullish(),
    date: z.date(),
    quantity: z.number().nullish(),
    supplier: z.number().nullish(),
    refNo: z.string().trim().min(1, "pharmacy.validation.referenceRequired"),
  })
  .superRefine((movement, ctx) => {
    const hasMovement =
      movement.lots?.some(
        (lot) => !!lot.ward && lot.quantity !== undefined && lot.quantity > 0
      ) ?? false;

    if (!hasMovement && (!movement.lots || movement.lots.length === 0)) {
      ctx.addIssue({
        code: "custom",
        path: ["lots"],
        message: "pharmacy.validation.movementDetailsRequired",
      });
    }
  });

export function getInitialValues(from?: MedicalDTO): Partial<TFormValues> {
  return {
    code: from?.code,
    medical: from?.code,
    type: from?.type?.code,
    lots:
      from?.lots?.map((lot) => ({
        code: lot.code,
        preparationDate: new Date(lot.preparationDate),
        dueDate: new Date(lot.dueDate),
        cost: lot.cost,
        ward: "",
        quantity: 0,
        mainStoreQuantity: lot.mainStoreQuantity,
      })) ?? [],
  };
}
