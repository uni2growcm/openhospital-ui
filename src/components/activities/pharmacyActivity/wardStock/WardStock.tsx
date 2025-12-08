import { PATHS } from "consts";
import { downloadBlob } from "libraries/downloadUtils/downloardUtils";
import { formatDateToCustomISO } from "libraries/formatUtils";
import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
import {
  getWardMedicals,
  getWardMovements,
  printPharmaceuticalStockWardPdf,
} from "state/pharmacy";
import { getWards } from "state/ward";
import { PharmacyActivityContent } from "../PharmacyActivityContent";
import {
  WardMedicalsTable,
  WardMovementsTable,
  WardStockHeader,
} from "./components";
import "./styles.scss";

export function WardStock() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { breadcrumbMap, setBreadcrumbMap } = useOutletContext<{
    breadcrumbMap: Record<string, string>;
    setBreadcrumbMap: (map: Record<string, string>) => void;
  }>();

  const addBreadcrumb = () => {
    setBreadcrumbMap({
      ...breadcrumbMap,
      [t("pharmacy.labels.ward-stock")]: PATHS.pharmacy_ward_stock,
    });
  };

  const removeBreadcrumb = () => {
    const updatedMap = { ...breadcrumbMap };
    delete updatedMap[t("pharmacy.labels.pharmaceutical-stock")];
    setBreadcrumbMap(updatedMap);
  };

  const filter = useAppSelector((state) => state.pharmacy.wardStock.filter);

  useEffect(() => {
    addBreadcrumb();
    return () => {
      removeBreadcrumb();
    };
  }, []);

  useEffect(() => {
    dispatch(getWards());
  }, [dispatch]);

  useEffect(() => {
    if (filter.ward?.code) {
      if (filter.type === "drugs") {
        dispatch(getWardMedicals({ wardCode: filter.ward.code }));
      } else {
        dispatch(getWardMovements({ wardCode: filter.ward.code }));
      }
    }
  }, [dispatch, filter]);

  const handleGetReport = (wardCode: string, action: string) => {
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
      console.log(action, wardCode);
    }
  };

  return (
    <PharmacyActivityContent
      data-cy="ward-stock"
      title={t("pharmacy.labels.ward-stock")}
    >
      <div className="ward-stock">
        <WardStockHeader handleExportReport={handleGetReport} />
        {filter.type === "drugs" ? (
          <WardMedicalsTable />
        ) : (
          <WardMovementsTable />
        )}
      </div>
    </PharmacyActivityContent>
  );
}
