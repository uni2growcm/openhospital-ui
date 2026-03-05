import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

export function useVaccinationStatePev() {
  const { t } = useTranslation();
  const options = useMemo(
    () =>
      [
        "bcg",
        "polio_0",
        "penta_1_pcv_polio_1",
        "rota_1",
        "penta_2_pcv_polio_2",
        "rota_2",
        "penta_3_pcv_polio_3",
        "rota_3",
        "rr",
        "vaa",
      ].map((item) => {
        const option = {
          value: item,
          label: t(`medicalHistory.vaccinationStatePev.${item}`),
        };
        if (option.label.includes("medicalHistory.vaccinationStatePev.")) {
          option.label = item;
        }

        return option;
      }),
    [t]
  );

  const formatValues = useCallback(
    (values?: string[]) => {
      return (
        values?.map(
          (item) =>
            options.find((option) => option.value === item)?.label ?? item
        ) ?? []
      );
    },
    [options]
  );

  return { options, formatValues };
}
