import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

export function useOccupation(occupations: Array<string> | undefined) {
  const { t } = useTranslation();
  const occupationsMerged = (occupations ?? []).filter((item, index, self) => self.indexOf(item) === index);
  const options = useMemo(
    () =>
      occupationsMerged?.map((item) => {
        const option = {
          value: item,
          label: t(`${item}`),
        };
        if (option.label.includes("")) {
          option.label = item;
        }

        return option;
      }),
    [occupationsMerged, t]
  );

  const formatValues = useCallback(
    (values?: string[]) => {
      return (
        values?.map(
          (item) =>
            options?.find((option) => option.value === item)?.label ?? item
        ) ?? []
      );
    },
    [options]
  );

  return { options, formatValues };
}
