import { CircularProgress } from "@mui/material";
import InfoBox from "components/accessories/infoBox/InfoBox";
import Table from "components/accessories/table/Table";
import { TFilterField } from "components/accessories/table/filter/types";
import { PATHS } from "consts";
import { useTranslation } from "libraries/hooks";
import { useWardMedicals } from "libraries/hooks/api";
import { useAppDispatch } from "libraries/hooks/redux";
import React, { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { getMovements } from "state/pharmacy";

interface WardMedicalsProps {
  wardCode: string;
}

export function WardMedicalsTable({ wardCode }: WardMedicalsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { medicals: data, errorMessage, status } = useWardMedicals(wardCode);

  const handleDischarge = useCallback(
    (row: any) => {
      const combinedId = `${row.code}-${row.wardCode}-${row.lotCode}`;

      navigate(PATHS.pharmacy_ward_stock_discharge.replace(":id", combinedId));
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

  const handleRectify = useCallback(
    (medical: any) => {
      navigate(
        PATHS.pharmacy_ward_stock_rectify
          .replace(":medCode", medical.code.toString() ?? "")
          .replace(":wardCode", medical.wardCode ?? "")
          .replace(":lotCode", medical.lotCode ?? "")
      );
    },
    [navigate]
  );

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
                onRectify={handleRectify}
                onDischarge={(row) => handleDischarge(row)}
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
    </div>
  );
}
