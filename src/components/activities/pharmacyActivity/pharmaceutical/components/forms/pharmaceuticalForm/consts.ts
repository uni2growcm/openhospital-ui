import { MedicalDTO } from "generated";
import { z } from "zod";
import { TFormValues } from "./types";

export const MedicalDTOSchema = z.object({
  prod_code: z.string({
    error: "code is required",
  }),
  type: z.string(),
  description: z.string({
    error: "description is required",
  }),
  pcsperpck: z.number({
    error: "pieces per packet is required",
  }),
  minqty: z.number({
    error: "critical level is required",
  }),
  initialqty: z.number().default(0),
  inqty: z.number().default(0),
  outqty: z.number().default(0),
  ignoreSimilar: z.boolean().optional(),
});

export function getInitialValues(from?: MedicalDTO): Partial<TFormValues> {
  if (!from) return {};

  return {
    prod_code: from.prod_code,
    description: from.description,
    type: from?.type?.code,
    initialqty: from.initialqty || 0,
    pcsperpck: from.pcsperpck || 0,
    inqty: from.inqty || 0,
    outqty: from.outqty || 0,
    minqty: from.minqty || 0,
  };
}
