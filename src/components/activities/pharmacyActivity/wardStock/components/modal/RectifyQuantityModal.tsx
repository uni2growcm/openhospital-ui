import { Backdrop, Box, Fade, Modal, Typography } from "@mui/material";
import { MovementWardDTO } from "generated";
import { useTranslation } from "libraries/hooks";
import { useAppDispatch } from "libraries/hooks/redux";
import React, { useCallback } from "react";
import { createWardMovement, getWardMedicals } from "state/pharmacy";
import RectifyQuantityForm from "../form/RectifyQuantityForm";
import "./styles.scss";
import { RectifyQuantityModalProps } from "./types";

const RectifyQuantityModal: React.FC<RectifyQuantityModalProps> = ({
  open,
  onClose,
  pharmaceutical,
  loading,
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const onSubmit = useCallback(
    (updatedMedical: MovementWardDTO) => {
      dispatch(createWardMovement(updatedMedical))
        .unwrap()
        .then(() => {
          onClose();
          dispatch(
            getWardMedicals({ wardCode: updatedMedical.ward?.code || "" })
          );
        });
    },
    [dispatch, onClose]
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          TransitionComponent: Fade,
        },
      }}
    >
      <Fade in={open}>
        <Box className="rectify-quantity-modal">
          <Typography variant="h6" mb={2}>
            {t("pharmacy.stock.ward.Rectifywardstock")}
          </Typography>

          <RectifyQuantityForm
            pharmaceutical={pharmaceutical}
            loading={loading}
            onSubmit={onSubmit}
            onClose={onClose}
          />
        </Box>
      </Fade>
    </Modal>
  );
};

export default RectifyQuantityModal;
