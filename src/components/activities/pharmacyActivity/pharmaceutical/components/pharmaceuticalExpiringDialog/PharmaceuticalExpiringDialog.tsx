import { Autocomplete, TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React, { FunctionComponent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import "./styles.scss";
import {
  ExperingPeriod,
  ExpiringMonth,
  PharmaceuticalExpiringDialogProps,
} from "./type";
import Button from "~/components/accessories/button/Button";

const PharmaceuticalExpiringDialog: FunctionComponent<
  PharmaceuticalExpiringDialogProps
> = ({ isOpen, handlePrimaryButtonClick, handleSecondaryButtonClick }) => {
  const { t } = useTranslation();

  const [monthSelected, setMonthSelected] = useState<string | null>(null);

  const [periodSelected, setPeriodSelected] = useState<string>(
    ExperingPeriod.TODAY
  );

  const periodOptions = useMemo(
    () =>
      [
        ExperingPeriod.TODAY,
        ExperingPeriod.THISMONTH,
        ExperingPeriod.NEXTMONTH,
        ExperingPeriod.NEXTTWOMONTHS,
        ExperingPeriod.SPECIFICMONTH,
      ].map((period) => ({
        label: t(`pharmacy.stock.expiring.options.${period.toLowerCase()}`),
        value: period,
      })),
    [t]
  );
  const monthOptions = useMemo(
    () =>
      [
        ExpiringMonth.JANUARY,
        ExpiringMonth.FEBRUARY,
        ExpiringMonth.MARCH,
        ExpiringMonth.APRIL,
        ExpiringMonth.MAY,
        ExpiringMonth.JUNE,
        ExpiringMonth.JULY,
        ExpiringMonth.AUGUST,
        ExpiringMonth.SEPTEMBER,
        ExpiringMonth.OCTOBER,
        ExpiringMonth.NOVEMBER,
        ExpiringMonth.DECEMBER,
      ].map((month) => ({
        label: t(`common.months.${month.toLowerCase()}`),
        value: month,
      })),
    [t]
  );

  const handleConfirm = () => {
    handlePrimaryButtonClick(periodSelected, monthSelected);
    handleSecondaryButtonClick();
  };

  return (
    <Dialog
      open={isOpen}
      PaperProps={{
        style: {
          overflow: "visible",
        },
      }}
    >
      <DialogTitle>
        <div data-cy="dialog-title" className="dialog__title">
          {t("pharmacy.stock.expiring.title")}
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="dialog__content" data-cy="dialog-content">
          <div className="dialog__info" data-cy="dialog-info">
            {t("pharmacy.stock.expiring.info")}
          </div>
          <div className="dialog__dateField">
            <Autocomplete
              id="periodSelected"
              disablePortal
              options={periodOptions}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("pharmacy.stock.expiring.period")}
                  data-cy="periodSelected"
                  name="periodSelected"
                />
              )}
              onChange={(event, value) => {
                setPeriodSelected(value ? value.value : ExperingPeriod.TODAY);
              }}
            />
          </div>
          {periodSelected === "SPECIFICMONTH" && (
            <div className="dialog__dateField">
              <Autocomplete
                id="monthSelected"
                disablePortal
                options={monthOptions}
                sx={{ width: 300, overflow: "auto" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("pharmacy.stock.expiring.month")}
                    data-cy="monthSelected"
                    name="monthSelected"
                  />
                )}
                onChange={(event, value) => {
                  setMonthSelected(value ? value.value : null);
                }}
              />
            </div>
          )}

          <div className="dialog__buttonSet" data-cy="dialog-button-set">
            <div data-cy="dialog-return-button" className="return_button">
              <Button
                dataCy="generate-expiring-button"
                type="submit"
                variant="contained"
                onClick={handleConfirm}
              >
                {t("pharmacy.stock.expiring.generate")}
              </Button>
            </div>
            <div className="reset_button">
              <Button
                dataCy="close-dialog-button"
                type="reset"
                variant="text"
                onClick={handleSecondaryButtonClick}
              >
                {t("pharmacy.stock.expiring.close")}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PharmaceuticalExpiringDialog;
