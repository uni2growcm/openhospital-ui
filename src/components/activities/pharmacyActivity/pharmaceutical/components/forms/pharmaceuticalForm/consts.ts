import { MedicalDTO } from "generated";
import { z } from "zod";
import { TFormValues } from "./types";

export const MedicalDTOSchema = z.object({
  prodCode: z.string().min(1, {
    message: "pharmacy.form.errors.prodCodeRequired",
  }),

  type: z.string().min(1, {
    message: "pharmacy.form.errors.typeRequired",
  }),

  description: z.string().min(1, {
    message: "pharmacy.form.errors.descriptionRequired",
  }),

  pcsperpck: z.coerce.number().min(1, {
    message: "pharmacy.form.errors.pcsPerPackRequired",
  }),

  minqty: z.coerce.number().min(0, {
    message: "pharmacy.form.errors.minQtyRequired",
  }),

  deleted: z.boolean().default(false),
  initialqty: z.number().default(0),
  inqty: z.number().default(0),
  outqty: z.number().default(0),
  ignoreSimilar: z.boolean().optional(),
  lock: z.number().optional(),
});

export function getInitialValues(from?: MedicalDTO): Partial<TFormValues> {
  if (!from) return {};

  return {
    prodCode: from.prodCode,
    description: from.description,
    type: from?.type?.code,
    initialqty: from.initialqty || 0,
    pcsperpck: from.pcsperpck || 0,
    inqty: from.inqty || 0,
    outqty: from.outqty || 0,
    minqty: from.minqty || 0,
    deleted: from.deleted === "N",
    lock: from.lock || 0,
  };
}
