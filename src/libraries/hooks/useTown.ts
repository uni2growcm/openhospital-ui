import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

export function useTown(towns: Array<string> | undefined) {
  const { t } = useTranslation();
  const townList = ["new-york", "london", "tokyo", "paris", "sydney", "dubai"];
  const townsMerged = (towns ?? []).filter((item, index, self) => self.indexOf(item) === index);
  const options = useMemo(
    () =>
      townsMerged?.map((item) => {
        const option = {
          value: item,
          label: t(`${item}`),
        };
        if (option.label.includes("")) {
          option.label = item;
        }

        return option;
      }),
    [townsMerged, t]
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
