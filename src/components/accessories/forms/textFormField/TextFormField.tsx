import { TextField, TextFieldProps } from "@mui/material";
import React, { ChangeEvent, useCallback } from "react";
import {
  Control,
  Controller,
  ControllerRenderProps,
  Path,
} from "react-hook-form";

export type TextFormFieldProps<T extends Record<string, any>> = {
  control: Control<T>;
  name: Path<T>;
} & Omit<TextFieldProps, "name" | "value" | "onChange">;

export function TextFormField<T extends Record<string, any>>({
  name,
  control,
  ...props
}: TextFormFieldProps<T>) {
  const handleChange = useCallback(
    (field: ControllerRenderProps<T, Path<T>>) =>
      (event: ChangeEvent<HTMLInputElement>) => {
        if (props.type === "number") {
          const value = event.target.value;
          if (value === "") {
            field.onChange("");
          } else {
            const numericValue = parseFloat(value);
            field.onChange(isNaN(numericValue) ? "" : numericValue);
          }
        } else {
          field.onChange(event);
        }
      },
    [props.type]
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...props}
          value={
            field.value === null || field.value === undefined ? "" : field.value
          }
          onChange={handleChange(field)}
          id={props.id ?? field.name}
          aria-invalid={props.error ?? fieldState.invalid}
          name={field.name}
          disabled={props.disabled ?? field.disabled}
          onBlur={props.onBlur ?? field.onBlur}
          error={props.error ?? fieldState.invalid}
          helperText={props.helperText ?? fieldState.error?.message}
          sx={{ marginTop: 1 }}
        />
      )}
    />
  );
}
