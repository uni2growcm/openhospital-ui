import { LotDTO, MedicalWardDTO } from "generated";
import { useCallback, useEffect, useMemo } from "react";
import { getWardMedicals } from "state/pharmacy";
import { useAppDispatch, useAppSelector } from "../redux";
import { useTranslation } from "../useTranslation";

export function useWardMedicals(wardCode: string) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { wardMedicals, errorMessage, status } = useAppSelector((state) => ({
    wardMedicals: state.pharmacy.wardMedicals.data ?? [],
    errorMessage:
      state.pharmacy.wardMedicals.error?.message || t("errors.somethingwrong"),
    status: state.pharmacy.wardMedicals.status,
  }));

  const selectMedical = useCallback(
    (code: number) => {
      const matches = wardMedicals.filter(
        (wardMedical) => wardMedical.id!.medical!.code === code
      );
      const medical = matches?.[0]?.id?.medical;

      return medical
        ? {
            ...medical,
            lots: matches.map((wardMedical) => wardMedical.id!.lot),
          }
        : null;
    },
    [wardMedicals]
  );

  const groupedMedicals = useMemo(() => {
    const grouped = wardMedicals.reduce((acc, current) => {
      const code = current.id!.medical!.code!;
      const values = acc[code] ?? [];
      acc[code] = [...values, current];
      return acc;
    }, {} as Record<number, MedicalWardDTO[]>);
    return Object.values(grouped).map((wardMedicals) => {
      const medical = wardMedicals[0].id!.medical!;
      const lots = wardMedicals
        .map((wardMedical) => wardMedical.id!.lot)
        .filter(Boolean) as LotDTO[];
      const quantity = wardMedicals.reduce((acc, current) => {
        const inQuantity = current.in_quantity ?? 0;
        const outQuantity = current.out_quantity ?? 0;
        return acc + (inQuantity - outQuantity);
      }, 0);

      return { ...medical, lots, quantity };
    });
  }, [wardMedicals]);

  useEffect(() => {
    dispatch(getWardMedicals({ wardCode }));
  }, [wardCode, dispatch]);

  return { wardMedicals, groupedMedicals, selectMedical, errorMessage, status };
}
