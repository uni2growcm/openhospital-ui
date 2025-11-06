import { CircularProgress } from "@mui/material";
import ConfirmationDialog from "components/accessories/confirmationDialog/ConfirmationDialog";
import ConfirmationDialogAjust from "components/accessories/confirmationDialogAjust/ConfirmationDialogAjust";
import InfoBox from "components/accessories/infoBox/InfoBox";
import Table from "components/accessories/table/Table";
import { TFilterField } from "components/accessories/table/filter/types";
import { renderDateTime } from "libraries/formatUtils/dataFormatting";
import { useTranslation } from "libraries/hooks";
import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import React, { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { getMovements } from "state/pharmacy";
import { AjustFormValues } from "./types";
import { ajustSchema, getInitialValues } from "./consts";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";

export function StockTable() {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const [openAdjustConfirmation, setOpenAdjustConfirmation] =
    React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<any>(null);

  const data = useAppSelector((state) =>
    state.pharmacy.getMovements.data ? state.pharmacy.getMovements.data : []
  );

  const status = useAppSelector((state) => state.pharmacy.getMovements.status);

  const errorMessage = useAppSelector(
    (state) =>
      state.pharmacy.getMovements.error?.message || t("errors.somethingwrong")
  ) as string;

  const adjustQuantityHandler = (row: any) => {
    setSelectedRow(row);
    setValue("lastQuantity", row.quantity);
    setOpenAdjustConfirmation(true);
  };

  const labelData = {
    refNo: t("pharmacy.stock.refNo"),
    lot: t("pharmacy.stock.lot"),
    expDate: t("pharmacy.stock.expDate"),
    type: t("pharmacy.stock.type"),
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
      quantity: item.quantity,
      medical: item.medical?.description,
      cost: item.lot?.cost,
      total: item.lot?.cost ? item.lot.cost * item.quantity : "",
      prepDate: renderDateTime(item.lot?.preparationDate),
    }));
  }, [t, data]);

  const { control, setValue, handleSubmit, formState } =
    useForm<AjustFormValues>({
      resolver: standardSchemaResolver(ajustSchema),
      defaultValues: getInitialValues({
        lastQuantity: selectedRow?.quantity,
        newQuantity: 0,
      }),
    });

  const values = useWatch({
    control,
    compute: (values) => {
      return {
        ...values,
      };
    },
  });

  const ajustQuantityHandler = (row: any) => {
    setSelectedRow(row);
    setOpenAdjustConfirmation(true);
  };

  // useEffect(() => {
  //   if (formState.isValid) {
  //     onSubmit(values as any as AjustFormValues);
  //   }
  // }, [values]);

  const onSubmit = (values: AjustFormValues) => {
    console.log("onSubmit");
    console.log(values);
    setOpenAdjustConfirmation(false);
  };

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
                initialOrderBy="quantity"
                rowData={formattedData}
                dateFields={dateFields}
                showEmptyCell={false}
                isCollapsabile={true}
                detailColSpan={6}
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
                adjustQuantityHandler={adjustQuantityHandler}
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
      <ConfirmationDialogAjust
        isOpen={openAdjustConfirmation}
        title={t("pharmacy.stock.adjustQuantity")}
        info={selectedRow ? selectedRow.medical : ""}
        control={control}
        primaryButtonLabel={t("common.confirm")}
        secondaryButtonLabel={t("common.cancel")}
        handlePrimaryButtonClick={() => {
          // Appelle ici la fonction réelle d’ajustement
          console.log("Quantité ajustée pour :", selectedRow);
          onSubmit(values as any as AjustFormValues);
          setOpenAdjustConfirmation(false);
        }}
        handleSecondaryButtonClick={() => setOpenAdjustConfirmation(false)}
        icon={""}
      />
    </div>
  );
}
