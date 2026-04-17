import { useCallback, useEffect, useMemo } from "react";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useForm } from "react-hook-form";
import Button from "~/components/accessories/button/Button";
import { AutocompleteFormField, TextFormField } from "~/components/accessories/forms";
import { MedicalWardDTO, MovementWardDTO } from "~/generated";
import { useTranslation } from "~/libraries/hooks";
import { useAppDispatch, useAppSelector } from "~/libraries/hooks/redux";
import {
  MedicalWardDTOSchema,
  QuantityErrorKey,
  ReasonErrorKey,
  getInitialValues,
} from "./consts";
import "./styles.scss";
import { PharmaceuticalStockFormProps, TFormValues } from "./types";
import { getMedicals } from "~/state/pharmacy";

function RectifyQuantityForm({
  pharmaceutical,
  onSubmit,
  loading,
  onClose,
}: PharmaceuticalStockFormProps) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { control, watch, formState, handleSubmit } = useForm<TFormValues>({
    defaultValues: getInitialValues(pharmaceutical),
    resolver: standardSchemaResolver(MedicalWardDTOSchema),
  });

  const medicalOptions = useMemo(() => {
    if (!(pharmaceutical as any)?.description) return [];
    return [
      {
        label: (pharmaceutical as any)?.description,
        value: `${(pharmaceutical as any)?.code} - ${
          (pharmaceutical as any)?.description
        }`,
      },
    ];
  }, [pharmaceutical]);

  const values = watch();

  const pharma: any = pharmaceutical;
  const selectedMedical = useAppSelector((state) =>
    state.pharmacy.wardMedicals.data?.find(
      (med: MedicalWardDTO) =>
        med.id?.medical.code === pharma.code &&
        med.id?.ward.code === pharma.wardCode
    )
  );

  const onValidSubmit = useCallback(
    (values: TFormValues) => {
      if (!selectedMedical?.id?.ward || !selectedMedical?.id?.medical) {
        return;
      }

      const actualQty = values.actualQuantity;
      const newQty = values.quantity;
      const movementQty = actualQty - newQty;

      if (movementQty === 0) return;

      const payload: MovementWardDTO = {
        ward: selectedMedical.id.ward,
        medical: selectedMedical.id.medical,
        lot: selectedMedical.id.lot,
        date: new Date().toISOString(),
        description: values.reason || "",
        quantity: movementQty,
        units: t("pharmacy.stock.ward.pieces"),
      };

      onSubmit?.(payload);
    },
    [onSubmit, selectedMedical, t]
  );

  useEffect(() => {
    dispatch(getMedicals());
  }, [dispatch]);

  return (
    <div className="rectifyStockForm">
      <form
        className="form-grid-layout gap-2 w-full"
        onSubmit={handleSubmit(onValidSubmit)}
      >
        <span className="col-span-full text-lg">
          {t("pharmacy.stock.ward.inStock")}: {values.actualQuantity}
        </span>

        <AutocompleteFormField
          className="col-span-full"
          label={t("pharmacy.stock.ward.medical")}
          name="medical"
          control={control}
          options={medicalOptions}
          disabled
        />

        <div className="col-start-1 col-span-full" />
        <div className="col-span-full flex gap-2">
          <TextFormField
            type="number"
            name="actualQuantity"
            label={t("pharmacy.stock.ward.actualQuantity")}
            control={control}
            disabled
          />

          <TextFormField
            type="number"
            name="quantity"
            label={t("pharmacy.stock.ward.quantity")}
            control={control}
            error={!!formState.errors.quantity}
            helperText={
              formState.errors.quantity?.message
                ? t(formState.errors.quantity.message as QuantityErrorKey)
                : undefined
            }
          />
        </div>
        <div className="col-start-1 col-span-full" />

        <TextFormField
          name="reason"
          label={t("pharmacy.stock.ward.reason")}
          control={control}
          multiline
          className="col-span-full"
          error={!!formState.errors.reason}
          helperText={
            formState.errors.reason?.message
              ? t(formState.errors.reason.message as ReasonErrorKey)
              : undefined
          }
        />

        <div className="col-start-1 col-span-full" />

        <div className="col-span-full flex gap-2 justify-end">
          <Button
            type="reset"
            dataCy="reset-button"
            onClick={onClose}
            disabled={loading}
          >
            {t("common.cancel")}
          </Button>

          <Button
            variant="contained"
            dataCy="submit-button"
            type="submit"
            disabled={loading}
          >
            {t("common.confirm")}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default RectifyQuantityForm;
