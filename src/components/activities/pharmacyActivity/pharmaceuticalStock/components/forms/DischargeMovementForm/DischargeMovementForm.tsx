import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo } from "react";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import Button from "~/components/accessories/button/Button";
import {
  AutocompleteFormField,
  DateFormField,
  TextFormField,
} from "~/components/accessories/forms";
import { LotDTO, MovementDTO, WardDTO } from "~/generated";
import { DATETIME_FORMAT } from "~/libraries/consts";
import { useTranslation } from "~/libraries/hooks";
import { useMovements, useWards } from "~/libraries/hooks/api";
import { useAppDispatch } from "~/libraries/hooks/redux";
import { getWards } from "~/state/wards";
import { DischargeLotFormField } from "./DischargeLotFormField";
import { MovementDTOSchema } from "./consts";
import "./styles.scss";
import { DisChargeMovementProps, TFormValues } from "./types";

export function DischargeMovementForm({
  onSubmit,
  onCancel,
}: DisChargeMovementProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { selectMedical, medicals } = useMovements();

  const wardFilter = useCallback((ward: WardDTO) => !!ward.pharmacy, []);
  const { wards } = useWards(wardFilter);

  // ✅ FORM SETUP
  const { control, handleSubmit, setValue } = useForm<TFormValues>({
    resolver: zodResolver(MovementDTOSchema),
    defaultValues: {
      date: new Date(),
      medical: 0,
      type: "",
      ward: "",
      quantity: 0,
      refNo: "",
      lots: [],
    },
  });

  // ✅ WATCH FORM VALUES (NO TYPE MUTATION)
  const values = useWatch({ control });

  // ✅ DERIVED DATA (SAFE)
  const selectedMedical = selectMedical(values.medical ?? 0);

  // ✅ SUBMIT HANDLER
  const handleFormSubmit: SubmitHandler<TFormValues> = useCallback(
    (data) => {
      const filledLots =
        data.lots?.filter(
          (lot) => lot.ward && lot.quantity && lot.quantity > 0
        ) ?? [];

      const movements: MovementDTO[] = filledLots.map((lot) => ({
        medical: medicals.find((m) => m.code === data.medical)!,
        type: { code: "discharge", description: "Discharge", type: "-" },
        date: data.date.toISOString(),
        quantity: lot.quantity!,
        ward: wards.find((w) => w.code === lot.ward),
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
    (selectedMedical?.lots ?? []).map((lot: LotDTO) => ({
      ...lot,
      preparationDate: lot.preparationDate
        ? new Date(lot.preparationDate)
        : new Date(),
      dueDate: lot.dueDate
        ? new Date(lot.dueDate)
        : new Date(),
      ward: "",
      quantity: undefined,
    }))
  );
}, [selectedMedical, setValue]);

  // ✅ OPTIONS
  const medicalOptions = useMemo(
    () =>
      medicals.map((medical) => ({
        value: medical.code?.toString() || "",
        label: medical.description || "",
      })),
    [medicals]
  );

  // ✅ FETCH WARDS
  useEffect(() => {
    dispatch(getWards());
  }, [dispatch]);

  return (
    <div className="dischargeMovementForm">
      <form
        className="form-grid-layout gap-2 w-full"
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
          label={t("pharmacy.form.fields.refNo")}
          control={control}
          name="refNo"
        />

        <div className="col-span-full" />

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