import { z } from "zod";

export const LotDTOSchema = z.object({
  code: z
    .string({ error: "pharmacy.validation.lotCodeRequired" })
    .min(1, "pharmacy.validation.lotCodeRequired"),
  preparationDate: z.date({
    error: "pharmacy.validation.lotPreparationDateRequired",
  }),
  dueDate: z.date({ error: "pharmacy.validation.lotDueDateRequired" }),
  cost: z.number().optional(),
  ward: z.string().optional(),
  mainStoreQuantity: z.number().optional(),
  wardsTotalQuantity: z.number().optional(),
  overallQuantity: z.number().optional(),
});
