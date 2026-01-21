import { LotDTO, MovementDTO } from "generated";
import { useCallback, useEffect, useMemo } from "react";
import { getMovements } from "state/pharmacy";
import { useAppDispatch, useAppSelector } from "../redux";
import { useTranslation } from "../useTranslation";

function computeQuantityForType(movements: MovementDTO[], type: "+" | "-") {
  return movements
    .filter((movement) => movement.type.type === type)
    .reduce((acc, current) => {
      return acc + current.quantity;
    }, 0);
}

function computeQuantity(movements: MovementDTO[]) {
  return (
    computeQuantityForType(movements, "+") -
    computeQuantityForType(movements, "-")
  );
}

function computeLotsFromMovements(movements: MovementDTO[]) {
  const allLots = movements
    .map((movement) => movement.lot)
    .filter(Boolean) as LotDTO[];
  const lotsCodes = allLots
    .map((lot) => lot.code)
    .reduce(
      (acc, current) => (acc.includes(current) ? acc : [...acc, current]),
      [] as string[]
    );

  const lots = lotsCodes.map((code) => {
    const lot = allLots.find((item) => item.code === code)!;
    return {
      ...lot,
      mainStoreQuantity: computeQuantity(
        movements.filter((movement) => movement.lot?.code === lot.code)
      ),
    };
  });

  return lots;
}

export function useMovements() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { movements, errorMessage, status } = useAppSelector((state) => ({
    movements: state.pharmacy.getMovements.data ?? [],
    errorMessage:
      state.pharmacy.getMovements.error?.message || t("errors.somethingwrong"),
    status: state.pharmacy.getMovements.status,
  }));

  const medicals = useMemo(() => {
    const grouped = movements.reduce((acc, current) => {
      const code = current.medical!.code!;
      const values = acc[code] ?? [];
      acc[code] = [...values, current];
      return acc;
    }, {} as Record<number, MovementDTO[]>);
    return Object.values(grouped).map((movements) => {
      const medical = movements[0].medical!;
      return {
        ...medical,
        lots: computeLotsFromMovements(movements),
        movements,
        quantity: computeQuantity(movements),
      };
    });
  }, [movements]);

  const selectMedical = useCallback(
    (code: number) => {
      return medicals.find((medical) => medical.code === code);
    },
    [medicals]
  );

  useEffect(() => {
    dispatch(getMovements());
  }, [dispatch]);

  return { movements, medicals, selectMedical, errorMessage, status };
}
