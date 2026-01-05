import { FormControl } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import AutocompleteField from "components/accessories/autocompleteField/AutocompleteField";
import Button from "components/accessories/button/Button";
import ConfirmationDialog from "components/accessories/confirmationDialog/ConfirmationDialog";
import DiscardButton from "components/accessories/discardButton/DiscardButton";
import InfoBox from "components/accessories/infoBox/InfoBox";
import ResetButton from "components/accessories/resetButton/resetButton";
import TextField from "components/accessories/textField/TextField";

import { PATHS } from "consts";
import checkIcon from "../../../../assets/check-icon.png";
import { updatePasswordSchema } from "./const";
import { IUpdatePasswordProps } from "./type";

import { UserDTO } from "generated";
import { useAppSelector } from "libraries/hooks";
import { getUserById } from "state/users";
import "./style.scss";

type FormValues = {
  userGroupName: string;
  username: string;
  oldPasswd: string;
  passwd: string;
  passwd2: string;
  desc: string;
};

export const UserProfileForm = ({
  username,
  isLoading,
  hasSucceeded,
  hasFailed,
  error,
  onSuccessConfirm,
  onSubmit,
}: IUpdatePasswordProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectedUser = useAppSelector(
    (state: any) => state.users.getById?.data
  ) as UserDTO;

  const formik = useFormik<FormValues>({
    initialValues: {
      username: "",
      userGroupName: "",
      oldPasswd: "",
      passwd: "",
      passwd2: "",
      desc: "",
    },
    validationSchema: updatePasswordSchema(t),
    enableReinitialize: true,
    onSubmit: (values) => {
      onSubmit({
        username: values.username,
        oldPasswd: values.oldPasswd,
        newPasswd: values.passwd,
        confirmPasswd: values.passwd2,
      });
    },
  });

  const {
    handleSubmit,
    handleBlur,
    getFieldProps,
    setValues,
    touched,
    errors,
  } = formik;

  const userGroupOptions = selectedUser
    ? [
        {
          value: selectedUser.userGroupName.code,
          label: `${selectedUser.userGroupName.code}${
            selectedUser.userGroupName.desc
              ? ` - ${selectedUser.userGroupName.desc}`
              : ""
          }`,
        },
      ]
    : [];

  useEffect(() => {
    if (username) {
      dispatch(getUserById(username) as any);
    }
  }, [username, dispatch]);

  useEffect(() => {
    if (selectedUser) {
      setValues({
        username: selectedUser.userName,
        userGroupName: selectedUser.userGroupName?.code ?? "",
        desc: selectedUser.desc ?? "",
        oldPasswd: "",
        passwd: "",
        passwd2: "",
      });
    }
  }, [selectedUser, setValues]);

  return (
    <div className="editUserForm">
      <div className="userProfile__title">{t("userProfile")}</div>

      <form className="editUserForm__form" onSubmit={handleSubmit}>
        <div className="row start-sm center-xs">
          {}
          <div className="editUserForm__item halfWidth">
            <TextField
              field={getFieldProps("username")}
              label={t("user.username")}
              theme="regular"
              disabled
              type="username"
              isValid={!!touched.username && !!errors.username}
              errorText={(touched.username && errors.username) || ""}
              onBlur={handleBlur}
              InputProps={{ autoComplete: "one-time-code" }}
            />
          </div>

          <div className="editUserForm__item halfWidth">
            <FormControl fullWidth>
              <AutocompleteField
                fieldName="userGroupName"
                fieldValue={formik.values.userGroupName}
                options={userGroupOptions}
                label={t("user.group")}
                disabled
                isValid={!!touched.userGroupName && !!errors.userGroupName}
                errorText={
                  (touched.userGroupName && errors.userGroupName) || ""
                }
                onBlur={handleBlur}
              />
            </FormControl>
          </div>

          <div className="editUserForm__item halfWidth">
            <TextField
              data-cy="old-password"
              field={getFieldProps("oldPasswd")}
              label={t("user.oldPassword")}
              type="password"
              theme="regular"
              isValid={!!touched.oldPasswd && !!errors.oldPasswd}
              errorText={(touched.oldPasswd && errors.oldPasswd) || ""}
              onBlur={handleBlur}
            />
          </div>

          <div className="editUserForm__item halfWidth">
            <TextField
              data-cy="new-password"
              field={getFieldProps("passwd")}
              label={t("user.password")}
              type="password"
              theme="regular"
              isValid={!!touched.passwd && !!errors.passwd}
              errorText={(touched.passwd && errors.passwd) || ""}
              onBlur={handleBlur}
            />
          </div>

          <div className="editUserForm__item halfWidth">
            <TextField
              data-cy="confirm-password"
              field={getFieldProps("passwd2")}
              label={t("user.passwordRetype")}
              type="password"
              theme="regular"
              isValid={!!touched.passwd2 && !!errors.passwd2}
              errorText={(touched.passwd2 && errors.passwd2) || ""}
              onBlur={handleBlur}
            />
          </div>

          <div className="editUserForm__item fullWidth">
            <TextField
              multiline
              rows={3}
              field={getFieldProps("desc")}
              label={t("user.description")}
              theme="regular"
              isValid={!!touched.desc && !!errors.desc}
              errorText={(touched.desc && errors.desc) || ""}
              onBlur={handleBlur}
              disabled={true}
            />
          </div>
        </div>

        {hasFailed && (
          <InfoBox
            type="error"
            message={error?.message ?? t("common.somethingwrong")}
          />
        )}

        <div className="editUserForm__buttonSet">
          <Button type="submit" variant="contained" disabled={isLoading}>
            {t("common.save")}
          </Button>
          <Button type="button" variant="outlined" onClick={() => navigate(-1)}>
            {t("common.cancel")}
          </Button>
        </div>
      </form>

      <ConfirmationDialog
        isOpen={hasSucceeded}
        title={t("user.updatedSuccessTitle")}
        icon={checkIcon}
        info={t("user.updatedSuccessMessage")}
        primaryButtonLabel="Ok"
        handlePrimaryButtonClick={onSuccessConfirm}
        handleSecondaryButtonClick={onSuccessConfirm}
      />
    </div>
  );
};
