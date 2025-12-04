import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  FormControlLabel,
  Radio,
  RadioGroup,
  Snackbar,
  TextField,
} from "@mui/material";
import Button from "components/accessories/button/Button";
import {
  AutocompleteFormField,
  DateFormField,
  TextFormField,
} from "components/accessories/forms";
import PatientPicker from "components/accessories/patientPicker/PatientPicker";
import { LotFormField } from "components/activities/pharmacyActivity/pharmaceuticalStock/components/forms/lotFormField";
import StockWardModal from "components/activities/pharmacyActivity/wardStock/components/modal/StockWardModal";
import { MedicalDTO, MovementWardDTO } from "generated";
import { DATETIME_FORMAT } from "libraries/consts";
import { useTranslation } from "libraries/hooks";
import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import React, { useCallback, useMemo, useState } from "react";
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

  const [showLotSection, setShowLotSection] = useState(false);
  const [quantityError, setQuantityError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const wards = useAppSelector((s) => s.wards.allWards?.data ?? []);
  const wardsStatus = useAppSelector((s) => s.wards.allWards?.status);
  const totalStock =
    (wardMedical.in_quantity ?? 0) - (wardMedical.out_quantity ?? 0);
  const schema = MovementWardDTOSchema;

  const {
    control,
    watch,
    formState: { errors },
    getValues,
    setValue,
    trigger,
  } = useForm<TFormValues>({
    resolver: zodResolver(schema),
    defaultValues: getInitialValues(wardMedical?.id?.medical, wardMedical?.id?.ward),
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
    const quantity = formValues.quantity;
    if (!quantity || quantity <= 0) {
      setQuantityError(t("pharmacy.stock.ward.quantityGreaterThanZero"));
      return false;
    }
    if (quantity > totalStock) {
      setQuantityError(
        `${t(
          "pharmacy.stock.ward.quantityNotExceedoTtalStock"
        )} (${totalStock})`
      );
      return false;
    }
    return true;
  }, [formValues.quantity, totalStock, t]);

  const validateDestination = useCallback(() => {
    if (destinationType === "patient" && !formValues.patient?.code) {
      setQuantityError(t("pharmacy.stock.ward.pleaseSelectPatient"));
      return false;
    }
    if (destinationType === "ward" && !formValues.wardTo?.code) {
      setQuantityError(t("pharmacy.stock.ward.pleaseSelectWard"));
      return false;
    }
    return true;
  }, [destinationType, formValues.patient?.code, formValues.wardTo?.code, t]);

  const handleOpenLotModal = useCallback(() => {
    setQuantityError("");
    if (!validateQuantity()) return;
    if (!validateDestination()) return;

    setShowLotSection(true);
  }, [validateQuantity, validateDestination]);

  const submitWardMovement = useCallback(
    async (data: TFormValues) => {
      setIsSubmitting(true);
      try {
        if (!wardMedical?.id?.ward) {
          setSnackbar({
            open: true,
            message: t("pharmacy.stock.ward.failedTocreateDischargeMovement"),
            severity: "error",
          });
          setIsSubmitting(false);
          return;
        }

        const wardTo =
          destinationType === "ward"
            ? wards.find((w) => w.code === (formValues.wardTo as any)?.code)
            : undefined;

        const patient =
          destinationType === "patient" ? formValues.patient : undefined;

        const description =
          destinationType === "patient"
            ? `${patient?.firstName || ""} ${patient?.secondName || ""}`
            : destinationType ===
              t("pharmacy.stock.ward.movementType.toAnotherWard")
            ? wardTo?.description || ""
            : t("pharmacy.stock.ward.movementType.ward");

        const payload: MovementWardDTO = {
          ward: wardMedical?.id?.ward || { code: "" },
          date: (data.date as any).toISOString(),
          isPatient: destinationType === "patient",
          patient:
            destinationType === "patient" ? formValues.patient : undefined,
          age:
            destinationType === "patient" ? data.age ?? undefined : undefined,
          weight:
            destinationType === "patient"
              ? data.weight ?? undefined
              : undefined,
          description: description ?? "",
          medical: wardMedical?.id?.medical!,
          quantity: data.quantity,
          units: t("pharmacy.stock.ward.pieces"),
          wardTo:
            destinationType === "ward"
              ? wards.find((w) => w.code === (formValues.wardTo as any)?.code)
              : undefined,
          wardFrom: undefined,
          lot: formValues.lot,
        };

        await dispatch(createWardMovement(payload)).unwrap();

        setSnackbar({
          open: true,
          message: t(
            "pharmacy.stock.ward.dischargeMovementCreatedSuccessfully"
          ),
          severity: "success",
        });

        setTimeout(() => {
          setShowLotSection(false);
          onCancel?.();
          onSubmit?.(payload);
        }, 800);
      } catch (err) {
        setSnackbar({
          open: true,
          message: t("pharmacy.stock.ward.failedTocreateDischargeMovement"),
          severity: "error",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      wardMedical,
      wards,
      destinationType,
      formValues,
      t,
      onCancel,
      onSubmit,
      dispatch,
    ]
  );

  const handleLotConfirm = useCallback(async () => {
    const lot = getValues("lot");
    if (!lot) {
      setQuantityError(t("pharmacy.stock.ward.pleaseSelectLot"));
      return;
    }
    await submitWardMovement(getValues());
  }, [getValues, submitWardMovement, t]);

  const onBlurCallback = useCallback(
    (fieldName: keyof TFormValues) =>
      (
        e: React.SyntheticEvent,
        value: TFormValues[keyof TFormValues] | null
      ) => {
        if (value && typeof value === "object") {
          setValue(fieldName, value, { shouldValidate: true });
        }
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
          isValid={!!errors.patient}
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
        {quantityError && (
          <span className="wardDischargeForm__error">{quantityError}</span>
        )}
      </div>

      {wardMedical?.id?.medical && (
        <StockWardModal
          open={showLotSection}
          onClose={() => setShowLotSection(false)}
        >
          <div className="wardDischargeForm__lotModalContent">
            <LotFormField
              control={control}
              medical={wardMedical?.id?.medical as MedicalDTO}
              name="lot"
            />

            <div className="wardDischargeForm__modalActions">
              <Button
                variant="outlined"
                onClick={() => setShowLotSection(false)}
              >
                {t("common.cancel")}
              </Button>

              <Button
                variant="contained"
                onClick={handleLotConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? t("pharmacy.stock.ward.loading")
                  : t("pharmacy.stock.discharge")}
              </Button>
            </div>
            <Snackbar
              open={snackbar.open}
              autoHideDuration={6000}
              onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
              <Alert
                severity={snackbar.severity}
                onClose={() =>
                  setSnackbar((prev) => ({ ...prev, open: false }))
                }
                sx={{ width: "100%" }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          </div>
        </StockWardModal>
      )}

      <div className="wardDischargeForm__actions">
        <Button variant="outlined" onClick={onCancel}>
          {t("common.discard")}
        </Button>

        <Button variant="contained" onClick={handleOpenLotModal}>
          {t("pharmacy.stock.ward.selectLot")}
        </Button>
      </div>
    </form>
  );
}
