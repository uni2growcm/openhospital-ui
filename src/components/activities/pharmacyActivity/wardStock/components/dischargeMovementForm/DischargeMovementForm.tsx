import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  FormControlLabel,
  Radio,
  RadioGroup,
  Snackbar,
} from "@mui/material";
import Button from "components/accessories/button/Button";
import {
  AutocompleteFormField,
  DateFormField,
  TextFormField,
} from "components/accessories/forms";
import { LotFormField } from "components/activities/pharmacyActivity/pharmaceuticalStock/components/forms/lotFormField";
import StockWardModal from "components/activities/pharmacyActivity/wardStock/components/modal/StockWardModal";
import { MedicalDTO, MovementWardDTO, PatientDTO } from "generated";
import { useTranslation } from "libraries/hooks";
import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import React, { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { createWardMovement } from "state/pharmacy";
import { MovementWardDTOSchema, getInitialValues } from "./const";
import "./style.scss";
import { DestinationType, IWardDischargeFormProps, TFormValues } from "./types";

export function WardDischargeForm({
  movement,
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

  const patients = useAppSelector((s) => s.patients.searchResults?.data ?? []);
  const patientsStatus = useAppSelector(
    (s) => s.patients.searchResults?.status
  );

  const totalStock = movement?.quantity ?? 0;

  const schema = MovementWardDTOSchema;

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<TFormValues>({
    resolver: zodResolver(schema),
    defaultValues: getInitialValues(movement?.medical, movement?.ward),
  });

  const formValues = watch();

  const patientOptions = useMemo(
    () =>
      patients.map((p: PatientDTO) => ({
        value: p.code?.toString() ?? "",
        label: `${p.firstName ?? ""} ${p.secondName ?? ""}`,
        ...p,
      })),
    [patients]
  );

  const wardOptions = useMemo(
    () =>
      wards
        .filter((w) => w.code !== movement?.ward?.code)
        .map((w) => ({
          value: w.code ?? "",
          label: w.description ?? "",
          ...w,
        })),
    [wards, movement?.ward?.code]
  );

  const validateQuantity = useCallback(() => {
    const qty = getValues("quantity");

    if (!qty || qty <= 0) {
      setQuantityError(t("pharmacy.stock.ward.quantityGreaterThanZero"));
      return false;
    }
    if (qty > totalStock) {
      setQuantityError(
        `${t(
          "pharmacy.stock.ward.quantityNotExceedoTtalStock"
        )} (${totalStock})`
      );
      return false;
    }
    return true;
  }, [totalStock, getValues, t]);

  const validateDestination = useCallback(() => {
    if (destinationType === "patient" && !formValues.patient) {
      setQuantityError(t("pharmacy.stock.ward.pleaseSelectPatient"));
      return false;
    }
    if (destinationType === "ward" && !formValues.wardTo) {
      setQuantityError(t("pharmacy.stock.ward.pleaseSelectWard"));
      return false;
    }
    return true;
  }, [destinationType, formValues, t]);

  const handleOpenLotModal = () => {
    setQuantityError("");
    if (!validateQuantity()) return;
    if (!validateDestination()) return;

    setShowLotSection(true);
  };

  const handleLotConfirm = async () => {
    const lot = getValues("lot");
    if (!lot) {
      setQuantityError(t("pharmacy.stock.ward.pleaseSelectLot"));
      return;
    }
    await submitWardMovement(getValues());
  };

  const submitWardMovement = async (data: TFormValues) => {
    setIsSubmitting(true);

    try {
      if (!movement?.ward) {
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
        ward: movement?.ward || { code: "" },
        date: (data.date as any).toISOString(),
        patient: destinationType === "patient" ? formValues.patient : undefined,
        age: destinationType === "patient" ? data.age ?? undefined : undefined,
        weight:
          destinationType === "patient" ? data.weight ?? undefined : undefined,
        description:
          destinationType === "patient"
            ? `${formValues.patient?.firstName || ""} ${
                formValues.patient?.secondName || ""
              }`
            : destinationType === "ward"
            ? wards.find((w) => w.code === (formValues.wardTo as any)?.code)
                ?.description || ""
            : t("pharmacy.stock.ward.movementType.ward"),
        medical: movement?.medical!,
        quantity: data.quantity,
        units: t("pharmacy.stock.ward.pieces"),
        wardTo:
          destinationType === "ward"
            ? wards.find((w) => w.code === (formValues.wardTo as any)?.code)
            : undefined,
        wardFrom: undefined,
      };

      await dispatch(createWardMovement(payload)).unwrap();

      setSnackbar({
        open: true,
        message: t("pharmacy.stock.ward.dischargeMovementCreatedSuccessfully"),
        severity: "success",
      });

      setShowLotSection(false);
      onSubmit?.(payload);
    } catch (err) {
      setSnackbar({
        open: true,
        message: t("pharmacy.stock.ward.failedTocreateDischargeMovement"),
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="wardDischargeForm">
      {/* Date + Pharmaceutical */}
      <div className="wardDischargeForm__row">
        <div className="wardDischargeForm__section wardDischargeForm__section--quarter">
          <DateFormField
            label={t("pharmacy.stock.ward.date")}
            control={control}
            name="date"
            format="dd/MM/yyyy"
          />
        </div>

        <div className="wardDischargeForm__section wardDischargeForm__section--three-quarter">
          <TextFormField
            label={t("pharmacy.stock.ward.pharmaceutical")}
            control={control}
            name="medical"
            disabled
            defaultValue={movement?.medical?.description ?? ""}
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

      {/* Patient selector */}
      {destinationType === "patient" && (
        <AutocompleteFormField
          control={control}
          name="patient"
          label={t("pharmacy.stock.ward.selectPatient")}
          options={patientOptions}
          isLoading={patientsStatus === "LOADING"}
        />
      )}

      {/* Ward selector */}
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

      {/* Lot Modal */}
      {movement?.medical && (
        <StockWardModal
          open={showLotSection}
          onClose={() => setShowLotSection(false)}
          title={t("pharmacy.stock.ward.selectLot")}
        >
          <div className="wardDischargeForm__lotModalContent">
            <LotFormField
              control={control}
              medical={movement.medical as MedicalDTO}
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
            {/* Snackbar */}
            <Snackbar
              open={snackbar.open}
              autoHideDuration={6000}
              onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
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

      {/* Buttons */}
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
