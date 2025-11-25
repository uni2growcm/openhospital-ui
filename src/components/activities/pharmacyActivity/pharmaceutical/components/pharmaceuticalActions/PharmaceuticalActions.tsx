import { Link } from "@mui/material";
import Button from "components/accessories/button/Button";
import { PATHS } from "consts";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
    console.log(period);
    console.log(month);
  };

  return (
    <div className="buttonSet" data-cy="button-actions">
      <Button type="button" variant="outlined" color="inherit">
        {t("pharmacy.stock.exportList")}
      </Button>
      <Button type="button" variant="outlined" color="inherit">
        {t("pharmacy.stock.stockReport")}
      </Button>
      <Button type="button" variant="outlined" color="inherit">
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
    </div>
  );
}
