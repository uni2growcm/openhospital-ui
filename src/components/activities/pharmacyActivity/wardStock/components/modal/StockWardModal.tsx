import { Box, Modal, Typography } from "@mui/material";
import React from "react";

interface IStockModalProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  title?: string;
}
const StockWardModal: React.FC<IStockModalProps> = (
  props: IStockModalProps
) => {
  return (
    <>
      <Modal
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            maxHeight: "90vh",
            overflow: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          {props.title && (
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {props.title}
            </Typography>
          )}
          {props.children && (
            props.children
          )}
        </Box>
      </Modal>
    </>
  );
};

export default StockWardModal;
