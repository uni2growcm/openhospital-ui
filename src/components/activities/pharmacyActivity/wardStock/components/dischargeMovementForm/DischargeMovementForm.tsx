import { zodResolver } from "@hookform/resolvers/zod";
import { FormControlLabel, Radio, RadioGroup, TextField } from "@mui/material";
import Button from "components/accessories/button/Button";
import {
  AutocompleteFormField,
  DateFormField,
  TextFormField,
} from "components/accessories/forms";
import InfoBox from "components/accessories/infoBox/InfoBox";
import PatientPicker from "components/accessories/patientPicker/PatientPicker";
import { LotFormField } from "components/activities/pharmacyActivity/pharmaceuticalStock/components/forms/lotFormField";
import { MedicalDTO, MovementWardDTO } from "generated";
import { DATETIME_FORMAT } from "libraries/consts";
import { useTranslation } from "libraries/hooks";
import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { createWardMovement } from "state/pharmacy";
import { MovementWardDTOSchema, getInitialValues } from "./const";
import "./style.scss";
import { DestinationType, IWardDischargeFormProps, TFormValues } from "./types";

export function WardDischargeForm({
  wardMedical,
  onCancel,
  onSubmit,
}: IWardDischargeFormProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [destinationType, setDestinationType] =
    useState<DestinationType>("patient");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [info, setInfo] = useState<{
    type: "info" | "error" | "success" | null;
    message: string;
  }>({ type: null, message: "" });
  const infoBoxRef = useRef<HTMLDivElement>(null);

  const wards = useAppSelector((s) => s.wards.allWards?.data ?? []);
  const wardsStatus = useAppSelector((s) => s.wards.allWards?.status);

  const totalStock =
    (wardMedical.in_quantity ?? 0) - (wardMedical.out_quantity ?? 0);

  const {
    control,
    watch,
    formState: { errors },
    getValues,
    setValue,
    trigger,
  } = useForm<TFormValues>({
    resolver: zodResolver(MovementWardDTOSchema),
    defaultValues: getInitialValues(
      wardMedical?.id?.medical,
      wardMedical?.id?.ward
    ),
  });

  const formValues = watch();

  const wardOptions = useMemo(
    () =>
      wards
        .filter((w) => w.code !== wardMedical?.id?.ward?.code)
        .map((w) => ({
          value: w.code ?? "",
          label: w.description ?? "",
          ...w,
        })),
    [wards, wardMedical?.id?.ward?.code]
  );

  const validateQuantity = useCallback(() => {
    const { quantity } = formValues;
    if (!quantity || quantity <= 0) {
      setInfo({
        type: "error",
        message: t("pharmacy.stock.ward.quantityGreaterThanZero"),
      });
      return false;
    }
    if (quantity > totalStock) {
      setInfo({
        type: "error",
        message: `${t(
          "pharmacy.stock.ward.quantityNotExceedoTtalStock"
        )} (${totalStock})`,
      });
      return false;
    }
    return true;
  }, [formValues.quantity, totalStock, t]);

  const validateDestination = useCallback(() => {
    if (destinationType === "patient" && !formValues.patient?.code) {
      setInfo({
        type: "error",
        message: t("pharmacy.stock.ward.pleaseSelectPatient"),
      });
      return false;
    }
    if (destinationType === "ward" && !formValues.wardTo) {
      setInfo({
        type: "error",
        message: t("pharmacy.stock.ward.pleaseSelectWard"),
      });
      return false;
    }
    return true;
  }, [destinationType, formValues.patient?.code, formValues.wardTo, t]);

  const submitWardMovement = useCallback(
    async (data: TFormValues) => {
      if (!wardMedical?.id?.medical || !wardMedical?.id?.ward) {
        setInfo({
          type: "error",
          message: t("pharmacy.stock.ward.failedTocreateDischargeMovement"),
        });
        return;
      }

      setIsSubmitting(true);

      try {
        const wardTo =
          destinationType === "ward"
            ? wards.find((w) => w.code === formValues.wardTo?.code)
            : undefined;
        const patient =
          destinationType === "patient" ? formValues.patient : undefined;

        const description =
          destinationType === "patient"
            ? `${patient?.firstName || ""} ${patient?.secondName || ""}`
            : destinationType === "ward"
            ? `${formValues.wardTo}` || ""
            : t("pharmacy.stock.ward.movementType.ward");

        const payload: MovementWardDTO = {
          ward: wardMedical.id.ward!,
          date: (data.date as any).toISOString(),
          isPatient: destinationType === "patient",
          patient,
          age:
            destinationType === "patient" ? data.age ?? undefined : undefined,
          weight:
            destinationType === "patient"
              ? data.weight ?? undefined
              : undefined,
          description: description ?? "",
          medical: wardMedical.id.medical!,
          quantity: data.quantity,
          units: t("pharmacy.stock.ward.pieces"),
          wardTo,
          wardFrom: undefined,
          lot: formValues.lot,
        };

        await dispatch(createWardMovement(payload)).unwrap();
        onSubmit?.(payload);
      } catch (err) {
        console.error("Error creating ward movement:", err);
        setInfo({
          type: "error",
          message: t("pharmacy.stock.ward.failedTocreateDischargeMovement"),
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [wardMedical, wards, destinationType, formValues, t, onSubmit, dispatch]
  );

  const handleDischargeMovement = useCallback(async () => {
    if (!validateDestination() || !validateQuantity()) return;

    const lot = getValues("lot");
    if (!lot) {
      setInfo({
        type: "error",
        message: t("pharmacy.stock.ward.pleaseSelectLot"),
      });
      return;
    }

    await submitWardMovement(getValues());
  }, [validateDestination, validateQuantity, getValues, submitWardMovement, t]);

  const onBlurCallback = useCallback(
    (fieldName: keyof TFormValues) =>
      (
        e: React.SyntheticEvent,
        value: TFormValues[keyof TFormValues] | null
      ) => {
        if (value && typeof value === "object")
          setValue(fieldName, value, { shouldValidate: true });
        trigger(fieldName);
      },
    [setValue, trigger]
  );

  return (
    <form className="wardDischargeForm">
      <div className="wardDischargeForm__row">
        <div className="wardDischargeForm__section wardDischargeForm__section--quarter">
          <DateFormField
            label={t("pharmacy.stock.ward.date")}
            control={control}
            name="date"
            format={DATETIME_FORMAT}
          />
        </div>

        <div className="wardDischargeForm__section wardDischargeForm__section--three-quarter">
          <TextField
            label={t("pharmacy.stock.ward.pharmaceutical")}
            name="medical"
            disabled
            value={wardMedical?.id?.medical?.description || ""}
          />
        </div>
      </div>

      <div className="wardDischargeForm__totalStock">
        {t("pharmacy.stock.ward.totalStock")}: {totalStock}
      </div>

      <div className="wardDischargeForm__section">
        <label className="wardDischargeForm__label">
          {t("pharmacy.stock.ward.destination")}
        </label>
        <div className="wardDischargeForm__radioWrapper">
          <RadioGroup
            row
            value={destinationType}
            onChange={(e) =>
              setDestinationType(e.target.value as DestinationType)
            }
          >
            <FormControlLabel
              value="patient"
              control={<Radio />}
              label={t("pharmacy.stock.ward.movementType.patient")}
            />
            <FormControlLabel
              value="internal"
              control={<Radio />}
              label={t("pharmacy.stock.ward.movementType.ward")}
            />
            <FormControlLabel
              value="ward"
              control={<Radio />}
              label={t("pharmacy.stock.ward.movementType.toAnotherWard")}
            />
          </RadioGroup>
        </div>
      </div>

      {destinationType === "patient" && (
        <PatientPicker
          theme="regular"
          fieldName="patient"
          label={t("pharmacy.stock.ward.selectPatient")}
          fieldValue={formValues.patient?.code ?? ""}
          isValid={!errors.patient}
          errorText={
            errors.patient ? t("pharmacy.stock.ward.errorPatient") : ""
          }
          onBlur={onBlurCallback("patient")}
        />
      )}

      {destinationType === "ward" && (
        <AutocompleteFormField
          control={control}
          name="wardTo"
          label={t("pharmacy.stock.ward.selectWard")}
          options={wardOptions}
          isLoading={wardsStatus === "LOADING"}
        />
      )}

      <div className="wardDischargeForm__section">
        <TextFormField
          type="number"
          label={t("pharmacy.stock.ward.quantity")}
          control={control}
          name="quantity"
        />
      </div>

      <div className="form-grid-layout gap-2 w-full">
        <LotFormField
          control={control}
          medical={wardMedical?.id?.medical as MedicalDTO}
          name="lot"
          showNewLotOption={(wardMedical?.id?.medical?.lots ?? []).length === 0}
        />
      </div>

      {info.type && (
        <div ref={infoBoxRef} className="info-box-container">
          <InfoBox type={info.type} message={info.message} />
        </div>
      )}

      <div className="wardDischargeForm__actions">
        <Button variant="outlined" onClick={onCancel}>
          {t("common.discard")}
        </Button>
        <Button
          variant="contained"
          onClick={handleDischargeMovement}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? t("pharmacy.stock.ward.loading")
            : t("pharmacy.stock.discharge")}
        </Button>
      </div>
    </form>
  );
}
