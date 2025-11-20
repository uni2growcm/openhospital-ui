import { Autocomplete, TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "components/accessories/button/Button";
import React, { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import "./styles.scss";

const PharmaceuticalExpiringDialog: FunctionComponent<{
  isOpen: boolean;
  handleSecondaryButtonClick: () => void;
  handlePrimaryButtonClick: (
    period: string | null,
    month: string | null
  ) => void;
}> = ({ isOpen, handlePrimaryButtonClick, handleSecondaryButtonClick }) => {
  const { t } = useTranslation();

  const [monthSelected, setMonthSelected] = useState<string | null>(null);

  const [periodSelected, setPeriodSelected] = useState<string | null>(null);

  const periodOptions = [
    {
      label: t("pharmacy.stock.expiring.options.today"),
      value: "TODAY",
    },
    {
      label: t("pharmacy.stock.expiring.options.thisMonth"),
      value: "THISMONTH",
    },
    {
      label: t("pharmacy.stock.expiring.options.nextMonth"),
      value: "NEXTMONTH",
    },
    {
      label: t("pharmacy.stock.expiring.options.nextTwoMonths"),
      value: "NEXTTWOMONTHs",
    },
    {
      label: t("pharmacy.stock.expiring.options.specificMonth"),
      value: "SPECIFICMONTH",
    },
  ];

  const monthOptions = [
    {
      label: t("pharmacy.stock.expiring.options.january"),
      value: "JANUARY",
    },
    {
      label: t("pharmacy.stock.expiring.options.february"),
      value: "FEBRUARY",
    },
    {
      label: t("pharmacy.stock.expiring.options.march"),
      value: "MARCH",
    },
    {
      label: t("pharmacy.stock.expiring.options.april"),
      value: "APRIL",
    },
    {
      label: t("pharmacy.stock.expiring.options.may"),
      value: "SPECIFICMONTH",
    },
    {
      label: t("pharmacy.stock.expiring.options.june"),
      value: "JUNE",
    },
    {
      label: t("pharmacy.stock.expiring.options.july"),
      value: "JULY",
    },
    {
      label: t("pharmacy.stock.expiring.options.august"),
      value: "AUGUST",
    },
    {
      label: t("pharmacy.stock.expiring.options.september"),
      value: "SEPTEMBER",
    },
    {
      label: t("pharmacy.stock.expiring.options.october"),
      value: "OCTOBER",
    },
    {
      label: t("pharmacy.stock.expiring.options.november"),
      value: "NOVEMBER",
    },
    {
      label: t("pharmacy.stock.expiring.options.december"),
      value: "DECEMBER",
    },
  ];

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
        <div className="dialog__content">
          <div className="dialog__info" data-cy="dialog-info">
            {t("pharmacy.stock.expiring.info")}
          </div>
          <div className="dialog__dateField">
            <Autocomplete
              disablePortal
              options={periodOptions}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("pharmacy.stock.expiring.period")}
                  name="periodSelected"
                />
              )}
              onChange={(event, value) => {
                setPeriodSelected(value ? value.value : null);
              }}
            />
          </div>
          {periodSelected === "SPECIFICMONTH" && (
            <div className="dialog__dateField">
              <Autocomplete
                disablePortal
                options={monthOptions}
                sx={{ width: 300, overflow: "auto" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("pharmacy.stock.expiring.month")}
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
                dataCy="approve-dialog"
                type="submit"
                variant="contained"
                onClick={handleConfirm}
              >
                {t("pharmacy.stock.expiring.generate")}
              </Button>
            </div>
            <div className="reset_button">
              <Button
                dataCy="close-dialog"
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
