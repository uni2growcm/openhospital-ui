
import React, { ComponentProps, useCallback } from "react";
import {
  Control,
  Controller,
  ControllerRenderProps,
  Path,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import AutocompleteField from "../../autocompleteField/AutocompleteField";
import { LocaleKey } from "~/resources";

export type AutocompleteFormFieldProps<T extends Record<string, any>> = {
  control: Control<T>;
  name: Path<T>;
} & Omit<
  ComponentProps<typeof AutocompleteField>,
  "fieldName" | "fieldValue" | "onChange" | "onBlur" | "errorText" | "isValid"
>;

export function AutocompleteFormField<T extends Record<string, any>>({
  name,
  control,
  ...props
}: AutocompleteFormFieldProps<T>) {
  const { t } = useTranslation();

  const getErrorText = useCallback(
    (key?: string) => {
      return key ? t(key as LocaleKey) : "";
    },
    [t]
  );
  const handleChange = useCallback(
    (field: ControllerRenderProps<T, Path<T>>) => (_: object, value: any) => {
      field.onChange(value?.value);
    },
    []
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const translatedError =
          typeof fieldState.error?.message === "string"
            ? t(fieldState.error.message)
            : "";

        return (
          <AutocompleteField
            {...props}
            aria-invalid={fieldState.invalid}
            fieldName={field.name}
            fieldValue={field.value ?? ""}
            disabled={props.disabled ?? field.disabled}
            onBlur={field.onBlur}
            errorText={getErrorText(fieldState.error?.message)}
            isValid={!fieldState.invalid}
            onChange={handleChange(field)}
          />
        );
      }}
    />
  );
}
