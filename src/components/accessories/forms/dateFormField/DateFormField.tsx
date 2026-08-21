import DateField from "components/accessories/dateField/DateField";
import { isValid } from "date-fns";
import { useTranslation } from "libraries/hooks";
import React, { ComponentProps, useCallback } from "react";
import { Control, Controller, Path } from "react-hook-form";
import { LocaleKey } from "resources/types";

export type DateFormFieldProps<T extends Record<string, any>> = {
  control: Control<T>;
  name: Path<T>;
} & Omit<
  ComponentProps<typeof DateField>,
  "fieldName" | "fieldValue" | "onChange" | "errorText" | "isValid"
>;

export function DateFormField<T extends Record<string, any>>({
  name,
  control,
  ...props
}: DateFormFieldProps<T>) {
  const { t } = useTranslation();
  const getErrorText = useCallback(
    (key?: string) => (key ? t(key as LocaleKey) : ""),
    [t]
  );
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <DateField
          {...props}
          aria-invalid={fieldState.invalid}
          fieldName={field.name}
          fieldValue={
            (field.value as any) instanceof Date && isValid(field.value)
              ? field.value.toISOString()
              : field.value ?? ""
          }
          disabled={props.disabled ?? field.disabled}
          onChange={field.onChange}
          errorText={getErrorText(fieldState.error?.message)}
          isValid={!fieldState.invalid}
        />
      )}
    />
  );
}
