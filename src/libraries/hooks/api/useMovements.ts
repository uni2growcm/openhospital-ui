import { LotDTO, MovementDTO } from "generated";
import { useCallback, useEffect, useMemo } from "react";
import { getMovements } from "state/pharmacy";
import { useAppDispatch, useAppSelector } from "../redux";
import { useTranslation } from "../useTranslation";

export function useMovements() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { movements, errorMessage, status } = useAppSelector((state) => ({
    movements: state.pharmacy.getMovements.data ?? [],
    errorMessage:
      state.pharmacy.getMovements.error?.message || t("errors.somethingwrong"),
    status: state.pharmacy.getMovements.status,
  }));

  const selectMedical = useCallback(
    (code: number) => {
      const matches = movements.filter(
        (movement) => movement.medical.code === code
      );
      const medical = matches?.[0]?.medical;

      return medical
        ? {
            ...medical,
            lots: matches
              .filter((movement) => movement.lot && movement.type.type === "+")
              .map((movement) => movement.lot!),
          }
        : null;
    },
    [movements]
  );

  const groupedMedicals = useMemo(() => {
    const grouped = movements.reduce((acc, current) => {
      const code = current.medical!.code!;
      const values = acc[code] ?? [];
      acc[code] = [...values, current];
      return acc;
    }, {} as Record<number, MovementDTO[]>);
    return Object.values(grouped).map((movements) => {
      const medical = movements[0].medical!;
      const lots = movements
        .map((movement) => movement.lot)
        .filter(Boolean) as LotDTO[];
      const quantity = movements.reduce((acc, current) => {
        return current.type.type === "+"
          ? acc + current.quantity
          : acc - current.quantity;
      }, 0);

      return { ...medical, lots, movements, quantity };
    });
  }, [movements]);

  useEffect(() => {
    dispatch(getMovements());
  }, [dispatch]);

  return { movements, groupedMedicals, selectMedical, errorMessage, status };
}
