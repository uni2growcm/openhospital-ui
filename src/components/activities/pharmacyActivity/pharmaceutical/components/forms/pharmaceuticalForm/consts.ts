import { MedicalDTO } from "generated";
import { z } from "zod";
import { TFormValues } from "./types";

export const MedicalDTOSchema = z.object({
  prodCode: z
    .number({ error: "pharmacy.form.errors.prodCodeRequired" })
    .positive("pharmacy.form.errors.prodCodeRequired"),
  type: z.string().trim().min(1, "pharmacy.form.errors.typeRequired"),
  description: z
    .string()
    .trim()
    .min(1, "pharmacy.form.errors.descriptionRequired"),
  pcsperpck: z.preprocess(
    (value) =>
      value === "" || value === null || value === undefined || value === 0
        ? 0
        : value,
    z
      .number({ error: "pharmacy.form.errors.pcsPerPackPositive" })
      .nonnegative("pharmacy.form.errors.pcsPerPackPositive")
      .optional()
  ),
  minqty: z.preprocess(
    (value) =>
      value === "" || value === null || value === undefined ? undefined : value,
    z
      .number({ error: "pharmacy.form.errors.minQtyNonNegative" })
      .nonnegative("pharmacy.form.errors.minQtyNonNegative")
      .optional()
  ),
  deleted: z.boolean().default(false),
  initialqty: z.number().default(0),
  inqty: z.number().default(0),
  outqty: z.number().default(0),
  ignoreSimilar: z.boolean().optional(),
  lock: z.number().optional(),
});

export function getInitialValues(from?: MedicalDTO): TFormValues {
  if (!from) {
    return {
      prodCode: 0,
      description: "",
      type: "",
      pcsperpck: 0,
      minqty: 0,
      deleted: true,
      initialqty: 0,
      inqty: 0,
      outqty: 0,
    } as TFormValues;
  }

  return {
    prodCode: +(from.prodCode || 0),
    description: from.description || "",
    type: from?.type?.code || "",
    initialqty: from.initialqty || 0,
    pcsperpck: from.pcsperpck || 0,
    inqty: from.inqty || 0,
    outqty: from.outqty || 0,
    minqty: from.minqty || 0,
    deleted: from.deleted === "N",
    lock: from.lock || 0,
  } as TFormValues;
}
