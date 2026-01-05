import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IUpdatePasswordFormValues } from "../userProfileForm/type";
import { IState } from "types";
import { createSelector } from "@reduxjs/toolkit";
import AppHeader from "components/accessories/appHeader/AppHeader";
import { useAppSelector } from "libraries/hooks/redux";
import { useTranslation } from "react-i18next";
import { UserProfileForm } from "../userProfileForm/UserProfileForm";
import { updatePassword, updatePasswordReset } from "state/users";
import { useLocation, useNavigate } from "react-router-dom";

const appSelector = createSelector(
  (state) => state.main.authentication.data,
  (userCredentials) => ({ userCredentials })
);

export const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const authData = useSelector(
    (state: IState) => state.main.authentication.data
  );

  const { t } = useTranslation();

  const username = authData?.username || "";

  const breadcrumbMap = {
    [t("nav.userProfile")]: "",
  };

  const from = location.state?.from ?? -1;

  const { userCredentials } = useAppSelector(appSelector);

  const updatePasswordState = useSelector(
    (state: IState) =>
      state.users.updatePassword || {
        isLoading: false,
        hasSucceeded: false,
        hasFailed: false,
        error: null,
      }
  );

  const { isLoading, hasSucceeded, hasFailed, error } = updatePasswordState;

  const handleSubmit = async (values: IUpdatePasswordFormValues) => {
    const passwordDTO = {
      username: values.username,
      oldPasswd: values.oldPasswd,
      newPasswd: values.newPasswd,
      confirmPasswd: values.confirmPasswd,
    };

    try {
      await dispatch(updatePassword(passwordDTO) as any).unwrap();
    } catch (err) {
      console.error("Password update failed", err);
    }
  };

  const handleSuccessConfirm = () => {
    dispatch(updatePasswordReset());
    navigate(from, { replace: true });
  };

  return (
    <div data-cy="user-profile-page" className="page-wrapper">
      <AppHeader
        userCredentials={userCredentials}
        breadcrumbMap={breadcrumbMap}
      />

      <UserProfileForm
        username={username}
        isLoading={isLoading}
        hasSucceeded={hasSucceeded}
        hasFailed={hasFailed}
        error={error}
        onSubmit={handleSubmit}
        onSuccessConfirm={handleSuccessConfirm}
      />
    </div>
  );
};