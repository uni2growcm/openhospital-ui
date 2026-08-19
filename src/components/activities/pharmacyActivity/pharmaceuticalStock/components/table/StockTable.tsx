import { CircularProgress } from "@mui/material";
import Button from "components/accessories/button/Button";
import InfoBox from "components/accessories/infoBox/InfoBox";
import Table from "components/accessories/table/Table";
import { TFilterField } from "components/accessories/table/filter/types";
import { AdjustQuantityForm } from "components/activities/pharmacyActivity/pharmaceuticalStock/components/forms/adjustQuantityForm/AdjustQuantityForm";
import StockModal from "components/activities/pharmacyActivity/pharmaceuticalStock/components/modal/Modal";
import { MovementDTO } from "generated";
import { renderDateTime } from "libraries/formatUtils/dataFormatting";
import { useTranslation } from "libraries/hooks";
import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getMovements, updateMovement, updateMovementReset } from "state/pharmacy";

export function StockTable({
  onDataChange,
}: {
  onDataChange: (data: any[]) => void;
}) {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const data = useAppSelector((state) =>
    state.pharmacy.getMovements.data ? state.pharmacy.getMovements.data : []
  );

  const status = useAppSelector((state) => state.pharmacy.getMovements.status);

  const errorMessage = useAppSelector(
    (state) =>
      state.pharmacy.getMovements.error?.message || t("errors.somethingwrong")
  ) as string;

  const [openStockModal, setOpenStockModal] = useState<boolean>(false);
  const [selectedMovement, setSelectedMovement] = useState<
    MovementDTO | undefined
  >();

  const updateStatus = useAppSelector(
    (state) => state.pharmacy.updateMovement.status
  );

  const updateErrorMessage = useAppSelector(
    (state) =>
      state.pharmacy.updateMovement.error?.message ||
      t("errors.somethingwrong")
  ) as string;

  const labelData = {
    refNo: t("pharmacy.stock.refNo"),
    lot: t("pharmacy.stock.lot"),
    expDate: t("pharmacy.stock.expDate"),
    type: t("pharmacy.stock.type"),
    origin: t("pharmacy.stock.origin"),
    user: t("pharmacy.stock.user"),
    medicalType: t("pharmacy.stock.medicalType"),
    quantity: t("pharmacy.stock.quantity"),
    medical: t("pharmacy.stock.medical"),
    cost: t("pharmacy.stock.cost"),
    total: t("pharmacy.stock.total"),
    prepDate: t("pharmacy.stock.prepDate"),
  };

  const tableHeader = [
    "refNo",
    "lot",
    "expDate",
    "type",
    "quantity",
    "medical",
    "cost",
    "total",
  ];

  const dateFields = ["expDate", "prepDate", "type"];
  const order = ["quantity", "cost", "total"];

  const filters = useMemo(
    () =>
      [
        { key: "refNo", label: t("pharmacy.stock.refNo"), type: "text" },
        { key: "lot", label: t("pharmacy.stock.lot"), type: "text" },
        {
          key: "type",
          label: t("pharmacy.stock.type"),
          type: "select",
          options: [
            { label: t("pharmacy.stock.movementType.charge"), value: "charge" },
            {
              label: t("pharmacy.stock.movementType.discharge"),
              value: "discharge",
            },
          ],
        },
        { key: "expDate", label: t("pharmacy.stock.expDate"), type: "date" },
        { key: "medical", label: t("pharmacy.stock.medical"), type: "text" },
      ] satisfies TFilterField[],
    [t]
  );

  const formattedData = useMemo(() => {
    return data.map((item) => ({
      refNo: item.refNo,
      lot: item.lot?.code,
      expDate: renderDateTime(item.lot?.dueDate),
      type: t(
        `pharmacy.stock.movementType.${
          item.type?.type === "+" ? "charge" : "discharge"
        }`
      ),
      date: item.date,
      quantity: item.quantity,
      medical: item.medical?.description,
      cost: item.lot?.cost,
      total: item.lot?.cost ? item.lot.cost * item.quantity : "",
      prepDate: renderDateTime(item.lot?.preparationDate),
      origin: item.supplier?.supName || "",
      user: "",
      medicalType: item.medical.type?.description || "",
    }));
  }, [t, data]);

  const handleAdjustClick = (row: Record<string, any>) => {
    const movement =
      (data ?? []).find(
        (item) =>
          item.refNo === row.refNo &&
          item.quantity === row.quantity &&
          item.lot?.code === row.lot &&
          item.date === row.date
      ) ?? (row as unknown as MovementDTO);
    setSelectedMovement(movement);
    dispatch(updateMovementReset());
    setOpenStockModal(true);
  };

  const handleCloseModal = useCallback(() => {
    setOpenStockModal(false);
    setSelectedMovement(undefined);
    dispatch(updateMovementReset());
  }, [dispatch]);

  const handleAdjustSubmit = useCallback(
    ({ movement, newQuantity }: { movement: MovementDTO; newQuantity: number }) => {
      dispatch(
        updateMovement({
          ...movement,
          quantity: newQuantity,
        })
      );
    },
    [dispatch]
  );

  useEffect(() => {
    if (updateStatus === "SUCCESS") {
      handleCloseModal();
      dispatch(getMovements());
    }
  }, [updateStatus, dispatch, handleCloseModal]);

  useEffect(() => {
    dispatch(getMovements());
  }, [dispatch]);

  return (
    <div data-cy="pharmaceutical-stock-table">
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
                initialOrderBy="date"
                rowData={formattedData}
                dateFields={dateFields}
                showEmptyCell={false}
                isCollapsabile={true}
                detailColSpan={9}
                filterColumns={filters}
                rowKey="refNo"
                rawData={(data ?? []).map((item) => ({
                  ...item,
                  lot: item.lot?.code,
                  type: item.type?.type === "+" ? "charge" : "discharge",
                  medical: item.medical?.description ?? "",
                  expDate: item.lot?.dueDate ?? "",
                }))}
                manualFilter={false}
                adjustQuantity={(data ?? []).some(
                  (item) => item.type?.type === "+"
                )}
                onFilteredDataChange={onDataChange}
                renderExtraContent={(item) => (
                  <Button
                    className="discharge_button"
                    type="button"
                    variant="outlined"
                    color="inherit"
                    onClick={() => handleAdjustClick(item)}
                  >
                    Adjust Quantity
                  </Button>
                )}
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

      <StockModal open={openStockModal} onClose={handleCloseModal}>
        <AdjustQuantityForm
          movement={selectedMovement}
          loading={updateStatus === "LOADING"}
          onSubmit={handleAdjustSubmit}
          onCancel={handleCloseModal}
        />
        {updateStatus === "FAIL" && (
          <div data-cy="adjust-quantity-error" className="adjust-quantity-error">
            <InfoBox type="error" message={updateErrorMessage} />
          </div>
        )}
      </StockModal>
    </div>
  );
}
