import { CircularProgress } from "@mui/material";
import InfoBox from "components/accessories/infoBox/InfoBox";
import Table from "components/accessories/table/Table";
import { TFilterField } from "components/accessories/table/filter/types";
import { renderDateTime } from "libraries/formatUtils/dataFormatting";
import { useTranslation } from "libraries/hooks";
import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import React, { useEffect, useMemo } from "react";
import {
  getMovementsWard,
} from "state/pharmacy";

export function WardMovementsTable() {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const filter = useAppSelector((state) => state.pharmacy.wardStock.filter);

  const data = useAppSelector(
    (state) => state.pharmacy.wardMovements.data ?? []
  );

  const dataIncoming = useAppSelector(
    (state) => state.pharmacy.getMovementsWard.data ?? []
  );

  const status = useAppSelector((state) => state.pharmacy.wardMovements.status);

  const errorMessage = useAppSelector(
    (state) =>
      state.pharmacy.getMovements.error?.message || t("errors.somethingwrong")
  ) as string;

  const labelData = {
    date: t("pharmacy.stock.ward.date"),
    type: t("pharmacy.stock.ward.type"),
    recipient: t("pharmacy.stock.ward.recipient"),
    pharmaceutical: t("pharmacy.stock.ward.pharmaceutical"),
    quantity: t("pharmacy.stock.ward.quantity"),
    units: t("pharmacy.stock.ward.units"),
    patient: t("pharmacy.stock.ward.patient"),
    medical: t("pharmacy.stock.ward.medical"),
    wardFrom: t("pharmacy.stock.ward.wardFrom"),
    wardTo: t("pharmacy.stock.ward.wardTo"),
    code: t("pharmacy.stock.ward.code"),
    description: t("pharmacy.stock.ward.description"),
    ward: t("pharmacy.stock.ward.ward"),
    weight: t("pharmacy.stock.ward.weight"),
    age: t("pharmacy.stock.ward.age"),
  };

  type LabelDataKey = keyof typeof labelData;

  const tableHeader: LabelDataKey[] = [
    "date",
    "type",
    "recipient",
    "pharmaceutical",
    "quantity",
    "units",
  ];

  const dateFields: LabelDataKey[] = ["date"];
  const order: LabelDataKey[] = ["pharmaceutical", "quantity"];

  const filters = useMemo(
    () =>
      [
        {
          key: "recipient",
          label: t("pharmacy.stock.ward.recipient"),
          type: "text",
        },
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
        {
          key: "type",
          label: t("pharmacy.stock.ward.type"),
          type: "select",
          options: [
            {
              label: t("pharmacy.stock.ward.movementType.patient"),
              value: "patient",
            },
            {
              label: t("pharmacy.stock.ward.movementType.ward"),
              value: "ward",
            },
          ],
        },
        { key: "date", label: t("pharmacy.stock.ward.date"), type: "date" },
        {
          key: "medical",
          label: t("pharmacy.stock.medical"),
          type: "text",
        },
      ] satisfies TFilterField[],
    [t]
  );

  const fulldata: any[] = [...dataIncoming, ...data];

  const formattedData = useMemo(() => {
    return fulldata
      .filter((item) => {
      if (!filter.type) return true;
      if (filter.type === "incoming") {
        return item.type?.code === "discharge" && item.ward?.code === filter.ward?.code;
      }
      if (filter.type === "outcoming") {
        return (
          item.ward?.code === filter.ward?.code && 
          item.type?.code !== "discharge"
        );
      }
      return false;
    })
      .map((item) => ({
        recipient:
          (item.patient
            ? `${item?.fullPatient?.firstName} ${item?.fullPatient?.secondName}`
            : item.wardTo?.description) ?? "",
        patient: item?.fullPatient?.name ?? "",
        pharmaceutical: item.medical?.description ?? "",
        wardFrom: item.wardFrom?.description ?? "",
        wardTo: item.wardTo?.description ?? "",
        date: renderDateTime(item.date),
        code: item.code ?? "",
        units: item.units ?? "",
        description: item.description,
        quantity: item.quantity,
        ward: item.ward?.description ?? "",
        weight: item.weight ?? "",
        age: item.age ?? "",
        type: t(
          `pharmacy.stock.ward.movementType.${
            item.patient ? "patient" : "ward"
          }`
        ),
      }));
  }, [fulldata, filter, t]);

  useEffect(() => {
    dispatch(getMovementsWard({ wardId: filter.ward?.code ?? "" }));
  }, [dispatch, filter.ward?.code]);

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
                initialOrderBy="quantity"
                rowData={formattedData}
                dateFields={dateFields}
                showEmptyCell={false}
                isCollapsabile={true}
                detailColSpan={6}
                filterColumns={filters}
                rawData={(fulldata ?? []).map((item) => ({
                  ...item,
                  type: item.patient ? "patient" : "ward",
                  pharmaceutical: item.medical?.description ?? "",
                  recipient:
                    (item.patient
                      ? `${item?.fullPatient?.firstName} ${item?.fullPatient?.secondName}`
                      : item.wardTo?.description) ?? "",
                }))}
                manualFilter={false}
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
