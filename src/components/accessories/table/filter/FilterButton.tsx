import { FilterAltTwoTone } from "@mui/icons-material";
import { IconButton, Menu } from "@mui/material";
import classnames from "classnames";
import { useFormik } from "formik";
import { get, has } from "lodash";
import React, {
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { object, string } from "yup";
import {
  formatAllFieldValues,
  getFromFields,
} from "../../../../libraries/formDataHandling/functions";
import { TFields } from "../../../../libraries/formDataHandling/types";
import AutocompleteField from "../../autocompleteField/AutocompleteField";
import DateField from "../../dateField/DateField";
import TextField from "../../textField/TextField";
import classes from "./FilterButton.module.scss";
import { IOwnProps, TFilterFormFieldName } from "./types";

export const FilterButton = ({ field, onChange }: IOwnProps) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuId = useMemo(() => `filter-menu-${field.key}`, [field.key]);

  const fields: TFields<TFilterFormFieldName> = useMemo(() => {
    return {
      value: {
        type:
          field.type === "number" || field.type === "boolean"
            ? field.type
            : "text",
        value: "",
      },
      min: { type: field.type === "number" ? "number" : "text", value: "" },
      max: { type: field.type === "number" ? "number" : "text", value: "" },
    };
  }, [field.type]);

  const validationSchema = useMemo(() => {
    const baseSchema = object({
      value: string(),
      min: string(),
      max: string(),
    });

    if (field.type === "number") {
      return baseSchema.test(
        "min-max-comparison",
        t("common.minMaxRangeError"),
        function (values) {
          const { min, max } = values as Record<string, string>;
          const minValue = min?.toString().trim();
          const maxValue = max?.toString().trim();

          if (
            minValue &&
            maxValue &&
            Number(minValue) > Number(maxValue)
          ) {
            return this.createError({
              path: "max",
              message: t("common.minMaxRangeError", {
                min: minValue,
                max: maxValue,
              }),
            });
          }

          return true;
        }
      );
    }

    return baseSchema;
  }, [field.type, t]);

  const formik = useFormik({
    initialValues: getFromFields(fields, "value"),
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const formattedValues = formatAllFieldValues(fields, values);

      const value = values.value ?? "";
      const min = values.min ?? "";
      const max = values.max ?? "";

      onChange({
        value: value.length === 0 ? undefined : formattedValues.value,
        min: min.length === 0 ? undefined : formattedValues.min,
        max: max.length === 0 ? undefined : formattedValues.max,
      } as any);
    },
  });

  const handleDateFieldChange = useCallback(
    (fieldName: string) => (value: any) => {
      formik.setFieldValue(fieldName, value);
      formik.setFieldTouched(fieldName);
    },
    [formik]
  );

  const handleAutocompleteChange = useCallback(
    (_event: any, value: any | null) => {
      const selectedValue = value?.value ?? value ?? "";
      formik.setFieldValue("value", selectedValue);
      formik.setFieldTouched("value", true);

      if (field.type === "select") {
        formik.submitForm();
      }
    },
    [field.type, formik]
  );

  const onBlurCallback = useCallback(
    (fieldName: string) =>
      (e: React.FocusEvent<HTMLDivElement>, value: string) => {
        formik.handleBlur(e);
        formik.setFieldValue(fieldName, value);
      },
    [formik]
  );

  const isValid = (fieldName: string): boolean => {
    return has(formik.touched, fieldName) && has(formik.errors, fieldName);
  };

  const getErrorText = (fieldName: string): string => {
    return has(formik.touched, fieldName)
      ? (get(formik.errors, fieldName) as string)
      : "";
  };

  const { submitForm, values } = formik;

  const isFilterActive = useMemo(
    () =>
      [values.value, values.min, values.max].some(
        (value) => value !== undefined && value !== ""
      ),
    [values.value, values.min, values.max]
  );

  const shouldAutoSubmit = field.type !== "select";

  useEffect(() => {
    if (!shouldAutoSubmit) {
      return;
    }

    const timeoutId = setTimeout(() => {
      submitForm();
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [submitForm, values, shouldAutoSubmit]);

  return (
    <div>
      <IconButton
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <FilterAltTwoTone
          className={classnames(classes.icon, {
            [classes.filtered]: isFilterActive,
          })}
          fontSize="small"
        />
      </IconButton>
      <Menu
        id="filter-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <div className={classes.filterButton}>
          <span className={classes.label}>{t("common.filter")}</span>
          {(field.type === "text" || field.type === "number") && (
            <TextField
              field={formik.getFieldProps("value")}
              theme="regular"
              label={field.label}
              isValid={isValid("value")}
              errorText={getErrorText("value")}
              onBlur={formik.handleBlur}
              type={field.type}
            />
          )}
          {field.type === "boolean" && (
            <AutocompleteField
              fieldName="value"
              fieldValue={formik.values.value}
              label={field.label}
              isValid={isValid("value")}
              errorText={getErrorText("value")}
              options={[
                { value: "", label: t("common.all") },
                { value: "true", label: t("common.yes") },
                { value: "false", label: t("common.no") },
              ]}
              onBlur={onBlurCallback("value")}
            />
          )}
          {field.type === "select" && (
            <AutocompleteField
              fieldName="value"
              fieldValue={formik.values.value}
              label={field.label}
              isValid={isValid("value")}
              errorText={getErrorText("value")}
              options={[
                { value: "", label: t("common.all") },
                ...field.options,
              ]}
              onChange={handleAutocompleteChange}
              onBlur={onBlurCallback("value")}
            />
          )}
          {field.type === "number" && (
            <>
              <TextField
                field={formik.getFieldProps("min")}
                theme="regular"
                label={t("common.min")}
                isValid={isValid("min")}
                errorText={getErrorText("min")}
                onBlur={formik.handleBlur}
                type="number"
              />
              <TextField
                field={formik.getFieldProps("max")}
                theme="regular"
                label={t("common.max")}
                isValid={isValid("max")}
                errorText={getErrorText("max")}
                onBlur={formik.handleBlur}
                type="number"
              />
            </>
          )}
          {field.type === "date" && (
            <>
              <DateField
                fieldName="min"
                fieldValue={formik.values.min}
                disableFuture={false}
                theme="regular"
                format="dd/MM/yyyy"
                isValid={isValid("min")}
                errorText={getErrorText("min")}
                label={t("common.min")}
                onChange={handleDateFieldChange("min")}
                disabled={false}
              />
              <DateField
                fieldName="max"
                fieldValue={formik.values.max}
                disableFuture={false}
                theme="regular"
                format="dd/MM/yyyy"
                isValid={isValid("max")}
                errorText={getErrorText("max")}
                label={t("common.max")}
                onChange={handleDateFieldChange("max")}
                disabled={false}
              />
            </>
          )}
        </div>
      </Menu>
    </div>
  );
};
