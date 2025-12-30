import ConfirmationDialog from "components/accessories/confirmationDialog/ConfirmationDialog";
import DateField from "components/accessories/dateField/DateField";
import TextField from "components/accessories/textField/TextField";
import { useFormik } from "formik";
import { get, has } from "lodash";
import React, { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { object, string } from "yup";
import warningIcon from "../../../../assets/warning-icon.png";
import {
  formatAllFieldValues,
  getFromFields,
} from "../../../../libraries/formDataHandling/functions";
import Button from "../../button/Button";
import "./styles.scss";
import { EncounterProps } from "./types";
import { useAppDispatch } from "libraries/hooks";
import { getEncountersByPatient } from "state/encounter";
import { PatientDTO } from "generated";

const EncounterForm: FC<EncounterProps> = ({
  fields,
  patient,
  onSubmit,
  creationMode,
  submitButtonLabel,
  resetButtonLabel,
  shouldResetForm,
  resetFormCallback,
}) => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const initialValues = getFromFields(fields, "value");

  const validationSchema = object({
    code: string().required(t("common.required")),
    performedAt: Yup.date().nullable().required(t("common.required")),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const formattedValues = formatAllFieldValues(fields, values);
      onSubmit(formattedValues as any);
    },
  });
  const [openResetConfirmation, setOpenResetConfirmation] = useState(false);
  const { resetForm } = formik;

  const isValid = (fieldName: string): boolean => {
    return has(formik.touched, fieldName) && has(formik.errors, fieldName);
  };
  const handleResetConfirmation = () => {
    setOpenResetConfirmation(false);
    resetForm();
    resetFormCallback();
  };

  const getErrorText = (fieldName: string): string => {
    return has(formik.touched, fieldName)
      ? (get(formik.errors, fieldName) as string)
      : "";
  };

  useEffect(() => {
    if (shouldResetForm) {
      resetForm();
      resetFormCallback();
    }
  }, [shouldResetForm, resetForm, resetFormCallback]);

  const getInitials = (firstName: string, secondName: string) => {
    const extract = (name: string) =>
      name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word[0].toUpperCase())
        .join("");

    return extract(firstName) + extract(secondName);
  };

 const generateNextEncounterCode = (
   patient: PatientDTO,
   ExistingEncountersNumber: number = 0,
 ): string => {
   const initials = getInitials(patient.firstName, patient.secondName);
   const base = `${initials}${patient.code}`;

   const nextNumber = ExistingEncountersNumber > 0 ? ExistingEncountersNumber + 1 : 1;

   return `${base}${nextNumber}`;
 };

 useEffect(() => {
   if (!creationMode || !patient?.code) return;
   if (formik.values.code) return;

   const fetchEncounters = async () => {
     try {
       const encounters = await dispatch(
         getEncountersByPatient(patient.code)
       ).unwrap();

       const nextEncounterCode = generateNextEncounterCode(
         patient,
         encounters?.length ?? 0
       );

       formik.setFieldValue("code", nextEncounterCode);
     } catch {
       const nextEncounterCode = generateNextEncounterCode(patient, 0);
       formik.setFieldValue("code", nextEncounterCode);
     }
   };

   fetchEncounters();
 }, [creationMode, patient, formik.values.code, dispatch]);

  return (
    <>
      <div className="patientEncounterForm">
        <h5 className="formInsertMode">
          {creationMode
            ? t("encounter.newencounter")
            : t("encounter.editencounter")}
        </h5>
        <form
          className="patientEncounterForm__form"
          onSubmit={formik.handleSubmit}
        >
          <div className="row start-sm center-xs">
            <div className="patientEncounterForm__item">
              <DateField
                fieldName="performedAt"
                fieldValue={formik.values.performedAt}
                disableFuture={true}
                theme="regular"
                format="dd/MM/yyyy HH:mm"
                isValid={isValid("performedAt")}
                errorText={getErrorText("performedAt")}
                label={t("encounter.performedAt")}
                onChange={(performedAt: Date | null) =>
                  formik.setFieldValue("performedAt", performedAt)
                }
                disabled={false}
              />
            </div>
            <div className="patientEncounterForm__item">
              <TextField
                field={formik.getFieldProps("code")}
                theme="regular"
                label={t("encounter.code")}
                isValid={isValid("code")}
                errorText={getErrorText("code")}
                onBlur={formik.handleBlur}
                type="text"
                disabled={true}
                maxLength={50}
              />
            </div>
          </div>
          <div className="patientEncounterForm__buttonSet">
            <div className="submit_button">
              <Button type="submit" variant="contained" disabled={false}>
                {submitButtonLabel}
              </Button>
            </div>
            <div className="reset_button">
              <Button
                type="reset"
                variant="text"
                disabled={false}
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

export default EncounterForm;
