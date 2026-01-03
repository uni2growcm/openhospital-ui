import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IUpdatePasswordFormValues } from "../userProfileForm/type";
import { IState } from "types";
import { createSelector } from "@reduxjs/toolkit";
import AppHeader from "components/accessories/appHeader/AppHeader";
import { useAppSelector } from "libraries/hooks/redux";
import { useTranslation } from "react-i18next";
import { UserProfileForm } from "../userProfileForm/UserProfileForm";
import { updatePassword } from "state/users";

 const appSelector = createSelector(
   (state) => state.main.authentication.data,
   (userCredentials) => ({ userCredentials })
 );
export const UserProfile = () => {
  const authData = useSelector(
    (state: IState) => state.main.authentication.data
  );

  const { t } = useTranslation();

  const username = authData?.username || "";

  const breadcrumbMap = {
    [t("nav.userProfile")]: "",
  };

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

  const dispatch = useDispatch();

  const handleSubmit = async (values: IUpdatePasswordFormValues) => {
    const passwordDTO = {
      username: values.username,
      oldPasswd: values.oldPasswd,
      newPasswd: values.newPasswd,
      confirmPasswd: values.confirmPasswd,
    };

    try {
      await dispatch(updatePassword(passwordDTO) as any).unwrap();
      console.log("Password updated successfully");
    } catch (err) {
      console.error("Password update failed", err);
    }
  };

  return (
    <div className="page-wrapper">
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
      />
    </div>
  );
};