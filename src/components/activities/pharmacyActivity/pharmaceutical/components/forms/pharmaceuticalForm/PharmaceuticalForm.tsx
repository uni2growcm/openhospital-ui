import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import Button from "components/accessories/button/Button";
import {
  AutocompleteFormField,
  TextFormField,
} from "components/accessories/forms";
import { CheckboxFormField } from "components/accessories/forms/CheckboxFormField/CheckboxFormField";
import { PATHS } from "consts";
import { MedicalDTO } from "generated";
import { useNavigationHandler, useTranslation } from "libraries/hooks";
import { useMedicalTypes } from "libraries/hooks/api/useMedicalTypes";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { MedicalDTOSchema, MedicalErrorKey, getInitialValues } from "./consts";
import "./styles.scss";
import { PharmaceuticalFormProps, TFormValues } from "./types";

export function PharmaceuticalForm({
  pharmaceutical,
  loading,
  onSubmit,
}: PharmaceuticalFormProps) {
  const { t } = useTranslation();

  const { control, handleSubmit, formState } = useForm<TFormValues>({
    defaultValues: getInitialValues(pharmaceutical),
    resolver: standardSchemaResolver(MedicalDTOSchema),
  });

  const { medicalTypes, options: medicalTypeOptions } = useMedicalTypes();

  const handleGoBack = useNavigationHandler(PATHS.pharmacy_pharmaceutical, {
    replace: true,
  });
  const onValidSubmit = useCallback(
    (values: TFormValues) => {
      const payload: MedicalDTO & { ignoreSimilar?: boolean } = {
        prodCode: values.prod_code,
        description: values.description,
        pcsperpck: values.pcsperpck,
        minqty: values.minqty,
        deleted: values.deleted ? "Y" : "N",
        type: medicalTypes.find((t) => t.code === values.type),
        ignoreSimilar: values.ignoreSimilar ?? false,
        lots: [],
      };

      if (pharmaceutical?.code) {
        payload.code = pharmaceutical.code;
        payload.lock = values.lock;
      }

      onSubmit?.(payload);
    },
    [onSubmit, pharmaceutical, medicalTypes]
  );

  return (
    <div className="pharmaceuticalForm">
      <form
        data-cy="pharmaceutical-form"
        className="form-grid-layout gap-2 w-full"
        onSubmit={handleSubmit(onValidSubmit)}
      >
        <TextFormField
          type="string"
          label={t("pharmacy.form.fields.prodCode")}
          control={control}
          name="prod_code"
          error={!!formState.errors.prod_code}
          helperText={
            formState.errors.prod_code?.message
              ? t(formState.errors.prod_code.message as MedicalErrorKey)
              : undefined
          }
        />
        <AutocompleteFormField
          label={t("pharmacy.form.fields.typeMedical")}
          control={control}
          name="type"
          options={medicalTypeOptions}
        />
        <div className="col-start-1 col-span-full"></div>
        <TextFormField
          type="string"
          label={t("pharmacy.form.fields.description")}
          control={control}
          name="description"
          error={!!formState.errors.description}
          helperText={
            formState.errors.description?.message
              ? t(formState.errors.description.message as MedicalErrorKey)
              : undefined
          }
        />
        <TextFormField
          type="number"
          label={t("pharmacy.form.fields.pcsperpck")}
          control={control}
          name="pcsperpck"
          inputProps={{ min: 0 }}
          error={!!formState.errors.pcsperpck}
          helperText={
            formState.errors.pcsperpck?.message
              ? t(formState.errors.pcsperpck.message as MedicalErrorKey)
              : undefined
          }
        />
        <TextFormField
          type="number"
          label={t("pharmacy.form.fields.minqty")}
          control={control}
          name="minqty"
          inputProps={{ min: 0 }}
          error={!!formState.errors.minqty}
          helperText={
            formState.errors.minqty?.message
              ? t(formState.errors.minqty.message as MedicalErrorKey)
              : undefined
          }
        />
        <div className="col-start-1 col-span-full"></div>
        <CheckboxFormField
          label={t("pharmacy.form.fields.deleted")}
          control={control}
          name="deleted"
        />
        {pharmaceutical && (
          <CheckboxFormField
            label={t("pharmacy.form.fields.ignoreSimilar")}
            control={control}
            name="ignoreSimilar"
          />
        )}
        <div className="col-start-1 col-span-full"></div>

        <div className="col-span-full flex gap-2 justify-end">
          <Button
            type="reset"
            dataCy="reset-button"
            onClick={handleGoBack}
            disabled={loading}
          >
            {t("common.discard")}
          </Button>
          <Button
            variant="contained"
            dataCy="submit-button"
            type="submit"
            disabled={loading}
          >
            {t("common.submit")}
          </Button>
        </div>
      </form>
    </div>
  );
}
