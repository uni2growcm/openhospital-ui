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
  const handleExpiring = () => {
    // setIsOpen(true);
    console.log("Test");
  };
  return (
    <div className="buttonSet">
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
      <Button
        type="button"
        variant="outlined"
        color="inherit"
        onClick={handleExpiring}
      >
        {t("pharmacy.stock.expiring")}
      </Button>
      <Button type="button" variant="outlined" color="inherit">
        {t("pharmacy.stock.amcReport")}
      </Button>
      <Link href={PATHS.pharmacy_pharmaceutical_new}>
        <Button type="button" variant="contained" color="primary">
          {t("pharmacy.stock.addMedecine")}
        </Button>
      </Link>

      <PharmaceuticalExpiringDialog isOpen={isOpen} />
    </div>
  );
}
