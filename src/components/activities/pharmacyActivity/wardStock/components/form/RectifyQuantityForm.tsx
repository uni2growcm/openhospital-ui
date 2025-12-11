import React, { FormEvent, useCallback, useMemo } from "react";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import Button from "components/accessories/button/Button";
import {
  AutocompleteFormField,
  TextFormField,
} from "components/accessories/forms";
import { PATHS } from "consts";
import { MovementWardDTO } from "generated";
import { useNavigationHandler, useTranslation } from "libraries/hooks";
import { isEmpty } from "lodash";
import { useForm } from "react-hook-form";
import { MedicalWardDTOSchema, getInitialValues } from "./consts";
import "./styles.scss";
import { PharmaceuticalStockFormProps, TFormValues } from "./types";

function RectifyQuantityForm({
  pharmaceutical,
  onSubmit,
  loading,
}: PharmaceuticalStockFormProps) {
  const { t } = useTranslation();

  const { control, watch, formState } = useForm<TFormValues>({
    defaultValues: getInitialValues(pharmaceutical),
    resolver: standardSchemaResolver(MedicalWardDTOSchema),
  });

  const medicalOptions = useMemo(() => {
    if (!pharmaceutical?.id?.medical) return [];
    return [
      {
        label: pharmaceutical.id.medical.description,
        value: pharmaceutical.id.medical.code,
      },
    ];
  }, [pharmaceutical]);

  const values = watch();

  const formValues: MovementWardDTO = useMemo(
    () =>
      ({
        ward: pharmaceutical!.id!.ward,
        medical: pharmaceutical!.id!.medical,
        date: new Date().toISOString(),
        description: values.reason || "",
        quantity: values.quantity,
        units: t("pharmacy.stock.ward.pieces"),
        lot: pharmaceutical!.id!.lot,
      } as any as MovementWardDTO),
    [values, t, pharmaceutical]
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      console.log("FORM ERRORS:", formState.errors);
      if (isEmpty(Object.keys(formState.errors))) {
        console.log("FORM VALUES SENT TO API:", formValues);
        onSubmit?.(formValues);
      }
    },
    [formState.errors, formValues, onSubmit]
  );

  const handleGoBack = useNavigationHandler(PATHS.pharmacy_ward_stock, {
    replace: true,
  });

  return (
    <div className="rectifyStockForm">
      <form className="form-grid-layout gap-2 w-full" onSubmit={handleSubmit}>
        <span className="col-span-full text-lg">
          {t("pharmacy.stock.ward.inStock")}: {values.actualQuantity}
        </span>
        <AutocompleteFormField
          label={t("pharmacy.stock.ward.medical")}
          name="medical"
          control={control}
          options={medicalOptions}
          disabled
        />
        <div className="col-start-1 col-span-full"></div>
        <TextFormField
          type="number"
          name="actualQuantity"
          label={t("pharmacy.stock.ward.actualQuantity")}
          control={control}
          disabled
        />
        <TextFormField
          type="number"
          name="quantity"
          label={t("pharmacy.stock.ward.quantity")}
          control={control}
        />
        <div className="col-start-1 col-span-full"></div>
        <TextFormField
          name="reason"
          label={t("pharmacy.stock.ward.reason")}
          control={control}
          multiline
          className="col-span-full"
        />
        <div className="col-start-1 col-span-full"></div>
        <div className="col-span-full flex gap-2 justify-end">
          <Button
            type="reset"
            dataCy="reset-button"
            onClick={handleGoBack}
            disabled={loading}
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant="contained"
            dataCy="submit-button"
            type="submit"
            disabled={loading}
          >
            {t("common.confirm")}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default RectifyQuantityForm;
