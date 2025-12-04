import { MedicalDTO, WardDTO } from "generated";
import { z } from "zod";

export const MovementWardDTOSchema = z.object({
  code: z.number().optional(),
  ward: z.object({ code: z.string() }).optional(),
  date: z.date(),
  isPatient: z.boolean(),
  patient: z.any().optional(),
  age: z.number().optional(),
  weight: z.number().optional(),
  description: z.string().optional(),
  medical: z.any(),
  quantity: z
    .number()
    .min(0, { message: "pharmacy.stock.ward.quantityGreaterThanZero" }),
  units: z.string().optional(),
  wardTo: z.object({ code: z.string() }).optional(),
  wardFrom: z.object({ code: z.string() }).optional(),
  lot: z.any().optional(),
});

export function getInitialValues(
  medical?: MedicalDTO,
  ward?: WardDTO
): Partial<z.infer<typeof MovementWardDTOSchema>> {
  return {
    code: undefined,
    ward: ward ? { code: ward.code ?? "" } : undefined,
    date: new Date(),
    isPatient: true,
    patient: undefined,
    age: undefined,
    weight: undefined,
    description: "Ward medical discharge",
    medical: medical,
    quantity: 0,
    units: medical?.prod_code ?? "",
    wardTo: undefined,
    wardFrom: ward ? { code: ward.code ?? "" } : undefined,
    lot: undefined,
  };
}
