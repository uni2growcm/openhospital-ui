import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const useDeathPeriodOptions = () => {
  const { t } = useTranslation();

  const deathPeriodOptions = useMemo(() => [
    { value: "BEFORE_ADMISSION", label: t("admission.deathPeriodOptions.before") },
    { value: "AFTER_ADMISSION", label: t("admission.deathPeriodOptions.after") }
  ], [t]);

  return deathPeriodOptions;
};
