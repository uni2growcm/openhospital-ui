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
import { MedicalDTOSchema, getInitialValues } from "./consts";
import "./styles.scss";
import { PharmaceuticalFormProps, TFormValues } from "./types";

export function PharmaceuticalForm({
  pharmaceutical,
  loading,
  onSubmit,
}: PharmaceuticalFormProps) {
  const { t } = useTranslation();

  const { control, handleSubmit } = useForm<TFormValues>({
    defaultValues: getInitialValues(pharmaceutical),
    resolver: standardSchemaResolver(MedicalDTOSchema),
  });

  const { medicalTypes, options: medicalTypeOptions } = useMedicalTypes();

  const handleGoBack = useNavigationHandler(PATHS.pharmacy_pharmaceutical, {
    replace: true,
  });

  const onValidSubmit = useCallback(
    (data: TFormValues) => {
      const selectedType = medicalTypes.find((type) => type.code === data.type);

      const medicalDTO: MedicalDTO = {
        ...data,
        type: selectedType,
        deleted: data.deleted ? "Y" : "N", 
        initialqty: 0,
        inqty: 0,
        outqty: 0,
        prodCode: data.prodCode + "",
      };
      onSubmit(medicalDTO);
    },
    [medicalTypes, onSubmit]
  );

  return (
    <div className="pharmaceuticalForm">
      <form
        data-cy="pharmaceutical-form"
        className="form-grid-layout gap-2 w-full"
        onSubmit={handleSubmit(onValidSubmit)}
      >
        <TextFormField
          type="number"
          label={t("pharmacy.form.fields.prodCode")}
          control={control}
          name="prodCode"
          disabled={!!pharmaceutical}
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
        />
        <TextFormField
          type="number"
          label={t("pharmacy.form.fields.pcsperpck")}
          control={control}
          name="pcsperpck"
        />
        <TextFormField
          type="number"
          label={t("pharmacy.form.fields.minqty")}
          control={control}
          name="minqty"
        />
        <div className="col-start-1 col-span-full"></div>
        <CheckboxFormField
          label={t("pharmacy.form.fields.active")}
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
