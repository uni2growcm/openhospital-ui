import { CircularProgress } from "@mui/material";
import InfoBox from "components/accessories/infoBox/InfoBox";
import Table from "components/accessories/table/Table";
import { TFilterField } from "components/accessories/table/filter/types";
import { PATHS } from "consts";
import { MedicalWardDTO } from "generated";
import { useTranslation } from "libraries/hooks";
import { useWardMedicals } from "libraries/hooks/api";
import { useAppDispatch } from "libraries/hooks/redux";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { getMovements, printPharmaceuticalStockCardPdf } from "state/pharmacy";
import GetDownloadDateDialog from "components/activities/pharmacyActivity/getDownloadDateDialog/GetDownloadDateDialog";
import { downloadBlob } from "libraries/downloadUtils/downloardUtils";

interface WardMedicalsProps {
  wardCode: string;
  onRectify?: (medical: MedicalWardDTO) => void;
}

export function WardMedicalsTable({ wardCode, onRectify }: WardMedicalsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { medicals: data, errorMessage, status } = useWardMedicals(wardCode);

  const handleDischarge = useCallback(
    (row: any) => {
      navigate(
        PATHS.pharmacy_ward_stock_discharge
          .replace(":ward", row.wardCode)
          .replace(":medical", row.code)
      );
    },
    [navigate]
  );

  const labelData = {
    pharmaceutical: t("pharmacy.stock.ward.pharmaceutical"),
    quantity: t("pharmacy.stock.ward.quantity"),
    units: t("pharmacy.stock.ward.units"),
    action: "",
  };

  type LabelDataKey = keyof typeof labelData;

  const tableHeader: LabelDataKey[] = [
    "pharmaceutical",
    "quantity",
    "units",
    "action",
  ];

  const dateFields: LabelDataKey[] = [];
  const order: LabelDataKey[] = ["pharmaceutical", "quantity"];

  const filters = useMemo(
    () =>
      [
        {
          key: "units",
          label: t("pharmacy.stock.ward.units"),
          type: "text",
        },
        {
          key: "quantity",
          label: t("pharmacy.stock.ward.quantity"),
          type: "number",
        },
        { key: "date", label: t("pharmacy.stock.ward.date"), type: "date" },
        {
          key: "pharmaceutical",
          label: t("pharmacy.stock.ward.pharmaceutical"),
          type: "text",
        },
      ] satisfies TFilterField[],
    [t]
  );

  const formattedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      code: item.code ?? "",
      wardCode,
      pharmaceutical: item.description ?? "",
      units: "",
    }));
  }, [data, wardCode]);

  useEffect(() => {
    dispatch(getMovements());
  }, [dispatch]);

  const [selectedRow, setSelectedRow] = useState<any>(null);

  const handlePrintStockCardReport = (dates: any) => {
    dispatch(
      printPharmaceuticalStockCardPdf({
        wardCode: wardCode,
        medicalCode: selectedRow.code,
        dateFrom: dates.dateFrom,
        dateTo: dates.dateTo,
        exportFileName: "WardStockCardReport",
      })
    )
      .unwrap()
      .then((result) => {
        if (result instanceof Blob)
          downloadBlob(
            result,
            `ward-stock-card-report-${new Date().getTime()}.pdf`
          );
        setSelectedRow(null);
      });
  };

  return (
    <div data-cy="ward-movements-table">
      {(() => {
        switch (status) {
          case "IDLE":
            return <CircularProgress />;
          case "SUCCESS":
            return (
              <Table
                labelData={labelData}
                tableHeader={tableHeader}
                rowsPerPage={10}
                columnsOrder={order}
                initialOrderBy="pharmaceutical"
                rowData={formattedData}
                dateFields={dateFields}
                showEmptyCell={false}
                filterColumns={filters}
                rawData={data}
                manualFilter={false}
                onRectify={onRectify}
                onDischarge={(row) => handleDischarge(row)}
                onPrintStockCard={(row) => setSelectedRow(row)}
              />
            );
          case "SUCCESS_EMPTY":
            return <InfoBox type="info" message={t("common.emptydata")} />;
          case "FAIL":
            return <InfoBox type="error" message={errorMessage} />;
          default:
            return <CircularProgress />;
        }
      })()}
      <GetDownloadDateDialog
        isOpen={selectedRow !== null}
        title={t("pharmacy.selectReport").toUpperCase()}
        isStockWard={true}
        primaryButtonLabel={t("common.print")}
        secondaryButtonLabel={t("common.cancel")}
        handlePrimaryButtonClick={handlePrintStockCardReport}
        handleSecondaryButtonClick={() => setSelectedRow(null)}
      />
    </div>
  );
}
