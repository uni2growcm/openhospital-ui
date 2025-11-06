import { z } from "zod";
import { AjustFormValues } from "./types";

export const ajustSchema = z.object({
  lastQuantity: z
    .number({
      error: "La quantité 1 est obligatoire",
    })
    .nonnegative("La quantité 1 ne peut pas être négative"),
  newQuantity: z
    .number({
      error: "La quantité 2 est obligatoire",
    })
    .nonnegative("La quantité 2 ne peut pas être négative"),
});

export function getInitialValues(
  from?: AjustFormValues
): Partial<AjustFormValues> {
  return {
    lastQuantity: from?.lastQuantity,
    newQuantity: from?.newQuantity ,
  };
}
