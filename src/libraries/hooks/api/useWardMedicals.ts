import { LotDTO, MedicalWardDTO } from "generated";
import { useCallback, useEffect, useMemo } from "react";
import { getWardMedicals } from "state/pharmacy";
import { useAppDispatch, useAppSelector } from "../redux";
import { useTranslation } from "../useTranslation";
import { useMovements } from "./useMovements";

export const computeInQuantity = (data: MedicalWardDTO[]) =>
  data.reduce((acc, current) => acc + (current.in_quantity || 0), 0);

export const computeOutQuantity = (data: MedicalWardDTO[]) =>
  data.reduce((acc, current) => acc + (current.out_quantity || 0), 0);

export function useWardMedicals(wardCode: string) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { selectMedical: selectMedicalFromMain } = useMovements();

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
      const mainMedical = selectMedicalFromMain(medical?.code ?? 0);

      if (!medical || !mainMedical) {
        return null;
      }

      const inQuantity = computeInQuantity(matches);
      const outQuantity = computeOutQuantity(matches);
      const result = {
        ...medical,
        lots: matches
          .map((wardMedical) => {
            const lot = wardMedical.id?.lot;

            return lot
              ? {
                  ...lot,
                  wardsTotalQuantity:
                    (wardMedical.in_quantity || 0) -
                    (wardMedical.out_quantity || 0),
                }
              : null;
          })
          .filter(Boolean) as LotDTO[],
        inQuantity,
        outQuantity,
        wardTotalQuantity: inQuantity - outQuantity,
        ward: wardMedicals[0].id!.ward!,
      };

      return result;
    },
    [wardMedicals, selectMedicalFromMain]
  );

  const medicals = useMemo(() => {
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

  return { wardMedicals, medicals, selectMedical, errorMessage, status };
}
