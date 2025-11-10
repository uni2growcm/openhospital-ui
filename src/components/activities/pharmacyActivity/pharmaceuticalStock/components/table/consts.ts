import { z } from "zod";
import { AjustFormValues } from "./types";

export const ajustSchema = z.object({
  lastQuantity: z
    .number({
      error: "current quantity is required",
    })
    .nonnegative("current quantity must be non-negative"),
  newQuantity: z
    .union([
      z.string(),
      z.number().min(1, "new quantity must be greater than 0"),
    ])
    .refine(
      (val) => {
        if (typeof val === "string") {
          return val !== "";
        }
        return val > 0;
      },
      {
        message: "new quantity must be greater than 0",
      }
    )
    .transform((val) => {
      if (typeof val === "string" && val === "") {
        return 0;
      }
      if (typeof val === "string") {
        return parseFloat(val);
      }
      return val;
    }),
});

export function getInitialValues(
  from?: AjustFormValues
): Partial<AjustFormValues> {
  return {
    lastQuantity: from?.lastQuantity || 0,
    newQuantity: from?.newQuantity || 0,
  };
}
