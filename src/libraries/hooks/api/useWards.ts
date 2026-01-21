import { WardDTO } from "generated";
import { useCallback, useMemo } from "react";
import { useAppSelector } from "../redux";

export type WardPredicate = (ward: WardDTO) => boolean;

export function useWards(perdicate?: WardPredicate) {
  const wards = useAppSelector((state) =>
    (state.wards.allWards.data ?? []).filter(
      (item) => perdicate?.(item) ?? true
    )
  );

  const status = useAppSelector((state) => state.wards.allWards.status);

  const options = useMemo(
    () =>
      wards.map((ward) => ({
        label: ward.description ?? "",
        value: ward.code ?? "",
      })),
    [wards]
  );

  const selectWard = useCallback(
    (code?: string) => wards.find((ward) => ward.code === code),
    [wards]
  );

  return { wards, options, selectWard, status };
}

export function useWardOptions(wards: WardDTO[]) {
  const options = useMemo(
    () =>
      wards.map((ward) => ({
        label: ward.description ?? "",
        value: ward.code ?? "",
      })),
    [wards]
  );

  return options;
}
