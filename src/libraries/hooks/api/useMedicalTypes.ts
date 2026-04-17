import { useCallback, useMemo } from "react";
import { useAppSelector } from "../redux";
import { MedicalTypeDTO } from "~/generated";

export function useMedicalTypes() {
  const medicalTypes = useAppSelector(
    (state): MedicalTypeDTO[] => state.pharmacy.getMedicalTypes.data ?? []
  );

  const options = useMemo(
    () =>
      medicalTypes.map((medicalType: MedicalTypeDTO) => ({
        label: medicalType.description ?? "",
        value: medicalType.code ?? "",
      })),
    [medicalTypes]
  );

  const selectMedicalType = useCallback(
    (code?: string) =>
      medicalTypes.find((medicalType: MedicalTypeDTO) => medicalType.code === code),
    [medicalTypes]
  );

  return { medicalTypes, options, selectMedicalType };
}
