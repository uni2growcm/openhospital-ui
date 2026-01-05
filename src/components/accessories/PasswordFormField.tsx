import React, { useState } from "react";
import {
  TextField as MuiTextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FieldInputProps } from "formik";

interface PasswordFieldProps {
  label: string;
  field: FieldInputProps<any>;
  error?: string;
  isValid?: boolean;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  "data-cy"?: string;
}

const PasswordFormField: React.FC<PasswordFieldProps> = ({
  label,
  field,
  error,
  isValid,
  onBlur,
  "data-cy": dataCy,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggle = () => setShowPassword((prev) => !prev);
  const handleMouseDown = (event: React.MouseEvent) => event.preventDefault();

  return (
    <MuiTextField
      {...field}
      label={label}
      type={showPassword ? "text" : "password"}
      fullWidth
      error={!!error && !!isValid}
      helperText={error || ""}
      onBlur={onBlur}
      data-cy={dataCy}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={handleToggle}
              onMouseDown={handleMouseDown}
              edge="end"
              size="large"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordFormField;
