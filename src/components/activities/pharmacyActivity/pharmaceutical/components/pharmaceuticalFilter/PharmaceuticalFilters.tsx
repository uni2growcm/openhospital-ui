import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import "./styles.scss";

interface PharmaceuticalFiltersProps {
  nameFilter: string;
  codeFilter: string;
  typeFilter: string;
  typeOptions: string[];
  onNameFilterChange: (value: string) => void;
  onCodeFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
}

export default function PharmaceuticalFilters({
  nameFilter,
  codeFilter,
  typeFilter,
  typeOptions,
  onNameFilterChange,
  onCodeFilterChange,
  onTypeFilterChange,
}: PharmaceuticalFiltersProps) {
  const { t } = useTranslation();

  const handleTypeChange = (event: SelectChangeEvent) => {
    onTypeFilterChange(event.target.value);
  };

  return (
    <div className="pharmaceutical-filters">
      <TextField
        data-cy="pharmaceutical-name-filter"
        label={t("pharmacy.stock.pharmaceutical")}
        value={nameFilter}
        onChange={(event) => onNameFilterChange(event.target.value)}
        size="small"
        variant="outlined"
        fullWidth
      />
      <TextField
        data-cy="pharmaceutical-code-filter"
        label={t("pharmacy.stock.code")}
        value={codeFilter}
        onChange={(event) => onCodeFilterChange(event.target.value)}
        size="small"
        variant="outlined"
        fullWidth
      />
      <FormControl size="small" fullWidth>
        <InputLabel id="pharmaceutical-type-filter-label">
          {t("pharmacy.stock.type")}
        </InputLabel>
        <Select
          data-cy="pharmaceutical-type-filter"
          labelId="pharmaceutical-type-filter-label"
          id="pharmaceutical-type-filter"
          label={t("pharmacy.stock.type")}
          value={typeFilter}
          onChange={handleTypeChange}
        >
          <MenuItem value="">{t("common.all")}</MenuItem>
          {typeOptions.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
