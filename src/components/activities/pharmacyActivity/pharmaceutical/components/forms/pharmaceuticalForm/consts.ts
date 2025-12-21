import { MedicalDTO } from "generated";
import { z } from "zod";
import { TFormValues } from "./types";

export type MedicalErrorKey =
  | "pharmacy.form.errors.prodCodeRequired"
  | "pharmacy.form.errors.typeRequired"
  | "pharmacy.form.errors.descriptionRequired"
  | "pharmacy.form.errors.pcsperpckRequired"
  | "pharmacy.form.errors.minqtyRequired";

const BaseMedicalDTOSchema = z.object({
  code: z.number().optional(),
  lock: z.number().optional(),
  prod_code: z.string(),
  type: z.string(),
  description: z.string(),
  pcsperpck: z.number(),
  minqty: z.number(),
  deleted: z.boolean().default(false),
  ignoreSimilar: z.boolean().optional(),
});
export const MedicalDTOSchema = z.object({
  code: z.number().optional(),
  lock: z.number().optional(),

  prod_code: z
    .string()
    .min(1, { message: "pharmacy.form.errors.prodCodeRequired" }),
  type: z.string().refine((v) => v && v.trim().length > 0, {
    message: "pharmacy.form.errors.typeRequired",
  }),
  description: z
    .string()
    .min(1, { message: "pharmacy.form.errors.descriptionRequired" }),
  pcsperpck: z.number().refine((v) => v !== undefined && v > 0, {
    message: "pharmacy.form.errors.pcsperpckRequired",
  }),
  minqty: z.number().refine((v) => v !== undefined && v >= 0, {
    message: "pharmacy.form.errors.minqtyRequired",
  }),
  deleted: z.boolean().default(false),
  ignoreSimilar: z.boolean().optional(),
});

export function getInitialValues(from?: MedicalDTO): Partial<TFormValues> {
  if (!from) return {};

  return {
    code: from.code,
    lock: from.lock,
    prod_code: from.prodCode ?? "",
    description: from.description ?? "",
    type: from.type?.code ?? "",
    pcsperpck: from.pcsperpck ?? 0,
    minqty: from.minqty ?? 0,
    deleted: from.deleted === "Y",
  };
}
