import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "components/accessories/button/Button";
import DateField from "components/accessories/dateField/DateField";
import moment from "moment";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./styles.scss";

const PharmaceuticalExpiringDialog: FunctionComponent<{
  isOpen: boolean;
  withDateField?: boolean;
  // handlePrimaryButtonClick: (date: string) => void;
}> = ({
  isOpen,
  //   handlePrimaryButtonClick,
  withDateField = false,
}) => {
  const { t } = useTranslation();
  const [closureDate, setClosureDate] = useState<string>();

  //   const handleConfirm = () => {
  //     handlePrimaryButtonClick(closureDate ?? "");
  //   };

  const handleClotureDate = (date: Date | null) => {
    if (date) {
      setClosureDate(
        moment(date).isValid() ? moment(date).format("YYYY-MM-DDTHH:mm:ss") : ""
      );
    }
  };

  useEffect(() => {
    if (isOpen) {
      setClosureDate(
        closureDate
          ? closureDate
          : moment(new Date()).format("YYYY-MM-DDTHH:mm:ss")
      );
    }
  }, [setClosureDate, isOpen, closureDate]);

  return (
    <Dialog open={isOpen}>
      <DialogTitle>
        <div data-cy="dialog-title" className="dialog__title">
          Expiring report
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="dialog__content">
          <div className="dialog__divider" />
          <div className="dialog__info" data-cy="dialog-info">
            Select a period
          </div>

          {withDateField && (
            <div className="dialog__dateField">
              <DateField
                fieldName="closureDate"
                fieldValue={closureDate ?? ""}
                disableFuture={true}
                theme="regular"
                format="dd/MM/yyyy HH:mm"
                label={t("encounter.closedAt")}
                onChange={(date: Date | null) =>
                  handleClotureDate(date ? date : null)
                }
                disabled={false}
                isValid={false}
                errorText=""
              />
            </div>
          )}

          <div className="dialog__buttonSet" data-cy="dialog-button-set">
            <div data-cy="dialog-return-button" className="return_button">
              <Button
                dataCy="approve-dialog"
                type="submit"
                variant="contained"
                // onClick={handleConfirm}
              >
                Generate
              </Button>
            </div>
            <div className="reset_button">
              <Button
                dataCy="close-dialog"
                type="reset"
                variant="text"
                // onClick={handleSecondaryButtonClick}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PharmaceuticalExpiringDialog;
