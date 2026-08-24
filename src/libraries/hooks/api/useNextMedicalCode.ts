import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../redux";
import { getNextMedicalCode } from "state/pharmacy";

export function useNextMedicalCode(enabled: boolean) {
  const dispatch = useAppDispatch();
  const nextCode = useAppSelector(
    (state) => state.pharmacy.getNextMedicalCode.data
  );
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (enabled && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      dispatch(getNextMedicalCode());
    }
    return () => {
      hasFetchedRef.current = false;
    };
  }, [enabled, dispatch]);

  return { nextCode };
}