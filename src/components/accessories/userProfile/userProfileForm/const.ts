import { TFunction } from "react-i18next";
import * as Yup from "yup";

export const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

export const updatePasswordSchema = (t: TFunction) =>
  Yup.object({
    username: Yup.string().required(),
    oldPasswd: Yup.string().required(t("user.oldPasswordRequired")),
    passwd: Yup.string()
      .required(t("user.newPasswordRequired"))
      .min(5, t("user.passwordTooShort"))
      .matches(passwordRules, t("user.passwordTooWeak")),
    passwd2: Yup.string()
      .oneOf([Yup.ref("passwd")], t("user.ConfirmPasswordMustMatch"))
      .required(t("user.confirmPasswordRequired")),
  });