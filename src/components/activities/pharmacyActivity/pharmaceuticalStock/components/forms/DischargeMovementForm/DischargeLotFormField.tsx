import { isEmpty } from "lodash";
import React, { Fragment, useMemo } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { Trans } from "react-i18next";
import { DischargeLotFormFieldProps } from "./types";
import { useTranslation } from "~/libraries/hooks";
import { useWardOptions } from "~/libraries/hooks/api";
import { AutocompleteFormField, DateFormField, TextFormField } from "~/components/accessories/forms";
import { DATETIME_FORMAT } from "~/libraries/consts";

export function DischargeLotFormField({
  control,
  wards,
}: DischargeLotFormFieldProps) {
  const { t } = useTranslation();

  const { fields: lots } = useFieldArray({ control, name: "lots" });

  const lotsValues = useWatch({
    control,
    name: "lots",
  });

  const wardOptions = useWardOptions(wards);

  const total = useMemo(
    () =>
      lots.reduce((acc, current) => acc + (current.mainStoreQuantity ?? 0), 0),
    [lots]
  );

  return (
    <>
      <b className="col-start-1 col-span-full text-2xl">
        {t("pharmacy.lot.labels.lots")}
      </b>
      <span className="col-start-1 col-span-full text-lg mb-2">
        <Trans i18nKey="pharmacy.lot.labels.total" values={{ count: total }}>
          Total stock quantity: <b>0</b>
        </Trans>
      </span>

      {!isEmpty(lots) && (
        <span className="col-start-1 col-span-full text-lg mb-2">
          {t("pharmacy.lot.labels.existingLots")}
        </span>
      )}

      {lots?.map((lot, index) => {
        const wardValue = lotsValues?.[index]?.ward;
        return (
          <Fragment key={lot.code}>
            <TextFormField
              label={t("pharmacy.lot.fields.code")}
              control={control}
              name={`lots.${index}.code`}
              sx={{ marginTop: 1 }}
              disabled
            />

            <DateFormField
              format={DATETIME_FORMAT}
              label={t("pharmacy.lot.fields.preparationDate")}
              control={control}
              name={`lots.${index}.preparationDate`}
              disabled
            />

            <DateFormField
              format={DATETIME_FORMAT}
              label={t("pharmacy.lot.fields.dueDate")}
              control={control}
              name={`lots.${index}.dueDate`}
              disabled
            />

            <TextFormField
              type="number"
              control={control}
              name={`lots.${index}.mainStoreQuantity`}
              label={t("pharmacy.lot.fields.mainStoreQuantity")}
              disabled
            />

            <AutocompleteFormField
              label={t("pharmacy.form.fields.ward")}
              control={control}
              name={`lots.${index}.ward`}
              options={wardOptions}
            />
            <TextFormField
              label={t("pharmacy.lot.fields.cost")}
              control={control}
              name={`lots.${index}.cost`}
              sx={{ marginTop: 1 }}
              disabled
            />
            {wardValue && (
              <TextFormField
                type="number"
                label={t("pharmacy.lot.fields.quantity")}
                control={control}
                name={`lots.${index}.quantity`}
              />
            )}
            <hr className="col-span-full my-2" />
          </Fragment>
        );
      })}
    </>
  );
}
