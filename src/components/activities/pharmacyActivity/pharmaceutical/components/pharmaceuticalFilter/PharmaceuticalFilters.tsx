import { FilterAltTwoTone } from "@mui/icons-material";
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Tooltip,
} from "@mui/material";
import React, { useState } from "react";
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleTypeChange = (event: SelectChangeEvent) => {
    onTypeFilterChange(event.target.value);
  };

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div className="pharmaceutical-filters">
      <Tooltip title={t("common.filter") || "Filter"}>
        <IconButton
          aria-controls={open ? "pharmaceutical-filter-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleOpen}
          size="small"
          color={open ? "primary" : "default"}
        >
          <FilterAltTwoTone />
        </IconButton>
      </Tooltip>

      <Menu
        id="pharmaceutical-filter-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { p: 2, minWidth: 280 } }}
      >
        <Box sx={{ display: "grid", gap: 2, width: 280 }}>
          <TextField
            data-cy="pharmaceutical-name-filter"
            label={t("pharmacy.stock.pharmaceutical")}
            value={nameFilter}
            onChange={(event) => onNameFilterChange(event.target.value)}
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
          <TextField
            data-cy="pharmaceutical-code-filter"
            label={t("pharmacy.stock.code")}
            value={codeFilter}
            onChange={(event) => onCodeFilterChange(event.target.value)}
            size="small"
            variant="outlined"
            fullWidth
          />
        </Box>
      </Menu>
    </div>
  );
}
