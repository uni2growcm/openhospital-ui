import { CircularProgress } from "@mui/material";
import checkIcon from "assets/check-icon.png";
import ConfirmationDialog from "components/accessories/confirmationDialog/ConfirmationDialog";
import InfoBox from "components/accessories/infoBox/InfoBox";
import Table from "components/accessories/table/Table";
import { PATHS } from "consts";
import { MedicalDTO } from "generated";
import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { deleteMedical } from "state/medicals";
import { getMedicals } from "state/pharmacy";
interface PharmaceuticalTableProps {
  onDataChange: (data: any[]) => void;
}

export default function PharmaceuticalTable({
  onDataChange,
}: PharmaceuticalTableProps) {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const data = useAppSelector((state) =>
    state.pharmacy.getMedicals.data ? state.pharmacy.getMedicals.data : []
  );

  const status = useAppSelector((state) => state.pharmacy.getMedicals.status);

  const errorMessage = useAppSelector(
    (state) =>
      state.pharmacy.getMedicals.error?.message || t("errors.somethingwrong")
  ) as string;

  const labelData = {
    pharmaceutical: t("pharmacy.stock.pharmaceutical"),
    type: t("pharmacy.stock.type"),
    code: t("pharmacy.stock.code"),
    pcsperpck: t("pharmacy.stock.pcsperpck"),
    stock: t("pharmacy.stock.stock"),
    criticalValue: t("pharmacy.stock.criticalValue"),
    amc: t("pharmacy.stock.amc"),
  };

  const tableHeader = [
    "pharmaceutical",
    "type",
    "code",
    "pcsperpck",
    "stock",
    "criticalValue",
    "amc",
  ];

  const order = ["pcsperpck", "stock", "criticalValue", "amc", "code"];

  const typeOptions = useMemo(
    () =>
      Array.from(
        new Set(
          data
            .map((item) => item.type?.description)
            .filter((type): type is string => !!type)
        )
      ).sort((a, b) => a.localeCompare(b)),
    [data]
  );

  const filterColumns = useMemo(
    () => [
      {
        key: "pharmaceutical",
        label: t("pharmacy.stock.pharmaceutical"),
        type: "text" as const,
      },
      {
        key: "type",
        label: t("pharmacy.stock.type"),
        type: "select" as const,
        options: typeOptions.map((type) => ({ value: type, label: type })),
      },
      {
        key: "code",
        label: t("pharmacy.stock.code"),
        type: "number" as const,
      },
    ],
    [t, typeOptions]
  );

  const formattedData = useMemo(() => {
    return data.map((item) => {
      // Trouver la date d'expiration la plus proche parmi les lots
      let nearestExpiration: string | null = null;

      if (item.lots && item.lots.length > 0) {
        const now = new Date();

        // Filtrer les lots avec une date future valide
        const futureLots = item.lots.filter(
          (lot) => new Date(lot.dueDate) >= now
        );

        if (futureLots.length > 0) {
          // Trouver la plus proche
          const nearestLot = futureLots.reduce((prev, current) => {
            const prevDate = new Date(prev.dueDate);
            const currDate = new Date(current.dueDate);
            return currDate < prevDate ? current : prev;
          });
          nearestExpiration = nearestLot.dueDate;
        } else {
          // Si aucun lot futur, on peut choisir le plus récent (déjà expiré)
          const nearestLot = item.lots.reduce((prev, current) => {
            const prevDate = new Date(prev.dueDate);
            const currDate = new Date(current.dueDate);
            return currDate < prevDate ? current : prev;
          });
          nearestExpiration = nearestLot.dueDate;
        }
      }

      return {
        pharmaceutical: item.description,
        type: item.type?.description,
        code: item.code,
        pcsperpck: item.pcsperpck,
        stock: (item.initialqty || 0) + (item.inqty || 0) - (item.outqty || 0),
        criticalValue: item.minqty,
        amc: item.outqty,
        lots: item.lots,
        expDate: nearestExpiration,
        medicalData: item,
      };
    });
  }, [data]);

  const deletedStautus = useAppSelector(
    (state) => state.medicals.delete.status
  );
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);

  const handleDelete = useCallback(
    (medical: MedicalDTO) => {
      dispatch(deleteMedical(medical.code ?? 0))
        .unwrap()
        .then(() => setOpenConfirmDialog(true));
    },
    [dispatch]
  );
  const handleDialogActions = useCallback(() => {
    dispatch(getMedicals());
    if (deletedStautus === "SUCCESS") {
      setOpenConfirmDialog(false);
    }
  }, [dispatch, deletedStautus]);

  const handleEdit = useCallback(
    (medical: MedicalDTO) => {
      navigate(
        PATHS.pharmacy_pharmaceutical_update.replace(
          ":id",
          medical.code?.toString() ?? ""
        )
      );
    },
    [navigate]
  );

  const handleView = useCallback(
    (row: any) => {
      if (row.medicalData) {
        navigate(
          PATHS.pharmacy_pharmaceutical_detail.replace(
            ":id",
            row.code?.toString() ?? ""
          )
        );
      }
    },
    [navigate]
  );

  useEffect(() => {
    dispatch(getMedicals());
  }, [dispatch]);

  return (
    <div>
      {(() => {
        switch (status) {
          case "IDLE":
            return <CircularProgress />;
          case "SUCCESS":
            return (
              <>
                <Table
                  labelData={labelData}
                  tableHeader={tableHeader}
                  rowsPerPage={10}
                  columnsOrder={order}
                  rowClassNames={(row) => "pharmaceutical-table__row"}
                  initialOrderBy="code"
                  rowData={formattedData}
                  rawData={data.map((item) => ({
                    ...item,
                    pharmaceutical: item.description,
                    type: item.type?.description,
                    code: item.code,
                  }))}
                  filterColumns={filterColumns}
                  manualFilter={false}
                  showEmptyCell={false}
                  isCollapsabile={false}
                  detailColSpan={6}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onView={handleView}
                  onFilteredDataChange={onDataChange}
                />
              </>
            );
          case "SUCCESS_EMPTY":
            return <InfoBox type="info" message={t("common.emptydata")} />;
          case "FAIL":
            return <InfoBox type="error" message={errorMessage} />;
          default:
            return <CircularProgress />;
        }
      })()}

      <ConfirmationDialog
        isOpen={openConfirmDialog}
        title={t("pharmacy.messages.delete-pharmaceutical-success.title")}
        icon={checkIcon}
        info={t("pharmacy.messages.delete-pharmaceutical-success.description")}
        primaryButtonLabel="OK"
        handlePrimaryButtonClick={handleDialogActions}
        handleSecondaryButtonClick={handleDialogActions}
      />
    </div>
  );
}
