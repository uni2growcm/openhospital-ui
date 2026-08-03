import { Autocomplete } from "components/accessories/autocomplete";
import CheckboxField from "components/accessories/checkboxField/CheckboxField";
import DateField from "components/accessories/dateField/DateField";
import TextField from "components/accessories/textField/TextField";
import { useFormik } from "formik";
import {
  formatAllFieldValues,
  getFromFields,
} from "libraries/formDataHandling/functions";
import { useAppSelector } from "libraries/hooks";
import { useAppDispatch } from "libraries/hooks/redux";
import { get, has } from "lodash";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IState } from "types";
import * as yup from "yup";
import warningIcon from "../../../../assets/warning-icon.png";
import Button from "../../button/Button";
import ConfirmationDialog from "../../confirmationDialog/ConfirmationDialog";
import "./styles.scss";
import { CareFormProps, userOption } from "./types";

const CareForm: FC<CareFormProps> = ({
  fields,
  submitButtonLabel,
  creationMode,
  resetButtonLabel,
  isLoading,
  onSubmit,
  resetFormCallback,
  shouldResetForm,
}) => {
  const { t } = useTranslation();

  const validationSchema = yup.object({
    note: yup.string().nullable(),
    plannedCare: yup.string().nullable(),
    observation: yup.boolean(),
    careDate: yup.date().required(t("common.required")),
  });

  const initialValues = getFromFields(fields, "value");

  const dispatch = useAppDispatch();

  const usersList = useAppSelector(
    (state: IState) => state.users.userList.data
  );

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const formattedValues = formatAllFieldValues(fields, values);
      const careToSave: any = {
        ...formattedValues,
        observation: isObservationChecked,
      };
      onSubmit(careToSave as any);
      setIsObservationChecked(false);
    },
  });

  const { resetForm, setFieldValue, handleBlur } = formik;

  const dateFieldHandleOnChange = useCallback(
    (fieldName: string) => (value: any) => {
      if (value) {
        // Ensure we keep a sensible time when user only picks a date.
        // If the picked date has time 00:00, default to current hours/minutes so
        // the form shows a date+time and user can update the time if needed.
        const newDate = new Date(value);
        if (newDate.getHours() === 0 && newDate.getMinutes() === 0) {
          const now = new Date();
          newDate.setHours(now.getHours(), now.getMinutes());
        }
        setFieldValue(fieldName, newDate);
      } else {
        setFieldValue(fieldName, value);
      }
      formik.setFieldTouched(fieldName);
    },
    [formik, setFieldValue]
  );

  const [openResetConfirmation, setOpenResetConfirmation] = useState(false);
  const [usersOptions, setUsersOptions] = useState<userOption[] | undefined>(
    undefined
  );
  const [isObservationChecked, setIsObservationChecked] = useState(false);

  const isValid = (fieldName: string) =>
    has(formik.touched, fieldName) && has(formik.errors, fieldName);

  const getErrorText = (fieldName: string) =>
    has(formik.touched, fieldName)
      ? (get(formik.errors, fieldName) as string)
      : "";

  const handleObservationChecked = () => {
    setIsObservationChecked(!isObservationChecked);
  };

  const handleResetConfirmation = () => {
    setOpenResetConfirmation(false);
    formik.resetForm();
    setIsObservationChecked(false);
    resetFormCallback();
  };

  const usersStatus = useAppSelector(
    (state: IState) => state.users.userList.status
  );

  useEffect(() => {
    if (!usersList || usersList.length === 0) {
      import("../../../../state/users").then((m) => {
        if (m.getUsers) dispatch(m.getUsers({}));
      });
    }

    if (usersList && usersList.length != 0) {
      setUsersOptions(
        usersList.map((user) => {
          return { value: user.userName, label: t(` ${user.userName}`) };
        })
      );
    }
  }, [usersList, dispatch]);

  useEffect(() => {
    if (!creationMode) {
      setIsObservationChecked(
        formik.values.observation === "true" ? true : false
      );
    }
  }, [creationMode, formik.values.observation]);

  useEffect(() => {
    if (shouldResetForm) {
      resetForm();
      resetFormCallback();
    }
  }, [shouldResetForm, resetForm, resetFormCallback]);

  return (
    <div className="careForm">
      <form className="careForm__form" onSubmit={formik.handleSubmit}>
        <div className="row start-sm center-xs bottom-sm">
          <div className="careForm__item">
            <DateField
              fieldName="careDate"
              fieldValue={formik.values.careDate}
              disableFuture={true}
              theme="regular"
              format="dd/MM/yyyy HH:mm"
              isValid={isValid("careDate")}
              errorText={getErrorText("careDate")}
              label={t("care.careDate")}
              onChange={dateFieldHandleOnChange("careDate")}
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="row start-sm center-xs bottom-sm">
          <div className="careForm__item">
            <Autocomplete
              id="team"
              multiple
              value={formik.values.team}
              options={usersOptions ?? []}
              onChange={(_, value) => {
                formik.setFieldValue("team", value);
              }}
              label={t("care.team")}
              placeholder={t("care.team")}
            />
          </div>
          <div className="careForm__item">
            <CheckboxField
              fieldName="observation"
              label={t("care.observation")}
              checked={isObservationChecked}
              onChange={handleObservationChecked}
            />
          </div>
          <div className="fullWidth careForm__item">
            <TextField
              label={t("care.plannedCare")}
              field={formik.getFieldProps("plannedCare")}
              theme="regular"
              isValid={isValid("plannedCare")}
              errorText={getErrorText("plannedCare")}
              onBlur={formik.handleBlur}
              disabled={isLoading}
            />
          </div>
          <div className="fullWidth careForm__item">
            <TextField
              label={t("care.note")}
              field={formik.getFieldProps("note")}
              theme="regular"
              isValid={isValid("note")}
              errorText={getErrorText("note")}
              onBlur={formik.handleBlur}
              disabled={isLoading}
              rows={5}
            />
          </div>
        </div>

        <div className="careForm__buttonSet">
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
          <div className="submit_button">
            <Button type="submit" variant="contained" disabled={isLoading}>
              {submitButtonLabel}
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
  );
};

export default CareForm;
