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

export function StockActions() {
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
            `pharmaceutical-report-${new Date().getTime()}.pdf`
          );
      });
    setIsPrint(false);
  };

  return (
    <div className="pharmaceuticalStock__actions">
      <Button
        className="export_button"
        type="button"
        variant="outlined"
        color="inherit"
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
    </div>
  );
}
