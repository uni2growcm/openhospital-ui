import { MedicalDTO, WardDTO } from "generated";
import { z } from "zod";
import { DestinationType } from "./types";

const BaseMovementWardDTOSchema = z.object({
  code: z.number().optional(),
  ward: z.object({ code: z.string() }).optional(),
  date: z.date(),
  isPatient: z.boolean(),
  patient: z.any().optional(),
  age: z.number().optional(),
  weight: z.number().optional(),
  description: z.string().optional(),
  medical: z.any(),
  quantity: z.number().min(0.00000001, {
    message: "pharmacy.stock.ward.quantityGreaterThanZero",
  }),
  units: z.string().optional(),
  wardTo: z.any().optional(),
  wardFrom: z.object({ code: z.string() }).optional(),
  lot: z.any().optional(),
});

export type TFormValues = z.infer<typeof BaseMovementWardDTOSchema>;

export function createMovementWardDTOSchema(
  totalStock: number,
  destinationType: DestinationType
) {
  let schema = BaseMovementWardDTOSchema.refine(
    (data) => data.quantity <= totalStock,
    {
      message: "pharmacy.stock.ward.quantityNotExceedoTtalStock",
      path: ["quantity"],
    }
  );

  schema = schema.refine(
    (data) =>
      destinationType !== "ward" || (destinationType === "ward" && data.wardTo),
    {
      message: "pharmacy.stock.ward.pleaseSelectWard",
      path: ["wardTo"],
    }
  );

  schema = schema.refine(
    (data) =>
      destinationType !== "patient" ||
      (destinationType === "patient" && data.patient?.code),
    {
      message: "pharmacy.stock.ward.pleaseSelectPatient",
      path: ["patient"],
    }
  );

  schema = schema.refine((data) => !!data.lot, {
    message: "pharmacy.stock.ward.pleaseSelectLot",
    path: ["lot"],
  });

  return schema;
}

export function getInitialValues(
  medical?: MedicalDTO,
  ward?: WardDTO
): Partial<TFormValues> {
  return {
    code: undefined,
    ward: ward ? { code: ward.code ?? "" } : undefined,
    date: new Date(),
    isPatient: false,
    patient: undefined,
    age: undefined,
    weight: undefined,
    description: "Ward medical discharge",
    medical: medical,
    quantity: 0,
    units: medical?.prodCode ?? "",
    wardTo: undefined,
    lot: undefined,
  };
}
