import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import Button from "components/accessories/button/Button";
import {
  AutocompleteFormField,
  DateFormField,
  TextFormField,
} from "components/accessories/forms";
import { MovementDTO, StockMovementsApi, WardDTO } from "generated";
import { customConfiguration } from "libraries/apiUtils/configuration";
import { DATETIME_FORMAT } from "libraries/consts";
import { useTranslation } from "libraries/hooks";
import { useMedicals, useWards } from "libraries/hooks/api";
import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { getWards } from "state/ward";
import z from "zod";
import { DischargeLotFormField } from "./DischargeLotFormField";
import { LotDTOSchema, MovementDTOSchema } from "./consts";
import "./styles.scss";
import { DisChargeMovementProps, TFormValues } from "./types";

export function DischargeMovementForm({
  movement,
  onSubmit,
  onCancel,
}: DisChargeMovementProps) {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const [medicalsWithLots, setMedicalsWithLots] = useState<Set<number>>(
    new Set()
  );

  const { medicals, options: allMedicalOptions } = useMedicals();

  console.log("All medicals:", medicals);
  console.log("Medical options:", allMedicalOptions);
  console.log("Medicals with lots:", medicalsWithLots);

  // Filtrer les options pour ne montrer que ceux avec lots
  const medicalOptions = useMemo(() => {
    return allMedicalOptions.filter((option) =>
      medicalsWithLots.has(option.value as number)
    );
  }, [allMedicalOptions, medicalsWithLots]);

  const selectMedical = useCallback(
    (code?: number) => medicals.find((m) => m.code === code),
    [medicals]
  );

  // Charger les lots pour chaque medical et noter ceux qui en ont
  useEffect(() => {
    if (medicals.length === 0) {
      return;
    }

    const api = new StockMovementsApi(customConfiguration());
    const checkMedicalsWithLots = async () => {
      const withLots = new Set<number>();
      let successCount = 0;
      let errorCount = 0;

      for (const medical of medicals) {
        if (medical.code) {
          try {
            console.log(`Loading lots for medical ${medical.code}...`);
            const lotsResponse = await api
              .getLotByMedical({ medCode: medical.code })
              .toPromise();
            const lots = Array.isArray(lotsResponse) ? lotsResponse : [];
            console.log(`Medical ${medical.code}: ${lots.length} lots`);
            if (lots && lots.length > 0) {
              withLots.add(medical.code);
              successCount++;
            }
          } catch (error) {
            errorCount++;
            console.log(`Error for medical ${medical.code}:`, error);
          }
        }
      }
      console.log(
        `Summary: ${successCount} success, ${errorCount} errors, ${withLots.size} with lots`
      );
      console.log("Medicals with lots (codes):", Array.from(withLots));
      setMedicalsWithLots(withLots);
    };

    checkMedicalsWithLots();
  }, [medicals]);

  const wardFilter = useCallback((ward: WardDTO) => !!ward.pharmacy, []);
  const wardsStatus = useAppSelector((s) => s.wards.allWards?.status);

  const { wards } = useWards(wardFilter);

  const { control, handleSubmit, setValue } = useForm<TFormValues>({
    defaultValues: {
      type: "",
      quantity: 0,
      refNo: "",
      lots: [],
      wardTo: "",
      medical: 0,
      date: new Date(),
    },
    resolver: standardSchemaResolver(MovementDTOSchema),
  });

  const values = useWatch({
    control,
  });

  const selectedMedical = useMemo(
    () => selectMedical(values.medical),
    [values.medical, selectMedical]
  );

  const wardToOptions = useMemo(
    () =>
      wards.map((w) => ({
        value: w.code ?? "",
        label: w.description ?? "",
        ...w,
      })),
    [wards]
  );

  const handleFormSubmit = useCallback(
    (data: TFormValues) => {
      if (!data.wardTo) {
        console.warn("No destination ward selected");
        return;
      }

      const filledLots =
        data.lots?.filter((lot) => lot.quantity && lot.quantity > 0) ?? [];

      if (filledLots.length === 0) {
        console.warn("No lots with quantity");
        return;
      }

      const destinationWard = wards.find((w) => w.code === data.wardTo);

      const movements: MovementDTO[] = filledLots.map((lot) => ({
        medical: medicals.find((m) => m.code === data.medical)!,
        type: { code: "discharge", description: "Discharge", type: "-" },
        date: data.date.toISOString(),
        quantity: lot.quantity!,
        ward: destinationWard,
        lot: {
          code: lot.code,
          preparationDate: lot.preparationDate.toISOString(),
          dueDate: lot.dueDate.toISOString(),
          cost: lot.cost ?? undefined,
        },
        refNo: data.refNo,
      }));

      onSubmit?.(movements);
    },
    [onSubmit, medicals, wards]
  );

  useEffect(() => {
    setValue(
      "lots",
      (selectedMedical?.lots ?? []).map((lot) => ({
        ...lot,
        preparationDate: lot.preparationDate
          ? new Date(lot.preparationDate)
          : undefined,
        dueDate: lot.dueDate ? new Date(lot.dueDate) : undefined,
        mainStoreQuantity: lot.mainStoreQuantity,
        ward: "",
        quantity: undefined,
      })) as z.infer<typeof LotDTOSchema>[]
    );
  }, [selectedMedical, setValue]);

  useEffect(() => {
    dispatch(getWards());
  }, [dispatch]);

  return (
    <div className="dischargeMovementForm">
      <form
        className="form-grid-layout  gap-2 w-full"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <DateFormField
          format={DATETIME_FORMAT}
          label={t("pharmacy.form.fields.date")}
          control={control}
          name="date"
        />
        <div className="col-span-full">
          <AutocompleteFormField
            label={t("pharmacy.form.fields.medical")}
            control={control}
            name="medical"
            options={medicalOptions}
          />
        </div>
        <TextFormField
          type="string"
          label={t("pharmacy.form.fields.refNo")}
          control={control}
          name="refNo"
        />

        <AutocompleteFormField
          control={control}
          name="wardTo"
          label={t("pharmacy.stock.ward.selectWard")}
          options={wardToOptions}
          isLoading={wardsStatus === "LOADING"}
        />

        <div className="col-start-1 col-span-full"></div>
        {selectedMedical && (
          <DischargeLotFormField
            key={selectedMedical.code}
            wards={wards}
            control={control}
          />
        )}
        <div className="col-span-full flex gap-2 justify-end">
          <Button type="reset" dataCy="reset-button" onClick={onCancel}>
            {t("pharmacy.form.fields.cancel")}
          </Button>
          <Button variant="contained" dataCy="submit-button" type="submit">
            {t("pharmacy.form.fields.discharge")}
          </Button>
        </div>
      </form>
    </div>
  );
}
