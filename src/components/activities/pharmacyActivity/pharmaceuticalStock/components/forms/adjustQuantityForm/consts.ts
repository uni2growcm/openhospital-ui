import { MovementDTO } from "generated";
import { LocaleKey } from "resources/types";
import z from "zod";
import { TFormValues } from "./types";

export function getAdjustQuantitySchema(
  t: (key: LocaleKey, context?: Record<string, any>) => string
) {
  return z.object({
    currentQuantity: z
      .number()
      .min(0, t("pharmacy.form.fields.newQntyNonNegetive")),
    newQuantity: z
      .number()
      .min(0, t("pharmacy.form.fields.newQntyNonNegetive")),
  });
}

export function getInitialValues(movement?: MovementDTO): Partial<TFormValues> {
  return {
    currentQuantity: movement?.quantity ?? 0,
    newQuantity: movement?.quantity ?? 0,
  };
}
