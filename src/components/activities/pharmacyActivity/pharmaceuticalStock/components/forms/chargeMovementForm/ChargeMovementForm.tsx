import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import Button from "components/accessories/button/Button";
import {
  AutocompleteFormField,
  DateFormField,
  TextFormField,
} from "components/accessories/forms";
import { PATHS } from "consts";
import { MedicalDTO, MovementDTO } from "generated";
import { DATETIME_FORMAT } from "libraries/consts";
import { safeFormatToISO } from "libraries/formatUtils";
import { useNavigationHandler, useTranslation } from "libraries/hooks";
import {
  lotsSelector,
  useMedicals,
  useMovementTypes,
  useSuppliers,
} from "libraries/hooks/api";
import { isEmpty } from "lodash";
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { LotFormField } from "../lotFormField";
import { MovementDTOSchema, getInitialValues } from "./consts";
import "./styles.scss";
import { ChargeMovementProps, TFormValues } from "./types";
import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import { getMedicalLots } from "state/pharmacy";

export function ChargeMovementForm({
  movement,
  onSubmit,
  loading,
}: ChargeMovementProps) {
  const { t } = useTranslation();

  const { options: medicalOptions, selectMedical } = useMedicals();
  const { options: supplierOptions, selectSupplier } = useSuppliers();

  const dispatch = useAppDispatch();
  const lots = useAppSelector(lotsSelector);

  const { selectMovementType } = useMovementTypes();

  const { control, watch, formState, setValue } = useForm<TFormValues>({
    defaultValues: getInitialValues(movement),
    resolver: standardSchemaResolver(MovementDTOSchema),
  });

  const values = watch();

  const formatedValues = useMemo(() => {
    return {
      ...values,
      date: safeFormatToISO(values.date),
      lot: values.lot
        ? {
            ...values.lot,
            dueDate: safeFormatToISO(values.lot?.dueDate),
            preparationDate: safeFormatToISO(values.lot?.preparationDate),
          }
        : undefined,
      medical: selectMedical(values.medical),
      supplier: selectSupplier(values.supplier),
      type: selectMovementType(values.type),
      ward: undefined,
    };
  }, [values, selectMedical, selectSupplier, selectMovementType]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (isEmpty(Object.keys(formState.errors))) {
        onSubmit?.(formatedValues as MovementDTO);
      }
    },
    [formState, formatedValues, onSubmit]
  );

  const handleGoBack = useNavigationHandler(
    PATHS.pharmacy_pharmaceuticalstock,
    {
      replace: true,
    }
  );

  useEffect(() => {
    if (formatedValues.medical?.code) {
      dispatch(getMedicalLots({ medCode: formatedValues.medical.code }));
    }
  }, [formatedValues.medical, dispatch]);

  const medicalId = values.medical;

  const selectedMedical = useMemo(() => {
    if (!values.medical) return;
    const medicalBase = selectMedical(values.medical);
    if (!medicalBase) return;

    return {
      ...medicalBase,
      lots: lots
    };
  }, [values.medical, lots, selectMedical]);

  return (
    <div className="chargeMovementForm">
      <form className="form-grid-layout gap-2 w-full" onSubmit={handleSubmit}>
        <DateFormField
          format={DATETIME_FORMAT}
          label={t("pharmacy.form.fields.date")}
          control={control}
          name="date"
        />
        <TextFormField
          label={t("pharmacy.form.fields.refNo")}
          control={control}
          name="refNo"
        />
        <AutocompleteFormField
          label={t("pharmacy.form.fields.medical")}
          control={control}
          name="medical"
          options={medicalOptions}
          className="col-span-full"
        />
        <AutocompleteFormField
          label={t("pharmacy.form.fields.supplier")}
          control={control}
          name="supplier"
          options={supplierOptions}
          className="col-start-1"
        />
        <TextFormField
          type='number'
          label={t("pharmacy.form.fields.quantity")}
          control={control}
          name="quantity"
        />
        <div className="col-start-1 col-span-full"></div>
        {selectedMedical && (
          <LotFormField
            control={control}
            medical={selectedMedical}
            name="lot"
            showNewLotOption={true}
            hideQty
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
            {t("common.close")}
          </Button>
          <Button
            variant="contained"
            dataCy="submit-button"
            type="submit"
            disabled={loading}
          >
            {t("pharmacy.stock.charge")}
          </Button>
        </div>
      </form>
    </div>
  );
}
