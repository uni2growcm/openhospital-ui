import { MedicalDTO } from "generated";
import { z } from "zod";
import { TFormValues } from "./types";

export const MedicalDTOSchema = z.object({
  prodCode: z.number({
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
