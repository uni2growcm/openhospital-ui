import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import React, { FormEvent, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { getAdjustQuantitySchema, getInitialValues } from "./consts";
import "./style.scss";
import { AdjustQuantityFormProps, TFormValues } from "./types";
import { useTranslation } from "~/libraries/hooks";
import { TextFormField } from "~/components/accessories/forms";
import Button from "~/components/accessories/button/Button";

export function AdjustQuantityForm({
  loading,
  movement,
  onSubmit,
  onCancel,
}: AdjustQuantityFormProps) {
  const { t } = useTranslation();

  const schema = useMemo(() => getAdjustQuantitySchema(t), [t]);

  const { control, watch, formState } = useForm<TFormValues>({
    defaultValues: getInitialValues(movement),
    resolver: standardSchemaResolver(schema),
  });

  const values = watch();

  const formatedValues = useMemo(() => {
    return {
      movement: movement!,
      newQuantity: values.newQuantity,
    };
  }, [values, movement]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (Object.keys(formState.errors).length === 0 && movement) {
        onSubmit?.(formatedValues);
      }
    },
    [formState.errors, formatedValues, movement, onSubmit]
  );

  return (
    <div className="adjustQuantityForm">
      <h2 className="adjustQuantityForm__title">
        {t("pharmacy.form.fields.adjustQuantity")}
      </h2>
      <form className="form-grid-layout  gap-2 w-full" onSubmit={handleSubmit}>
        <TextFormField
          type="number"
          label={t("pharmacy.form.fields.currentQuantity")}
          control={control}
          name="currentQuantity"
          disabled
        />

        <TextFormField
          type="number"
          label={t("pharmacy.form.fields.newQuantity")}
          control={control}
          name="newQuantity"
          disabled={loading}
        />

        <div className="col-span-full">
          <Button
            type="button"
            dataCy="close-button"
            onClick={onCancel}
            disabled={loading}
          >
            {t("common.close")}
          </Button>
          <Button
            variant="contained"
            dataCy="adjust-button"
            type="submit"
            disabled={loading}
          >
            {t("pharmacy.form.fields.adjust")}
          </Button>
        </div>
      </form>
    </div>
  );
}
