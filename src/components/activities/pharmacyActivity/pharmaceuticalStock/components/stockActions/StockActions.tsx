import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LogoutIcon from "@mui/icons-material/Logout";
import Button from "components/accessories/button/Button";
import GetDownloadDateDialog from "components/activities/pharmacyActivity/getDownloadDateDialog/GetDownloadDateDialog";
import { PrintProperties } from "components/activities/pharmacyActivity/getDownloadDateDialog/types";
import { downloadBlob } from "libraries/downloadUtils/downloardUtils";
import { useAppDispatch } from "libraries/hooks/redux";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { printPharmaceuticalStockPdf } from "state/pharmacy";
import "./styles.scss";
import ConfirmationDialog from "components/accessories/confirmationDialog/ConfirmationDialog";
import warningIcon from "../../../../../../assets/warning-icon.png";
import * as XLSX from "xlsx";

export function StockActions({ dataToExport }: { dataToExport: any[] }) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [isPrint, setIsPrint] = useState<boolean>(false);

  const handleGetReport = (payload: PrintProperties) => {
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

  const [noPageToExport, setNoPageToExport] = useState<boolean>(false);
  const handlePrintExportListExcel = () => {
    if (!dataToExport) return;
    if (dataToExport.length === 0) {
      setNoPageToExport(true);
      return;
    }

    const excelRows = dataToExport.map((item) => ({
      [t("pharmacy.stock.refNo")]: item.refNo, 
      [t("pharmacy.stock.type")]: item.type, 
      [t("pharmacy.stock.origin")]: item.origin || "", 
      [t("pharmacy.stock.quantity")]: item.quantity, 
      [t("pharmacy.stock.medical")]: item.medical, 
      [t("pharmacy.stock.medicalType")]: item.medicalType || "", 
      [t("pharmacy.stock.cost")]: item.cost || "",
      [t("pharmacy.stock.total")]: item.quantity * (item.cost || 0), 
      [t("pharmacy.stock.lot")]: item.lot || "", 
      [t("pharmacy.stock.prepDate")]: item.prepDate || "", 
      [t("pharmacy.stock.expDate")]: item.expDate || "", 
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelRows);
    const workbook = XLSX.utils.book_new();
    
    const date = new Date().getTime();
    const dateStr = new Date().toISOString().split("T")[0];
    XLSX.utils.book_append_sheet(workbook, worksheet, `Stock-${dateStr}`);
    XLSX.writeFile(workbook, `pharmaceutical-stock-export-${dateStr}-${date}.xlsx`);
  };

  return (
    <div className="pharmaceuticalStock__actions">
      <Button
        className="export_button"
        type="button"
        variant="outlined"
        color="inherit"
        onClick={handlePrintExportListExcel}
      >
        {t("pharmacy.stock.exportList")}
      </Button>
      <Button
        className="report_button"
        type="button"
        variant="outlined"
        color="inherit"
        onClick={() => setIsPrint(true)}
      >
        {t("pharmacy.stock.stockReport")}
      </Button>
      <div className="separator"></div>
      <Link to={"./discharge-movement"}>
        <Button
          type="button"
          variant="contained"
          dataCy="discharge-button"
          className="discharge_button"
          startIcon={<LogoutIcon sx={{ transform: "rotate(90deg)" }} />}
        >
          {t("pharmacy.stock.discharge")}
        </Button>
      </Link>
      <Link to={"./charge-movement"}>
        <Button
          className="charge_button"
          dataCy="charge-button"
          type="button"
          variant="contained"
          startIcon={<ExitToAppIcon sx={{ transform: "rotate(-90deg)" }} />}
        >
          {t("pharmacy.stock.charge")}
        </Button>
      </Link>
      <GetDownloadDateDialog
        isOpen={isPrint}
        title={t("pharmacy.selectReport").toUpperCase()}
        isPrincipalStock={true}
        primaryButtonLabel={t("common.print")}
        secondaryButtonLabel={t("common.cancel")}
        handlePrimaryButtonClick={handleGetReport}
        handleSecondaryButtonClick={() => setIsPrint(false)}
      />
      <ConfirmationDialog
        isOpen={noPageToExport}
        title={t("pharmacy.stock.noPageToExport.title")}
        info={t("pharmacy.stock.noPageToExport.description")}
        icon={warningIcon}
        primaryButtonLabel={t("common.ok")}
        handlePrimaryButtonClick={() => setNoPageToExport(false)}
        handleSecondaryButtonClick={() => {}}
      />
    </div>
  );
}
