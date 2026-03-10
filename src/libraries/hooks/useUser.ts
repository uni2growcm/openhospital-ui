import { UserDTO } from "generated";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

export function useUser(usersList?: UserDTO[] | undefined) {
  const { t } = useTranslation();

  const users: string[] = usersList
    ? usersList.map((user) => {
        return user.userName;
      })
    : [];

  let i = 1;
  const options = useMemo(
    () =>
      users.map((item) => {
        const option = {
          value: item,
          label: t(` ${item}`),
        };
        if (option.label.includes(t(`care.user.`))) {
          option.label = item;
        }

        return option;
      }),
    []
  );

  console.log(options);

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
