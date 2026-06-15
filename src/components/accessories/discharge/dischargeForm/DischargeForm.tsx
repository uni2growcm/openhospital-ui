import { Autocomplete } from "components/accessories/autocomplete";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import { get, has } from "lodash";
import moment from "moment";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { array, object, string } from "yup";
import warningIcon from "../../../../assets/warning-icon.png";
import {
  AdmissionTypeDTO,
  DiseaseDTO,
  DiseaseTypeDTO,
} from "../../../../generated";
import {
  differenceInDays,
  formatAllFieldValues,
  getFromFields,
} from "../../../../libraries/formDataHandling/functions";
import { getDiseasesIpdIn, getDiseasesIpdOut } from "../../../../state/diseases";
import { getDischargeTypes } from "../../../../state/types/discharges";
import { IState } from "../../../../types";
import { useDeathPeriodOptions } from "../../../../libraries/hooks/useDeathPeriodOptions";
import AutocompleteField from "../../autocompleteField/AutocompleteField";
import Button from "../../button/Button";
import ConfirmationDialog from "../../confirmationDialog/ConfirmationDialog";
import DateField from "../../dateField/DateField";
import TextField from "../../textField/TextField";
import "./styles.scss";
import { DischargeProps } from "./types";

const DischargeForm: FC<DischargeProps> = ({
  fields,
  onSubmit,
  submitButtonLabel,
  resetButtonLabel,
  isLoading,
  shouldResetForm,
  resetFormCallback,
  admission,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const deathPeriodOptions = useDeathPeriodOptions();

  const diagnosisOutList = useAppSelector(
    (state: IState) => state.diseases.diseasesIpdOut.data
  );

  const diagnosisInList = useAppSelector(
    (state: IState) => state.diseases.diseasesIpdIn.data
  );

  const diagnosisInStatus = useAppSelector(
    (state: IState) => state.diseases.diseasesIpdIn.status
  );

  const dischargeTypes = useAppSelector(
    (state: IState) => state.types.discharges.getAll.data
  );

  const [isDeadDischarge, setIsDeadDischarge] = useState(false);

  const renderOptions = (
    data:
      | (DiseaseDTO | AdmissionTypeDTO | DiseaseTypeDTO | DiseaseDTO)[]
      | undefined
  ) => {
    if (data) {
      return data.map((item) => {
        return {
          value: item.code?.toString() ?? "",
          label: item.description ?? "",
        };
      });
    } else return [];
  };

  const initialValues = getFromFields(fields, "value");

  const validationSchema = object({
    disDate: string()
      .required(t("common.required"))
      .test({
        name: "disDate",
        message: t("common.invaliddate"),
        test: function (value) {
          return moment(value).isValid();
        },
      })
      .test({
        name: "disDate",
        message: t("admission.validatelastdate", {
          admDate: moment(admission?.admDate ?? "").format("DD/MM/YYYY HH:mm"),
        }),
        test: function (value) {
          return (
            moment(value).isValid() &&
            moment(value)
              .startOf("day")
              .isSameOrAfter(moment(admission?.admDate ?? "").startOf("day"))
          );
        },
      }),
    disType: string().required(t("common.required")),
    diagnosisOut: array().min(1, t("common.required")),
    nextAppointment: string(),
    deathPeriod: string().when("disType", {
      is: (disType: string) => {
        const dischargeType = dischargeTypes?.find(item => item.code === disType);
        return dischargeType?.code === "D" || dischargeType?.description?.toLowerCase().includes("dead");
      },
      then: string().required(t("common.required")),
      otherwise: string(),
    }),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const formattedValues = formatAllFieldValues(fields, values);
      formattedValues.diagnosisIn = diagnosisInList?.filter(
        (item) => formattedValues.diagnosisIn?.includes(item.code)
      );
      formattedValues.complicationDiagnosis = diagnosisInList?.filter(
        (item) => formattedValues.complicationDiagnosis?.includes(item.code)
      );
      formattedValues.diagnosisOut = diagnosisOutList?.filter(
        (item) => formattedValues.diagnosisOut?.includes(item.code)
      );
      formattedValues.disType = dischargeTypes?.find(
        (item) => item.code === formattedValues.disType
      );

      onSubmit(formattedValues as any);
    },
  });

  const { setFieldValue, resetForm, handleBlur } = formik;

  const dateFieldHandleOnChange = useCallback(
    (fieldName: string) => (value: any) => {
      setFieldValue(fieldName, value);
      formik.validateField(fieldName);
      formik.setFieldTouched(fieldName);
      const days = differenceInDays(
        new Date(admission?.admDate ?? ""),
        new Date(value)
      ).toString();
      setFieldValue("bedDays", days);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setFieldValue, admission]
  );

  const isValid = (fieldName: string): boolean => {
    return has(formik.touched, fieldName) && has(formik.errors, fieldName);
  };

  const getErrorText = (fieldName: string): string => {
    return has(formik.touched, fieldName)
      ? (get(formik.errors, fieldName) as string)
      : "";
  };

  const handleDischargeTypeChange = (value: any) => {
      setIsDeadDischarge(value?.value === "D" || value?.label?.toLowerCase().includes("dead"));
  }

  const onBlurCallback = useCallback(
    (fieldName: string) =>
      (e: React.FocusEvent<HTMLDivElement>, value: string) => {
        handleBlur(e);
        setFieldValue(fieldName, value);
        formik.setFieldTouched(fieldName, false);
      },
    [handleBlur, setFieldValue, formik]
  );

  const [openResetConfirmation, setOpenResetConfirmation] = useState(false);

  const handleResetConfirmation = () => {
    setOpenResetConfirmation(false);
    formik.resetForm();
  };

  useEffect(() => {
    if (shouldResetForm) {
      resetForm();
      resetFormCallback();
    }
  }, [shouldResetForm, resetForm, resetFormCallback]);

  useEffect(() => {
    dispatch(getDischargeTypes());
    dispatch(getDiseasesIpdOut());
    dispatch(getDiseasesIpdIn());
  }, [dispatch]);

  const diagnosisOutStatus = useAppSelector(
    (state: IState) => state.diseases.diseasesIpdOut.status
  );
  const disTypeStatus = useAppSelector(
    (state: IState) => state.types.discharges.getAll.status
  );

  return (
    <>
      <div className="patientAdmissionForm">
        <form
          className="patientAdmissionForm__form"
          onSubmit={formik.handleSubmit}
        >
          <div className="row start-sm center-xs">
            <div className="patientAdmissionForm__item">
              <DateField
                fieldName="disDate"
                fieldValue={formik.values.disDate}
                disableFuture={true}
                theme="regular"
                format="dd/MM/yyyy HH:mm"
                isValid={isValid("disDate")}
                errorText={getErrorText("disDate")}
                label={t("admission.disDate")}
                onChange={dateFieldHandleOnChange("disDate")}
                disabled={isLoading}
              />
            </div>
            <div className="patientAdmissionForm__item">
              <TextField
                field={formik.getFieldProps("bedDays")}
                theme="regular"
                label={t("admission.bedDays")}
                isValid={isValid("bedDays")}
                errorText={getErrorText("bedDays")}
                onBlur={formik.handleBlur}
                disabled={true}
                type="number"
              />
            </div>
          </div>
          <div className="row start-sm center-xs">
            <div className="fullWidth patientAdmissionForm__item">
              <Autocomplete
                id="diagnosisIn"
                multiple
                freeSolo
                value={formik.values.diagnosisIn}
                options={renderOptions(diagnosisInList)}
                label={t("admission.diagnosisIn")}
                placeholder={t("admission.diagnosisIn")}
                disabled
              />
            </div>
            <div className="fullWidth patientAdmissionForm__item">
              <Autocomplete
                id="diagnosisOut"
                multiple
                freeSolo
                value={formik.values.diagnosisOut}
                options={renderOptions(diagnosisOutList)}
                onChange={(_, value) => {
                  formik.setFieldValue("diagnosisOut", value);
                  formik.setFieldTouched("diagnosisOut", true);
                }}
                onBlur={() => formik.setFieldTouched("diagnosisOut", true)}
                label={t("admission.diagnosisOut")}
                placeholder={t("admission.diagnosisOut")}
                error={isValid("diagnosisOut")}
                helperText={getErrorText("diagnosisOut")}
              />
            </div>
            <div className="fullWidth patientAdmissionForm__item">
              <Autocomplete
                id="complicationDiagnosis"
                multiple
                freeSolo
                value={formik.values.complicationDiagnosis}
                options={renderOptions(diagnosisInList)}
                onChange={(_, value) => {
                  formik.setFieldValue("complicationDiagnosis", value);
                }}
                label={t("admission.complicationDiagnosis")}
                placeholder={t("admission.complicationDiagnosis")}
              />
            </div>
            <div className="fullWidth patientAdmissionForm__item">
              <AutocompleteField
                fieldName="disType"
                fieldValue={formik.values.disType}
                label={t("admission.disType")}
                isValid={isValid("disType")}
                errorText={getErrorText("disType")}
                onBlur={onBlurCallback("disType")}
                options={renderOptions(dischargeTypes)}
                onChange={(_, value) => {
                  handleDischargeTypeChange(value);
                }}
                loading={disTypeStatus === "LOADING"}
                disabled={isLoading}
              />
            </div>
          </div>
          {isDeadDischarge && (
            <div className="row start-sm center-xs">
              <div className="fullWidth patientAdmissionForm__item">
                <AutocompleteField
                  fieldName="deathPeriod"
                  fieldValue={formik.values.deathPeriod}
                  label={t("admission.deathPeriod")}
                  isValid={isValid("deathPeriod")}
                  errorText={getErrorText("deathPeriod")}
                  onBlur={onBlurCallback("deathPeriod")}
                  options={deathPeriodOptions}
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          <div className="row start-sm center-xs">
            <div className="fullWidth patientAdmissionForm__item">
              <TextField
                field={formik.getFieldProps("anamnesis")}
                theme="regular"
                label={t("admission.anamnesis")}
                multiline={true}
                type="text"
                isValid={isValid("anamnesis")}
                errorText={getErrorText("anamnesis")}
                onBlur={formik.handleBlur}
                rows={5}
                disabled={isLoading}
              />
            </div>
            <div className="fullWidth patientAdmissionForm__item">
              <TextField
                field={formik.getFieldProps("othersInformation")}
                theme="regular"
                label={t("admission.othersInformation")}
                multiline={true}
                type="text"
                isValid={isValid("othersInformation")}
                errorText={getErrorText("othersInformation")}
                onBlur={formik.handleBlur}
                rows={5}
                disabled={isLoading}
              />
            </div>
            <div className="fullWidth patientAdmissionForm__item">
              <DateField
                fieldName="nextAppointment"
                fieldValue={formik.values.nextAppointment}
                disableFuture={false}
                theme="regular"
                format="dd/MM/yyyy HH:mm"
                isValid={isValid("nextAppointment")}
                errorText={getErrorText("nextAppointment")}
                label={t("admission.nextAppointment")}
                onChange={dateFieldHandleOnChange("nextAppointment")}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="patientAdmissionForm__buttonSet">
            <div className="submit_button">
              <Button type="submit" variant="contained" disabled={isLoading}>
                {submitButtonLabel}
              </Button>
            </div>
            <div className="reset_button">
              <Button
                type="reset"
                variant="text"
                disabled={isLoading}
                onClick={() => setOpenResetConfirmation(true)}
              >
                {resetButtonLabel}
              </Button>
            </div>
          </div>
          <ConfirmationDialog
            isOpen={openResetConfirmation}
            title={resetButtonLabel.toUpperCase()}
            info={t("common.resetform")}
            icon={warningIcon}
            primaryButtonLabel={resetButtonLabel}
            secondaryButtonLabel={t("common.discard")}
            handlePrimaryButtonClick={handleResetConfirmation}
            handleSecondaryButtonClick={() => setOpenResetConfirmation(false)}
          />
        </form>
      </div>
    </>
  );
};

export default DischargeForm;
