import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import { get, has } from "lodash";
import React, { FC, useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { object, string } from "yup";
import { DiseaseDTO } from "../../../generated";
import {
  formatAllFieldValues,
  getFromFields,
} from "../../../libraries/formDataHandling/functions";
import { createDisease, createDiseaseReset } from "../../../state/diseases";
import { getDiseaseTypes } from "../../../state/types/diseases";
import { IState } from "../../../types";
import { getInitialFields } from "../admin/diseases/diseaseForm/consts";
import AutocompleteField from "../autocompleteField/AutocompleteField";
import Button from "../button/Button";
import CheckboxField from "../checkboxField/CheckboxField";
import { CustomModal } from "../customModal/CustomModal";
import TextField from "../textField/TextField";
import "./styles.scss";
import InfoBox from "../infoBox/InfoBox";

interface IAddDiseaseModalProps {
  open: boolean;
  onClose: () => void;
  onDiseaseCreated: (disease: DiseaseDTO) => void;
}

export const AddDiseaseModal: FC<IAddDiseaseModalProps> = ({
  open,
  onClose,
  onDiseaseCreated,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const infoBoxRef = useRef<HTMLDivElement>(null);

  const create = useAppSelector((state) => state.diseases.create);

  const diseasesTypeState = useAppSelector(
    (state: IState) => state.types.diseases.getAll
  );

  const diseasesTypeOptions = useMemo(
    () =>
      diseasesTypeState.data?.map((item) => ({
        value: item.code,
        label: item.description,
      })) ?? [],
    [diseasesTypeState.data]
  );

  const fields = getInitialFields(undefined);
  const initialValues = getFromFields(fields, "value");

  const validationSchema = object({
    code: string().required(t("common.required")),
    description: string().required(t("common.required")),
    diseaseType: string().required(t("common.required")),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const formattedValues = formatAllFieldValues(fields, values);
      formattedValues.diseaseType = diseasesTypeState.data?.find(
        (item) => item.code === values.diseaseType
      );
      dispatch(createDisease(formattedValues as any));
    },
  });

  const { setFieldValue, handleBlur, resetForm } = formik;

  const isValid = (fieldName: string): boolean => {
    return has(formik.touched, fieldName) && has(formik.errors, fieldName);
  };

  const getErrorText = (fieldName: string): string => {
    return has(formik.touched, fieldName)
      ? (get(formik.errors, fieldName) as string)
      : "";
  };

  const handleCheckboxChange = useCallback(
    (fieldName: string) => (value: boolean) => {
      setFieldValue(fieldName, value ? "true" : "false");
    },
    [setFieldValue]
  );

  const onBlurCallback = useCallback(
    (fieldName: string) =>
      (e: React.FocusEvent<HTMLDivElement>, value: string) => {
        handleBlur(e);
        setFieldValue(fieldName, value);
      },
    [handleBlur, setFieldValue]
  );

  useEffect(() => {
    if (open) {
      dispatch(getDiseaseTypes());
    }
  }, [dispatch, open]);

  useEffect(() => {
    if (create.hasSucceeded && create.data) {
      onDiseaseCreated(create.data);
      dispatch(createDiseaseReset());
      resetForm();
      onClose();
    }
  }, [create.hasSucceeded, create.data, onDiseaseCreated, onClose, dispatch, resetForm]);

  const handleClose = () => {
    dispatch(createDiseaseReset());
    resetForm();
    onClose();
  };

  return (
    <CustomModal
      title={t("disease.addDisease")}
      description={t("disease.addDisease")}
      open={open}
      onClose={handleClose}
      content={
        <div className="addDiseaseModal">
          <form
            className="addDiseaseModal__form"
            onSubmit={formik.handleSubmit}
          >
            <div className="row start-sm center-xs">
              <div className="addDiseaseModal__item">
                <TextField
                  field={formik.getFieldProps("code")}
                  theme="regular"
                  label={t("disease.code")}
                  isValid={isValid("code")}
                  errorText={getErrorText("code")}
                  onBlur={formik.handleBlur}
                  type="text"
                  disabled={create.isLoading}
                />
              </div>
              <div className="addDiseaseModal__item">
                <AutocompleteField
                  fieldName="diseaseType"
                  fieldValue={formik.values.diseaseType}
                  label={t("disease.diseaseType")}
                  isValid={isValid("diseaseType")}
                  errorText={getErrorText("diseaseType")}
                  onBlur={onBlurCallback("diseaseType")}
                  options={diseasesTypeOptions}
                  loading={diseasesTypeState.status === "LOADING"}
                  disabled={create.isLoading}
                />
              </div>
              <div className="addDiseaseModal__item">
                <TextField
                  field={formik.getFieldProps("description")}
                  theme="regular"
                  label={t("disease.name")}
                  isValid={isValid("description")}
                  errorText={getErrorText("description")}
                  onBlur={formik.handleBlur}
                  type="text"
                  disabled={create.isLoading}
                />
              </div>
            </div>
            <div className="row start-sm center-xs">
              <div className="addDiseaseModal__item addDiseaseModal__item--checkbox">
                <CheckboxField
                  fieldName="opdInclude"
                  checked={formik.values.opdInclude === "true"}
                  label={t("disease.opdInclude")}
                  onChange={handleCheckboxChange("opdInclude")}
                />
              </div>
              <div className="addDiseaseModal__item addDiseaseModal__item--checkbox">
                <CheckboxField
                  fieldName="ipdInInclude"
                  checked={formik.values.ipdInInclude === "true"}
                  label={t("disease.ipdInInclude")}
                  onChange={handleCheckboxChange("ipdInInclude")}
                />
              </div>
              <div className="addDiseaseModal__item addDiseaseModal__item--checkbox">
                <CheckboxField
                  fieldName="ipdOutInclude"
                  checked={formik.values.ipdOutInclude === "true"}
                  label={t("disease.ipdOutInclude")}
                  onChange={handleCheckboxChange("ipdOutInclude")}
                />
              </div>
            </div>
            <div className="addDiseaseModal__buttonSet">
              <Button
                type="submit"
                variant="contained"
                disabled={create.isLoading}
              >
                {t("disease.saveDisease")}
              </Button>
            </div>
            {create.hasFailed && (
              <div ref={infoBoxRef} className="info-box-container">
                <InfoBox type="error" message={create.error?.message} />
              </div>
            )}
          </form>
        </div>
      }
    />
  );
};
