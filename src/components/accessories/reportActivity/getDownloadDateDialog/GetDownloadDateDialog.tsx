import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "components/accessories/button/Button";
import DateField from "components/accessories/dateField/DateField";
import moment from "moment";
import React, { FunctionComponent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import "./styles.scss";
import { IProps } from "./types";
import { Autocomplete, TextField } from "@mui/material";

const GetDownloadDateDialog: FunctionComponent<
  IProps
> = ({
  option,
  isOpen,
  title,
  loading = false,
  primaryButtonLabel,
  secondaryButtonLabel,
  handlePrimaryButtonClick,
  handleSecondaryButtonClick,
}) => {
  const { t, i18n } = useTranslation();
  const today = new Date();
  const [dateTo, setDateTo] = useState<string>(
    moment(today).format("YYYY-MM-DDTHH:mm:ss")
  );
  const [dateFrom, setDateFrom] = useState<string>(
    moment(today).format("YYYY-MM-DDTHH:mm:ss")
  );
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(
    today.getMonth()
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    today.getFullYear().toString()
  );

  const monthOptions = useMemo(
    () =>
      Array.from({ length: 12 }, (_, index) =>
        new Intl.DateTimeFormat(i18n.language || "en", { month: "long" }).format(
          new Date(2020, index, 1)
        )
      ),
    [i18n.language]
  );

  const yearOptions = useMemo(
    () =>
      Array.from(
        { length: new Date().getFullYear() - 2010 + 1 },
        (_, i) => (2010 + i).toString()
      ),
    []
  );

  const handleDateTo = (dateTo: Date | null) => {
    if (dateTo) {
      setDateTo(
        moment(dateTo).isValid()
          ? moment(dateTo).format("YYYY-MM-DDTHH:mm:ss")
          : ""
      );
    }
  };

  const handleDateFrom = (dateFrom: Date | null) => {
    if (dateFrom) {
      setDateFrom(
        moment(dateFrom).isValid()
          ? moment(dateFrom).format("YYYY-MM-DDTHH:mm:ss")
          : ""
      );
    }
  };

  const handleConfirm = () => {
    const date = new Date().toISOString();
    if (option === "date-range") {
      handlePrimaryButtonClick({
        date,
        dateTo,
        dateFrom,
      });
    } else {
      const month = monthOptions[selectedMonthIndex] ?? "";
      handlePrimaryButtonClick({
        date,
        month,
        year: selectedYear,
      });
      handleSecondaryButtonClick();
    }
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
          {title}
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="dialog__content">
          <div className="dialog__divider" />
          { option === "month-year" && (
            <div className="dialog__dateField">
              <Autocomplete
                options={monthOptions}
                value={monthOptions[selectedMonthIndex]}
                onChange={(event, newValue) => {
                  const index = monthOptions.findIndex((month) => month === newValue);
                  setSelectedMonthIndex(index >= 0 ? index : today.getMonth());
                }}
                renderInput={(params) => (
                  <TextField {...params} label={t("reports.selectMonth")} />
                )}
              />
              <Autocomplete
                options={yearOptions}
                value={selectedYear}
                onChange={(event, newValue) =>
                  setSelectedYear(newValue ?? today.getFullYear().toString())
                }
                renderInput={(params) => (
                  <TextField {...params} label={t("reports.selectYear")} />
                )}
                style={{ marginTop: 15 }}
              />
            </div>
          )}

          { option === "date-range" && (
            <div className="dialog__dateField">
              <DateField
                fieldName="dateFrom"
                fieldValue={dateFrom ?? ""}
                disableFuture={true}
                theme="regular"
                format="dd/MM/yyyy HH:mm"
                label={t("reports.selectDateFrom")}
                onChange={(dateFrom: Date | null) =>
                  handleDateFrom(dateFrom ? dateFrom : null)
                }
                disabled={false}
                isValid={false}
                errorText=""
              />
              <DateField
                fieldName="dateTo"
                fieldValue={dateTo ?? ""}
                theme="regular"
                format="dd/MM/yyyy HH:mm"
                label={t("reports.selectDateTo")}
                onChange={(dateTo: Date | null) =>
                  handleDateTo(dateTo ? dateTo : null)
                }
                disabled={false}
                isValid={false}
                errorText=""
              />
            </div>
          )}

          <div className="dialog__buttonSet" data-cy="dialog-button-set">
            <div data-cy="dialog-return-button" className="return_button">
              <Button
                dataCy="approve-dialog"
                type="submit"
                variant="contained"
                disabled={loading}
                onClick={handleConfirm}
              >
                {primaryButtonLabel}
              </Button>
            </div>
            {secondaryButtonLabel ? (
              <div className="reset_button">
                <Button
                  dataCy="close-dialog"
                  type="reset"
                  variant="text"
                  onClick={handleSecondaryButtonClick}
                >
                  {secondaryButtonLabel}
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GetDownloadDateDialog;
