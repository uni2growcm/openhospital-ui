import { Autocomplete, TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "components/accessories/button/Button";
import DateField from "components/accessories/dateField/DateField";
import { MedicalDTO, WardDTO } from "generated";
import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import moment from "moment";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getMedicals } from "state/pharmacy";
import { getWards } from "state/ward";
import "./styles.scss";
import { IProps, PrintProperties } from "./types";

const GetDownloadDateDialog: FunctionComponent<
  IProps & {
    withDateField?: boolean;
    handlePrimaryButtonClick: (payload: PrintProperties) => void;
  }
> = ({
  isOpen,
  title,
  isPrincipalStock = false,
  isStockCard = false,
  primaryButtonLabel,
  secondaryButtonLabel,
  handlePrimaryButtonClick,
  handleSecondaryButtonClick,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [date, setDate] = useState<string>();
  const [dateTo, setDateTo] = useState<string>();
  const [dateFrom, setDateFrom] = useState<string>();
  const [medCode, setMedCode] = useState<number>();
  const [wardCode, setWardCode] = useState<string>();
  const [errorWard, setErrorWard] = useState(false);
  const [errorMedical, setErrorMedical] = useState(false);

  const [option, setOption] = useState<string | null>(null);
  const medicalsData = useAppSelector((state) =>
    state.pharmacy.getMedicals.data ? state.pharmacy.getMedicals.data : []
  );
  const wardsData = useAppSelector((state) =>
    state.wards.allWards.data ? state.wards.allWards.data : []
  );

  const renderOptions = (data: (WardDTO | MedicalDTO)[] | undefined) => {
    if (data) {
      return data.map((item) => {
        return {
          value: item.code?.toString() ?? "",
          label: item.description ?? "",
        };
      });
    } else return [];
  };

  const handleDate = (date: Date | null) => {
    if (date) {
      setDate(
        moment(date).isValid() ? moment(date).format("YYYY-MM-DDTHH:mm:ss") : ""
      );
    }
  };

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

  useEffect(() => {
    if (isOpen) {
      if (isStockCard) {
        setDateFrom(
          dateFrom ? dateFrom : moment(new Date()).format("YYYY-MM-DDTHH:mm:ss")
        );
        setDateTo(
          dateTo ? dateTo : moment(new Date()).format("YYYY-MM-DDTHH:mm:ss")
        );
        setErrorWard(false);
        setErrorMedical(false);
        dispatch(getMedicals());
        dispatch(getWards());
      } else {
        setDate(date ? date : moment(new Date()).format("YYYY-MM-DDTHH:mm:ss"));
      }
    }
  }, [setDateTo, isOpen, date, isStockCard, dateFrom, dateTo, dispatch]);

  const handleConfirm = () => {
    if (isStockCard) {
      if (!wardCode || !medCode) {
        setErrorWard(!wardCode);
        setErrorMedical(!medCode);
      } else {
        handlePrimaryButtonClick({
          dateTo: dateTo,
          dateFrom: dateFrom,
          medCode: medCode,
          wardCode: wardCode,
        });
        handleSecondaryButtonClick();
      }
    } else {
      if (isPrincipalStock) {
        handlePrimaryButtonClick({
          date: date,
          option: option ?? "ONLY_QUANTITY",
        } as PrintProperties);
      } else {
        handlePrimaryButtonClick({ date: date });
      }
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
          {!isStockCard && (
            <div className="dialog__dateField">
              <DateField
                fieldName="date"
                fieldValue={date ?? ""}
                disableFuture={true}
                theme="regular"
                format="dd/MM/yyyy HH:mm"
                label={t("pharmacy.selectDate")}
                onChange={(date: Date | null) => handleDate(date ? date : null)}
                disabled={false}
                isValid={false}
                errorText=""
              />
            </div>
          )}
          {isPrincipalStock && !isStockCard && (
            <div className="dialog__dateField">
              <Autocomplete
                id="option"
                disablePortal
                options={[
                  {
                    label: t("pharmacy.option.onlyQuantity"),
                    value: "ONLY_QUANTITY",
                  },
                  {
                    label: t("pharmacy.option.withLot"),
                    value: "WITH_LOTS",
                  },
                ]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("pharmacy.selectOption")}
                    data-cy="option"
                    name="option"
                  />
                )}
                onChange={(event, value) => {
                  setOption(value ? value.value : null);
                }}
              />
            </div>
          )}

          {isStockCard && (
            <>
              <div className="dialog__dateField">
                <DateField
                  fieldName="dateFrom"
                  fieldValue={dateFrom ?? ""}
                  disableFuture={true}
                  theme="regular"
                  format="dd/MM/yyyy HH:mm"
                  label={t("pharmacy.selectDateFrom")}
                  onChange={(dateFrom: Date | null) =>
                    handleDateFrom(dateFrom ? dateFrom : null)
                  }
                  disabled={false}
                  isValid={false}
                  errorText=""
                />
                <DateField
                  fieldName="date"
                  fieldValue={dateTo ?? ""}
                  disableFuture={true}
                  theme="regular"
                  format="dd/MM/yyyy HH:mm"
                  label={t("pharmacy.selectDateTo")}
                  onChange={(dateTo: Date | null) =>
                    handleDateTo(dateTo ? dateTo : null)
                  }
                  disabled={false}
                  isValid={false}
                  errorText=""
                />
                <div className="dialog__dateField">
                  <Autocomplete
                    id="optionsMedical"
                    disablePortal
                    options={renderOptions(medicalsData)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t("pharmacy.selectMedical")}
                        data-cy="optionsMedical"
                        name="optionsMedical"
                        error={errorMedical}
                        helperText={
                          errorMedical ? t("pharmacy.errorMessageForm") : ""
                        }
                      />
                    )}
                    onChange={(event, value) => {
                      setMedCode(value ? Number(value.value) : undefined);
                      setErrorMedical(false);
                    }}
                  />
                </div>
                <div className="dialog__dateField">
                  <Autocomplete
                    id="optionsWard"
                    disablePortal
                    options={renderOptions(wardsData)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t("pharmacy.selectWard")}
                        data-cy="optionsWard"
                        name="optionsWard"
                        error={errorWard}
                        helperText={
                          errorWard ? t("pharmacy.errorMessageForm") : ""
                        }
                      />
                    )}
                    onChange={(event, value) => {
                      setWardCode(value ? value.value : undefined);
                      setErrorWard(false);
                    }}
                  />
                </div>
              </div>
            </>
          )}

          <div className="dialog__buttonSet" data-cy="dialog-button-set">
            <div data-cy="dialog-return-button" className="return_button">
              <Button
                dataCy="approve-dialog"
                type="submit"
                variant="contained"
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
