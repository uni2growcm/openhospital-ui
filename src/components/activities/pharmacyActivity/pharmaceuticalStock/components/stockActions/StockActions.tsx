import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LogoutIcon from "@mui/icons-material/Logout";
import Button from "components/accessories/button/Button";
import { AdjustQuantityForm } from "components/activities/pharmacyActivity/pharmaceuticalStock/components/forms/adjustQuantityForm/AdjustQuantityForm";
import StockModal from "components/activities/pharmacyActivity/pharmaceuticalStock/components/modal/Modal";
import { MovementDTO } from "generated";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./styles.scss";

export interface StockActionsHandle {
  handleAdjustClick: (movement: MovementDTO) => void;
}

export const StockActions = React.forwardRef<StockActionsHandle, {}>(
  (_, ref) => {
    const { t } = useTranslation();

    const [openStockModal, setOpenStockModal] = useState<boolean>(false);
    const [selectedMovement, setSelectedMovement] = useState<
      MovementDTO | undefined
    >();

    const handleAdjustClick = (movement: MovementDTO) => {
      setSelectedMovement(movement);
      setOpenStockModal(true);
    };

    const handleCloseModal = () => {
      setOpenStockModal(false);
      setSelectedMovement(undefined);
    };

    const handleAdjustSubmit = (values: {
      movement: MovementDTO;
      newQuantity: number;
    }) => {
      console.log("Adjust quantity:", values);
      // TODO: Call API to update movement quantity
      handleCloseModal();
    };

    React.useImperativeHandle(ref, () => ({
      handleAdjustClick,
    }));

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
        >
          {t("pharmacy.stock.stockReport")}
        </Button>
        <div className="separator"></div>
        <Button
          className="discharge_button"
          type="button"
          variant="contained"
          color="inherit"
          startIcon={<LogoutIcon sx={{ transform: "rotate(90deg)" }} />}
          onClick={() => setOpenStockModal(true)}
        >
          Adjust Quantity
        </Button>
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

        <StockModal open={openStockModal} onClose={handleCloseModal}>
          <AdjustQuantityForm
            movement={selectedMovement}
            onSubmit={handleAdjustSubmit}
            onCancel={handleCloseModal}
          />
        </StockModal>
      </div>
    );
  }
);
