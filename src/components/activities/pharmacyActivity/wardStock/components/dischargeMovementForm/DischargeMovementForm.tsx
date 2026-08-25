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
import { MedicalDTO, MovementWardDTO, WardDTO } from "generated";
import { DATETIME_FORMAT } from "libraries/consts";
import { useTranslation } from "libraries/hooks";
import { useWardOptions, useWards } from "libraries/hooks/api";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { LocaleKey } from "resources/types";
import {
  TFormValues,
  createMovementWardDTOSchema,
  getInitialValues,
} from "./const";
import "./style.scss";
import { DestinationType, IWardDischargeFormProps } from "./types";

export function WardDischargeForm({
  medical,
  onCancel,
  onSubmit,
}: IWardDischargeFormProps) {
  const { t } = useTranslation();
  const [destinationType, setDestinationType] =
    useState<DestinationType>("patient");
  const [info, setInfo] = useState<{
    type: "info" | "error" | "success" | null;
    message: string;
  }>({ type: null, message: "" });
  const infoBoxRef = useRef<HTMLDivElement>(null);

  const MovementWardDTOSchema = useMemo(
    () =>
      createMovementWardDTOSchema(medical.wardTotalQuantity, destinationType),
    [medical.wardTotalQuantity, destinationType]
  );

  const {
    control,
    watch,
    formState: { errors, isSubmitting },
    getValues,
    setValue,
    trigger,
  } = useForm<TFormValues>({
    resolver: zodResolver(MovementWardDTOSchema),
    defaultValues: getInitialValues(medical, medical.ward),
  });

  const formValues = watch();

  const wardFilter = useCallback(
    (ward: WardDTO) => ward.code !== medical.ward.code,
    [medical.ward]
  );

  const { wards, status: wardsStatus, selectWard } = useWards(wardFilter);

  const wardOptions = useWardOptions(wards);

  const submitWardMovement = useCallback(
    async (data: TFormValues) => {
      try {
        const wardTo =
          destinationType === "ward"
            ? selectWard(formValues.wardTo ?? "")
            : undefined;

        const patient =
          destinationType === "patient" ? formValues.patient : undefined;

        const description =
          destinationType === "patient"
            ? `${patient?.firstName || ""} ${patient?.secondName || ""}`
            : destinationType === "ward"
            ? `${wardTo?.description}` || ""
            : t("pharmacy.stock.ward.movementType.ward");

        const payload: MovementWardDTO = {
          ward: medical.ward!,
          date: (data.date as any).toISOString(),
          isPatient: destinationType === "patient",
          patient,
          age: formValues.patient?.age,
          weight: formValues.patient?.weight,
          description: description ?? "",
          medical: medical,
          quantity: data.quantity,
          units: t("pharmacy.stock.ward.pieces"),
          wardTo,
          wardFrom: undefined,
          lot: formValues.lot,
        };
        onSubmit?.(payload);
      } catch (err) {
        console.error("Error creating ward movement:", err);
        setInfo({
          type: "error",
          message: t("pharmacy.stock.ward.failedTocreateDischargeMovement"),
        });
      }
    },
    [medical, selectWard, destinationType, formValues, t, onSubmit]
  );

  const handleDischargeMovement = useCallback(async () => {
    const isValid = await trigger();
    if (!isValid) {
      if (infoBoxRef.current)
        infoBoxRef.current.scrollIntoView({ behavior: "smooth" });
      return;
    }

    await submitWardMovement(getValues());
  }, [getValues, submitWardMovement, trigger]);

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

  const getErrorMessage = (path: keyof TFormValues) => {
    const error = errors[path]?.message;
    if (!error) return undefined;
    const errorKey = error as LocaleKey;
    if (errorKey === "pharmacy.stock.ward.quantityNotExceedoTtalStock") {
      return `${t(errorKey)} (${medical.wardTotalQuantity})`;
    }
    return t(errorKey);
  };
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
            value={medical?.description || ""}
          />
        </div>
      </div>

      <div className="wardDischargeForm__totalStock">
        {t("pharmacy.stock.ward.totalStock")}: {medical.wardTotalQuantity}
      </div>

      <div className="wardDischargeForm__section">
        <label className="wardDischargeForm__label">
          {t("pharmacy.stock.ward.destination")}
        </label>
        <div className="wardDischargeForm__radioWrapper">
          <RadioGroup
            row
            value={destinationType}
            onChange={(e) => {
              const newDestination = e.target.value as DestinationType;
              setDestinationType(newDestination);
              if (newDestination !== "patient") setValue("patient", undefined);
              if (newDestination !== "ward") setValue("wardTo", undefined);
              trigger();
            }}
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
          errorText={getErrorMessage("patient") || ""}
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
          helperText={getErrorMessage("quantity")}
          error={!!errors.quantity}
        />
      </div>

      <div className="form-grid-layout gap-2 w-full">
        <LotFormField
          control={control}
          medical={medical as MedicalDTO}
          name="lot"
          showMainStoreQuantity={false}
          showNewLotOption={false}
          showWardTotalQuantity
          onLotChange={(lot) =>
            setValue("lot", lot, { shouldDirty: true, shouldValidate: true })
          }
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
