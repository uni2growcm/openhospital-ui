import { createSelector } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux";
import { LotDTO } from "~/generated";
import { RootState } from "~/state/types";
import { getMedicalLots } from "~/state/pharmacy";

const EMPTY_LOTS: LotDTO[] = [];

export const lotsSelector = createSelector(
  (state: RootState) => state.pharmacy,
  (pharmacy) => pharmacy.medicalLots.data ?? EMPTY_LOTS
);

export function useMedicalLots(code?: number) {
  const dispatch = useAppDispatch();
  const lots = useAppSelector(lotsSelector);

  useEffect(() => {
    dispatch(getMedicalLots({ medCode: code || 0 }));
  }, [code]);

  return { lots };
}
