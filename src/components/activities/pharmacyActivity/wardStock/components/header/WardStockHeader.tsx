import { MedicalServices } from "@mui/icons-material";
import Button from "components/accessories/button/Button";
import GetDownloadDateDialog from "components/activities/pharmacyActivity/getDownloadDateDialog/GetDownloadDateDialog";
import { PrintProperties } from "components/activities/pharmacyActivity/getDownloadDateDialog/types";
import { WardDTO } from "generated";
import { downloadBlob } from "libraries/downloadUtils/downloardUtils";
import { formatDateToCustomISO } from "libraries/formatUtils";
import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  printPharmaceuticalStockWardPdf,
  updateWardStockFIilter,
} from "state/pharmacy";
import "./styles.scss";

const types = ["outcoming", "incoming", "drugs"] as const;
const actions = ["report", "excel"];

export const WardStockHeader = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [wardCode, setWardCode] = useState<string>("c");
  const [typeMed, setTypeMed] = useState<string>("outcoming");
  const [isPrint, setIsPrint] = useState<boolean>(false);
  const [action, setAction] = useState<string>("report");
  const wards = useAppSelector(
    (state) => state.wards.allWards.data?.filter((ward) => ward.pharmacy) ?? []
  );

  const filter = useAppSelector((state) => state.pharmacy.wardStock.filter);

  const handleWardSelection = useCallback(
    (ward: WardDTO) => () => {
      dispatch(updateWardStockFIilter({ ...filter, ward }));
      setWardCode(ward.code!);
    },
    [dispatch, filter]
  );

  const handleTypeSelection = useCallback(
    (type: (typeof types)[number]) => () => {
      dispatch(
        updateWardStockFIilter({
          ...filter,
          type: filter.type === type ? undefined : type,
        })
      );
      setTypeMed(type);
    },
    [dispatch, filter]
  );

  useEffect(() => {
    if (!filter.ward && wards.length) {
      dispatch(updateWardStockFIilter({ ...filter, ward: wards[0] }));
    }
  }, [wards, filter, dispatch]);

  const handleGetReport = (payload: PrintProperties) => {
    if (action === "report") {
      dispatch(
        printPharmaceuticalStockWardPdf({
          wardCode: wardCode,
          date: formatDateToCustomISO(new Date()),
        })
      )
        .unwrap()
        .then((result) => {
          if (result instanceof Blob)
            downloadBlob(
              result,
              `pharmaceutical-stock-ward-drugs-report-${wardCode}-${new Date().getTime()}.pdf`
            );
        });
    } else {
      console.log("Getting Excel report");
    }
  };

  return (
    <div className="ward-stock-header">
      <div className="ward-stock-wards">
        {wards.map((ward) => (
          <Button
            key={ward.code}
            color={filter.ward?.code === ward.code ? "primary" : "inherit"}
            variant={"contained"}
            className="cta-button"
            onClick={handleWardSelection(ward)}
            dataCy={`cta-button-${ward.code}`}
          >
            <MedicalServices />
            {ward.description}
          </Button>
        ))}
      </div>
      <div className="divider"></div>
      {filter.ward && (
        <span data-cy="subtitle" className="subtitle">
          {filter.ward.description}
        </span>
      )}
      <div className="ward-stock-actions">
        {types.map((type) => (
          <Button
            key={type}
            className={`${type}-button`}
            dataCy={`${type}-button`}
            type="button"
            color={filter.type === type ? "primary" : "inherit"}
            variant={filter.type === type ? "contained" : "outlined"}
            onClick={handleTypeSelection(type)}
          >
            {t(`pharmacy.stock.actions.${type}`)}
          </Button>
        ))}
        <div className="separator"></div>
        {actions.map((action) => (
          <Button
            key={action}
            className={`${action}-button`}
            dataCy={action}
            type="button"
            variant={"outlined"}
            color="inherit"
            onClick={() => {
              setIsPrint(true);
              setAction(action);
            }}
          >
            {t(`pharmacy.stock.actions.${action}`)}
          </Button>
        ))}
      </div>
      <GetDownloadDateDialog
        isOpen={isPrint}
        title={t("pharmacy.selectReport").toUpperCase()}
        isStockWard={true}
        primaryButtonLabel={t("common.print")}
        secondaryButtonLabel={t("common.cancel")}
        handlePrimaryButtonClick={handleGetReport}
        handleSecondaryButtonClick={() => setIsPrint(false)}
      />
    </div>
  );
};
