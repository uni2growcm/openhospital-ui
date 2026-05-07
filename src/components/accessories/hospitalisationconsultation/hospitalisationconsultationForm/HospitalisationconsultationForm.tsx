import { Autocomplete } from "components/accessories/autocomplete";
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
import moment from "moment";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IState } from "types";
import * as yup from "yup";
import warningIcon from "../../../../assets/warning-icon.png";
import { HospitalizationConsultationDTO } from "../../../../generated";
import "./styles.scss";
import { HospitalisationconsultationFormProps } from "./types";
import ConfirmationDialog from "../../confirmationDialog/ConfirmationDialog";
import Button from "../../button/Button";

const HospitalisationconsultationForm: FC<HospitalisationconsultationFormProps> = ({
  fields,
  submitButtonLabel,
  creationMode = true,
  resetButtonLabel,
  isLoading = false,
  onSubmit,
  resetFormCallback,
  shouldResetForm,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const usersList = useAppSelector(
    (state: IState) => state.users.userList.data
  );

  const diseasesList = useAppSelector(
    (state: IState) => state.diseases.allDiseases.data
  );

  const validationSchema = yup.object({
    dateTime: yup
      .string()
      .required(t("common.required"))
      .test({
        name: "dateTime",
        message: t("common.invaliddate"),
        test: function (value) {
          return moment(value).isValid();
        },
      }),
    teams: yup.array().of(yup.string()).nullable(),
    parentComplaints: yup.string().nullable(),
    physicalExamination: yup.string().nullable(),
    diagnosis: yup.array().of(yup.string()).nullable(),
    managementPlan: yup.string().nullable(),
  });

  const fieldValues = getFromFields(fields, "value");
  const initialValues = {
    dateTime: fieldValues.dateTime,
    teams: fieldValues.teams 
      ? (typeof fieldValues.teams === 'string' 
          ? fieldValues.teams.split(',').filter(t => t.trim()) 
          : fieldValues.teams)
      : [],
    parentComplaints: fieldValues.parentComplaints,
    physicalExamination: fieldValues.physicalExamination,
    diagnosis: fieldValues.diagnosis 
      ? (typeof fieldValues.diagnosis === 'string' 
          ? fieldValues.diagnosis.split(',').filter(t => t.trim()) 
          : fieldValues.diagnosis)
      : [],
    managementPlan: fieldValues.managementPlan,
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const formattedValues = {
        ...formatAllFieldValues(fields, values),
        teams: values.teams ? values.teams.join(', ') : null,
        diagnosis: values.diagnosis ? values.diagnosis.join(', ') : null
      };
      onSubmit(formattedValues as HospitalizationConsultationDTO);
    },
  });

  const { resetForm, setFieldValue, handleBlur } = formik;

  const dateFieldHandleOnChange = useCallback(
    (fieldName: string) => (value: any) => {
      if (value) {
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
  const [usersOptions, setUsersOptions] = useState<{ value: string; label: string }[] | undefined>(
    undefined
  );
  const [diseasesOptions, setDiseasesOptions] = useState<{ value: string; label: string }[] | undefined>(
    undefined
  );

  const isValid = (fieldName: string) =>
    has(formik.touched, fieldName) && has(formik.errors, fieldName);

  const getErrorText = (fieldName: string) =>
    has(formik.touched, fieldName)
      ? (get(formik.errors, fieldName) as string)
      : "";

  const usersStatus = useAppSelector(
    (state: IState) => state.users.userList.status
  );

  const handleResetConfirmation = () => {
    setOpenResetConfirmation(false);
    formik.resetForm();
    resetFormCallback?.();
  };

  useEffect(() => {
    if (shouldResetForm) {
      resetForm();
      resetFormCallback?.();
    }
  }, [shouldResetForm, resetForm, resetFormCallback]);

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
    if (!diseasesList || diseasesList.length === 0) {
      import("../../../../state/diseases").then((m) => {
        if (m.getAllDiseases) dispatch(m.getAllDiseases());
      });
    }

    if (diseasesList && diseasesList.length != 0) {
      setDiseasesOptions(
        diseasesList.map((disease) => {
          return { value: disease.description, label: disease.description };
        })
      );
    }
  }, [diseasesList, dispatch]);

  return (
    <div className="hospitalisationconsultationForm">
      <h5 className="formInsertMode">
        {creationMode
          ? t("hospitalisationconsultation.new")
          : t("hospitalisationconsultation.edit")}
      </h5>
      <form
        className="hospitalisationconsultationForm__form"
        onSubmit={formik.handleSubmit}
      >
        <div className="row start-sm center-xs">
          <div className="hospitalisationconsultationForm__item">
            <DateField
              fieldName="dateTime"
              fieldValue={formik.values.dateTime}
              disableFuture={true}
              theme="regular"
              format="dd/MM/yyyy HH:mm"
              isValid={isValid("dateTime")}
              errorText={getErrorText("dateTime")}
              label={t("hospitalisationconsultation.dateTime")}
              onChange={dateFieldHandleOnChange("dateTime")}
              disabled={isLoading}
            />
          </div>
          <div className="hospitalisationconsultationForm__item">
            <Autocomplete
              id="teams"
              multiple
              value={formik.values.teams}
              options={usersOptions ?? []}
              onChange={(_, value) => {
                formik.setFieldValue("teams", value);
              }}
              label={t("hospitalisationconsultation.teams")}
              placeholder={t("hospitalisationconsultation.teams")}
            />
          </div>
        </div>

        <div className="row start-sm center-xs">
          <div className="fullWidth hospitalisationconsultationForm__item">
            <TextField
              field={formik.getFieldProps("parentComplaints")}
              theme="regular"
              label={t("hospitalisationconsultation.parentComplaints")}
              multiline={true}
              type="text"
              isValid={isValid("parentComplaints")}
              errorText={getErrorText("parentComplaints")}
              onBlur={formik.handleBlur}
              rows={3}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="row start-sm center-xs">
          <div className="fullWidth hospitalisationconsultationForm__item">
            <TextField
              field={formik.getFieldProps("physicalExamination")}
              theme="regular"
              label={t("hospitalisationconsultation.physicalExamination")}
              multiline={true}
              type="text"
              isValid={isValid("physicalExamination")}
              errorText={getErrorText("physicalExamination")}
              onBlur={formik.handleBlur}
              rows={5}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="row start-sm center-xs">
          <div className="fullWidth hospitalisationconsultationForm__item">
            <Autocomplete
              id="diagnosis"
              multiple
              value={formik.values.diagnosis}
              options={diseasesOptions ?? []}
              onChange={(_, value) => {
                formik.setFieldValue("diagnosis", value);
              }}
              label={t("hospitalisationconsultation.diagnosis")}
              placeholder={t("hospitalisationconsultation.diagnosis")}
            />
          </div>
        </div>

        <div className="row start-sm center-xs">
          <div className="fullWidth hospitalisationconsultationForm__item">
            <TextField
              field={formik.getFieldProps("managementPlan")}
              theme="regular"
              label={t("hospitalisationconsultation.managementPlan")}
              multiline={true}
              type="text"
              isValid={isValid("managementPlan")}
              errorText={getErrorText("managementPlan")}
              onBlur={formik.handleBlur}
              rows={5}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="hospitalisationconsultationForm__buttonSet">
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
  );
};

export default HospitalisationconsultationForm;