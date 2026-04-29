import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "components/accessories/button/Button";
import DateField from "components/accessories/dateField/DateField";
import moment from "moment";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { object, string } from "yup";
import "./styles.scss";
import { IProps } from "./types";
import { useFormik } from "formik";
import { formatAllFieldValues, getFromFields } from "libraries/formDataHandling/functions";
import { initialFields } from "./consts";
import TextField from "components/accessories/textField/TextField";
import { get, has } from "lodash";
import { useFields } from "./useFields";

const DischargeAgainstMedicalAdviceDialog: FunctionComponent<
  IProps & {
    handlePrimaryButtonClick: (date: string) => void;
  }
> = ({
  isOpen,
  title,
  icon,
  info,
  primaryButtonLabel,
  secondaryButtonLabel,
  handlePrimaryButtonClick,
  handleSecondaryButtonClick,
}) => {
  const { t } = useTranslation();
  const [madeOnDate, setMadeOnDate] = useState<string>();

  const handleMadeOnDate = (date: Date | null) => {
    if (date) {
      setMadeOnDate(
        moment(date).isValid() ? moment(date).format("YYYY-MM-DDTHH:mm:ss") : ""
      );
    }
  };

  const fields = useFields();

  const initialValues = getFromFields(fields, "value");

  const validationSchema = object({
    name: string().required(t("common.required")),
    district: string().required(t("common.required")),
    commune: string().required(t("common.required")),
    localisation: string().required(t("common.required")),
    reference: string().required(t("common.required")),
    relationshipType: string().required(t("common.required")),
    madeOnDate: string().required(t("common.required")),
    occupation: string().required(t("common.required")),
    phone: string().required(t("common.required")),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const formattedValues = formatAllFieldValues(initialValues, values);
      handlePrimaryButtonClick(formattedValues as any);
    },
  });

  const isValid = (fieldName: string): boolean => {
    return has(formik.touched, fieldName) && has(formik.errors, fieldName);
  };
  
  const getErrorText = (fieldName: string): string => {
    return has(formik.touched, fieldName)
      ? (get(formik.errors, fieldName) as string)
      : "";
  };

  useEffect(() => {
    if (isOpen) {
      setMadeOnDate(
        madeOnDate
          ? madeOnDate
          : moment(new Date()).format("YYYY-MM-DDTHH:mm:ss")
      );
    }
  }, [setMadeOnDate, isOpen, madeOnDate]);

  return (
    <Dialog open={isOpen}>
      <DialogTitle>
        <div data-cy="dialog-title" className="dialog__title">
          {title}
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="dialog__content">
          <div className="dialog__divider" />
          <div className="dialog__info" data-cy="dialog-info">
            {info}
          </div>
          <form onSubmit={formik.handleSubmit} className="patientAdmissionForm">
            <div className="row start-sm center-xs">
              <div className="patientAdmissionForm__item">
                <DateField
                  fieldName="madeOnDate"
                  fieldValue={madeOnDate ?? ""}
                  disableFuture={true}
                  theme="regular"
                  format="dd/MM/yyyy HH:mm"
                  label={t("discharge.madeOnDate")}
                  onChange={(date: Date | null) =>
                    handleMadeOnDate(date ? date : null)
                  }
                  disabled={false}
                  isValid={false}
                  errorText=""
                />
              </div>
            </div>
            <div className="row start-sm center-xs">
              <div className="patientAdmissionForm__item">
                <TextField
                  field={formik.getFieldProps("name")}
                  theme="regular"
                  label={t("discharge.name")}
                  multiline={true}
                  type="text"
                  isValid={isValid("name")}
                  errorText={getErrorText("name")}
                  onBlur={formik.handleBlur}
                  rows={1}
                />
              </div>
              <div className="patientAdmissionForm__item">
                <TextField
                  field={formik.getFieldProps("relationshipType")}
                  theme="regular"
                  label={t("discharge.relationshipType")}
                  multiline={true}
                  type="text"
                  isValid={isValid("relationshipType")}
                  errorText={getErrorText("relationshipType")}
                  onBlur={formik.handleBlur}
                  rows={1}
                />
              </div>
            </div>
            <div className="row start-sm center-xs">
              <div className="patientAdmissionForm__item">
                <TextField
                  field={formik.getFieldProps("occupation")}
                  theme="regular"
                  label={t("discharge.occupation")}
                  multiline={true}
                  type="text"
                  isValid={isValid("occupation")}
                  errorText={getErrorText("occupation")}
                  onBlur={formik.handleBlur}
                  rows={1}
                />
              </div>
              <div className="patientAdmissionForm__item">
                <TextField
                  field={formik.getFieldProps("localisation")}
                  theme="regular"
                  label={t("discharge.localisation")}
                  multiline={true}
                  type="text"
                  isValid={isValid("localisation")}
                  errorText={getErrorText("localisation")}
                  onBlur={formik.handleBlur}
                  rows={1}
                />
              </div>
            </div>
            <div className="row start-sm center-xs">
              <div className="patientAdmissionForm__item">
                <TextField
                  field={formik.getFieldProps("district")}
                  theme="regular"
                  label={t("discharge.district")}
                  multiline={true}
                  type="text"
                  isValid={isValid("district")}
                  errorText={getErrorText("district")}
                  onBlur={formik.handleBlur}
                  rows={1}
                />
              </div>
              <div className="patientAdmissionForm__item">
                <TextField
                  field={formik.getFieldProps("commune")}
                  theme="regular"
                  label={t("discharge.commune")}
                  multiline={true}
                  type="text"
                  isValid={isValid("commune")}
                  errorText={getErrorText("commune")}
                  onBlur={formik.handleBlur}
                  rows={1}
                />
              </div>
            </div>
            <div className="row start-sm center-xs">
              <div className="patientAdmissionForm__item">
                <TextField
                  field={formik.getFieldProps("phone")}
                  theme="regular"
                  label={t("discharge.phone")}
                  multiline={true}
                  type="text"
                  isValid={isValid("phone")}
                  errorText={getErrorText("phone")}
                  onBlur={formik.handleBlur}
                  rows={1}
                />
              </div>
              <div className="patientAdmissionForm__item">
                <TextField
                  field={formik.getFieldProps("reference")}
                  theme="regular"
                  label={t("discharge.reference")}
                  multiline={true}
                  type="text"
                  isValid={isValid("reference")}
                  errorText={getErrorText("reference")}
                  onBlur={formik.handleBlur}
                  rows={1}
                />
              </div>
            </div>

            <div className="dialog__buttonSet" data-cy="dialog-button-set">
              <div data-cy="dialog-return-button" className="return_button">
                <Button
                  dataCy="approve-dialog"
                  type="submit"
                  variant="contained"
                >
                  {primaryButtonLabel}
                </Button>
              </div>
              {secondaryButtonLabel ? (
                <div className="reset_button">
                  <Button
                    dataCy="close-dialog"
                    type="reset"
                    variant="text"
                    onClick={handleSecondaryButtonClick}
                  >
                    {secondaryButtonLabel}
                  </Button>
                </div>
              ) : null}
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DischargeAgainstMedicalAdviceDialog;
