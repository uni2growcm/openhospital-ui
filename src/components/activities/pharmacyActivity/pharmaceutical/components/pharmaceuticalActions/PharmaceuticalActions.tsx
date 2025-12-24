import { Link } from "@mui/material";
import Button from "components/accessories/button/Button";
import GetDownloadDateDialog from "components/activities/pharmacyActivity/getDownloadDateDialog/GetDownloadDateDialog";
import { PrintProperties } from "components/activities/pharmacyActivity/getDownloadDateDialog/types";
import { PATHS } from "consts";
import { downloadBlob } from "libraries/downloadUtils/downloardUtils";
import { useAppDispatch } from "libraries/hooks/redux";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  printPharmaceuticalAMCPdf,
  printPharmaceuticalExpirationPdf,
  printPharmaceuticalStockCardPdf,
  printPharmaceuticalStockPdf,
} from "state/pharmacy";
import PharmaceuticalExpiringDialog from "../pharmaceuticalExpiringDialog/PharmaceuticalExpiringDialog";
import {
  ExperingPeriod,
  ExpiringMonth,
} from "../pharmaceuticalExpiringDialog/type";
import "./styles.scss";

export default function PharmaceuticalActions() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const handleOpenExpiringDialog = () => {
    setIsOpen(true);
  };

  const handleCloseExpiringDialog = () => {
    setIsOpen(false);
  };

  const handleGetExpiring = (period: string, month: string | null) => {
    let fromDate = new Date();
    let toDate = new Date();

    switch (period) {
      case ExperingPeriod.TODAY:
        fromDate = new Date();
        toDate = new Date();
        break;
      case ExperingPeriod.NEXTMONTH:
        fromDate = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          1
        );
        toDate = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        );
        break;
      case ExperingPeriod.THISMONTH:
        fromDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        toDate = new Date(new Date().getFullYear(), new Date().getMonth(), 0);
        break;
      case ExperingPeriod.NEXTTWOMONTHS:
        fromDate = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          1
        );
        toDate = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 2,
          0
        );
        break;
      case ExperingPeriod.SPECIFICMONTH:
        if (month) {
          switch (month) {
            case ExpiringMonth.JANUARY:
              fromDate = new Date(new Date().getFullYear(), 1, 1);
              toDate = new Date(new Date().getFullYear(), 1, 31);
              break;
            case ExpiringMonth.FEBRUARY:
              fromDate = new Date(new Date().getFullYear(), 2, 1);
              toDate = new Date(new Date().getFullYear(), 2, 28);
              break;
            case ExpiringMonth.MARCH:
              fromDate = new Date(new Date().getFullYear(), 3, 1);
              toDate = new Date(new Date().getFullYear(), 3, 31);
              break;
            case ExpiringMonth.APRIL:
              fromDate = new Date(new Date().getFullYear(), 4, 1);
              toDate = new Date(new Date().getFullYear(), 4, 30);
              break;
            case ExpiringMonth.MAY:
              fromDate = new Date(new Date().getFullYear(), 5, 1);
              toDate = new Date(new Date().getFullYear(), 5, 31);
              break;
            case ExpiringMonth.JUNE:
              fromDate = new Date(new Date().getFullYear(), 6, 1);
              toDate = new Date(new Date().getFullYear(), 6, 30);
              break;
            case ExpiringMonth.JULY:
              fromDate = new Date(new Date().getFullYear(), 7, 1);
              toDate = new Date(new Date().getFullYear(), 7, 31);
              break;
            case ExpiringMonth.AUGUST:
              fromDate = new Date(new Date().getFullYear(), 8, 1);
              toDate = new Date(new Date().getFullYear(), 8, 31);
              break;
            case ExpiringMonth.SEPTEMBER:
              fromDate = new Date(new Date().getFullYear(), 9, 1);
              toDate = new Date(new Date().getFullYear(), 9, 30);
              break;
            case ExpiringMonth.OCTOBER:
              fromDate = new Date(new Date().getFullYear(), 10, 1);
              toDate = new Date(new Date().getFullYear(), 10, 31);
              break;
            case ExpiringMonth.NOVEMBER:
              fromDate = new Date(new Date().getFullYear(), 11, 1);
              toDate = new Date(new Date().getFullYear(), 11, 30);
              break;
            case ExpiringMonth.DECEMBER:
              fromDate = new Date(new Date().getFullYear(), 12, 1);
              toDate = new Date(new Date().getFullYear(), 12, 31);
              break;
          }
        }
        break;
    }

    dispatch(
      printPharmaceuticalExpirationPdf({
        fromDate: fromDate.toISOString(),
        toDate: toDate.toISOString(),
      })
    )
      .unwrap()
      .then((result) => {
        if (result instanceof Blob)
          downloadBlob(
            result,
            `pharmaceutical-expiring-report-${new Date().getTime()}.pdf`
          );
      });
    setIsOpen(false);
  };

  const dispatch = useAppDispatch();
  const [isPrint, setIsPrint] = useState<boolean>(false);
  const [isAMCReport, setIsAMCReport] = useState<boolean>(false);
  const [isPrincipalStock, setIsPrincipalStock] = useState<boolean>(false);

  const handleGetStockCardReport = (payload: PrintProperties) => {
    dispatch(
      printPharmaceuticalStockCardPdf({
        dateFrom: payload.dateFrom!,
        dateTo: payload.dateTo!,
        exportFileName: "StockCardReport",
        medicalCode: payload.medCode!,
        wardCode: payload.wardCode!,
      })
    )
      .unwrap()
      .then((result) => {
        if (result instanceof Blob)
          downloadBlob(
            result,
            `pharmaceutical-stock-card-report-${new Date().getTime()}.pdf`
          );
      });
    setIsPrint(false);
  };

  const handleGetAMCReport = (payload: PrintProperties) => {
    dispatch(
      printPharmaceuticalAMCPdf({
        date: payload.date!,
      })
    )
      .unwrap()
      .then((result) => {
        if (result instanceof Blob)
          downloadBlob(
            result,
            `pharmaceutical-AMC-report-${new Date().getTime()}.pdf`
          );
      });
    setIsPrint(false);
  };

  const handleGetStockReport = (payload: PrintProperties) => {
    dispatch(
      printPharmaceuticalStockPdf({
        option: payload.option!,
        date: payload.date!,
      })
    )
      .unwrap()
      .then((result) => {
        if (result instanceof Blob)
          downloadBlob(
            result,
            `pharmaceutical-stock-report-${new Date().getTime()}.pdf`
          );
      });
    setIsPrint(false);
  };

  return (
    <div className="buttonSet" data-cy="button-actions">
      <Button type="button" variant="outlined" color="inherit">
        {t("pharmacy.stock.exportList")}
      </Button>
      <Button
        type="button"
        variant="outlined"
        color="inherit"
        onClick={() => {
          setIsPrint(true);
          setIsAMCReport(false);
          setIsPrincipalStock(true);
        }}
      >
        {t("pharmacy.stock.stockReport")}
      </Button>
      <Button
        type="button"
        variant="outlined"
        color="inherit"
        onClick={() => {
          setIsPrint(true);
          setIsPrincipalStock(false);
          setIsAMCReport(false);
        }}
      >
        {t("pharmacy.stock.stockCardReport")}
      </Button>
      <Button type="button" variant="outlined" color="inherit">
        {t("pharmacy.stock.order")}
      </Button>
      <div data-cy="expiring-button">
        <Button
          type="button"
          variant="outlined"
          color="inherit"
          data-cy="expiring-button"
          onClick={handleOpenExpiringDialog}
        >
          {t("pharmacy.stock.expiring.label")}
        </Button>
      </div>

      <Button
        type="button"
        variant="outlined"
        color="inherit"
        onClick={() => {
          setIsPrint(true);
          setIsPrincipalStock(false);
          setIsAMCReport(true);
        }}
      >
        {t("pharmacy.stock.amcReport")}
      </Button>
      <Link href={PATHS.pharmacy_pharmaceutical_new}>
        <Button type="button" variant="contained" color="primary">
          {t("pharmacy.stock.addMedecine")}
        </Button>
      </Link>

      <PharmaceuticalExpiringDialog
        isOpen={isOpen}
        handlePrimaryButtonClick={handleGetExpiring}
        handleSecondaryButtonClick={handleCloseExpiringDialog}
      />
      <GetDownloadDateDialog
        isOpen={isPrint}
        title={t("pharmacy.selectReport").toUpperCase()}
        isStockCard={true && !isAMCReport && !isPrincipalStock}
        isPrincipalStock={isPrincipalStock}
        primaryButtonLabel={t("common.print")}
        secondaryButtonLabel={t("common.cancel")}
        handlePrimaryButtonClick={
          isAMCReport
            ? handleGetAMCReport
            : isPrincipalStock
            ? handleGetStockReport
            : handleGetStockCardReport
        }
        handleSecondaryButtonClick={() => setIsPrint(false)}
      />
    </div>
  );
}
