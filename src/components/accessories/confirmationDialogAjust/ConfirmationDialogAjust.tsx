import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React, { FunctionComponent } from "react";
import Button from "../button/Button";
import "./styles.scss";
import { TextFormField } from "../forms";
import { useTranslation } from "libraries/hooks";
import { IAjustProps } from "./types";

const ConfirmationDialogAjust: FunctionComponent<IAjustProps> = ({
  isOpen,
  title,
  control,
  info,
  primaryButtonLabel,
  secondaryButtonLabel,
  handlePrimaryButtonClick,
  handleSecondaryButtonClick,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen}>
      <DialogTitle>
        <div data-cy="dialog-title" className="dialog__title">
          {title}
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="dialog__content">
          <div className="dialog__divider" />
          <div className="dialog__info" data-cy="dialog-info">
            {info}
          </div>
          <div className="">
            <form className="ajustForm" onSubmit={handlePrimaryButtonClick}>
              <TextFormField
                type="number"
                label={t("pharmacy.form.fields.quantity")}
                control={control}
                name="lastQuantity"
                disabled
              />
              <TextFormField
                type="number"
                label={t("pharmacy.form.fields.refNo")}
                control={control}
                name="newQuantity"
              />
              <div className="dialog__buttonSet" data-cy="dialog-button-set">
                <div data-cy="dialog-return-button" className="return_button">
                  <Button
                    dataCy="approve-dialog"
                    type="submit"
                    variant="contained"
                  >
                    {primaryButtonLabel}
                  </Button>
                </div>
                <div className="reset_button">
                  <Button
                    dataCy="close-dialog"
                    type="button"
                    variant="text"
                    onClick={handleSecondaryButtonClick}
                  >
                    {secondaryButtonLabel}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialogAjust;

