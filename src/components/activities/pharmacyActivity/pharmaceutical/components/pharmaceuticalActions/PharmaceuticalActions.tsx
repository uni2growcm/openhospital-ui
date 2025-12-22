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
  printPharmaceuticalStockCardPdf,
  printPharmaceuticalStockPdf,
} from "state/pharmacy";
import PharmaceuticalExpiringDialog from "../pharmaceuticalExpiringDialog/PharmaceuticalExpiringDialog";
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

  const handleGetExpiring = (period: string | null, month: string | null) => {
    //TODO: implement export logic
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

      <Button type="button" variant="outlined" color="inherit">
      <Button type="button" variant="outlined" color="inherit">
        {t("pharmacy.stock.expiring")}
      </Button>
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
