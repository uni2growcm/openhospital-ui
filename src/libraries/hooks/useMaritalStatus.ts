import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const useMaritalStatus = () => {
  const { t } = useTranslation();

  const useMaritalStatusOptions = useMemo(
    () => [
      {
        value: "MARRIED",
        label: t("patient.mariatalstatus.married"),
      },
      {
        value: "DIVORCED",
        label: t("patient.mariatalstatus.divorced"),
      },
      {
        value: "WIDOWED",
        label: t("patient.mariatalstatus.widowed"),
      },
      {
        value: "COHABITING",
        label: t("patient.mariatalstatus.cohabiting"),
      },
      {
        value: "OTHER",
        label: t("patient.mariatalstatus.other"),
      },
    ],
    [t]
  );

  return useMaritalStatusOptions;
};
