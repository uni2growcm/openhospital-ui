import checkIcon from "assets/check-icon.png";
import Button from "components/accessories/button/Button";
import ConfirmationDialog from "components/accessories/confirmationDialog/ConfirmationDialog";
import DiscardButton from "components/accessories/discardButton/DiscardButton";
import InfoBox from "components/accessories/infoBox/InfoBox";
import ResetButton from "components/accessories/resetButton/resetButton";
import TextField from "components/accessories/textField/TextField";
import { useFormik } from "formik";
import { MunicipalityDTO } from "generated";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import "./styles.scss";
import { IProps } from "./types";

export const EditMunicipalityForm = ({
  initialValues,
  hasSucceeded,
  hasFailed,
  error,
  onSubmit,
  successTitle,
  successInfo,
  onSuccess,
}: IProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [showDialog, setShowDialog] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required(t("commune.nameisrequired"))
      .max(100, t("commune.nameshouldnotexceed")),
  });

  useEffect(() => {
    if (hasSucceeded) {
      setShowDialog(true);
    }
  }, [hasSucceeded]);

  const formik = useFormik<MunicipalityDTO>({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const handleDialogClose = () => {
    setShowDialog(false);
    if (onSuccess) {
      onSuccess();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="commune-form-container">
      {hasFailed && (
        <InfoBox
          type="error"
          message={error?.message || t("common.somethingwrong")}
        />
      )}

      <div className="editCommuneForm__actions">
        <DiscardButton />
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="editCommuneForm__item textfield fullwidth">
          <TextField
            field={formik.getFieldProps("name")}
            theme="regular"
            label={t("commune.name")}
            onBlur={formik.handleBlur}
            type="text"
            errorText={formik.touched.name ? formik.errors.name || "" : ""}
            maxLength={50}
            isValid={!!formik.touched.name && !!formik.errors.name}
          />
        </div>

        <div className="form-button">
          <Button type="submit" variant="contained" className="submit_button">
            {t("common.save")}
          </Button>

          <ResetButton formik={formik as any} />
        </div>
      </form>

      <ConfirmationDialog
        isOpen={showDialog}
        title={successTitle}
        icon={checkIcon}
        info={successInfo}
        primaryButtonLabel={t("common.ok")}
        handlePrimaryButtonClick={handleDialogClose}
        handleSecondaryButtonClick={() => {}}
      />
    </div>
  );
};
