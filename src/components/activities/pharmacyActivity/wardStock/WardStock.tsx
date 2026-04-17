import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
import { PharmacyActivityContent } from "../PharmacyActivityContent";
import {
  WardMedicalsTable,
  WardMovementsTable,
  WardStockHeader,
} from "./components";
import RectifyQuantityModal from "./components/modal/RectifyQuantityModal";
import "./styles.scss";
import { useAppDispatch, useAppSelector } from "~/libraries/hooks/redux";
import { MedicalWardDTO } from "~/generated";
import { PATHS } from "~/consts";
import { getWards } from "~/state/wards";
import { getWardMedicals, getWardMovements } from "~/state/pharmacy";

export function WardStock() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [openRectify, setOpenRectify] = useState(false);
  const [selectedMedical, setSelectedMedical] = useState<MedicalWardDTO>();

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

  const handleOpenRectifyModal = (medical: MedicalWardDTO) => {
    setSelectedMedical(medical);
    setOpenRectify(true);
  };

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

  return (
    <PharmacyActivityContent
      data-cy="ward-stock"
      title={t("pharmacy.labels.ward-stock")}
    >
      <div className="ward-stock">
        <WardStockHeader />
        {filter.type === "drugs" ? (
          filter.ward?.code && (
            <WardMedicalsTable
              wardCode={filter.ward.code}
              onRectify={handleOpenRectifyModal}
            />
          )
        ) : (
          <WardMovementsTable />
        )}
      </div>
      <RectifyQuantityModal
        open={openRectify}
        pharmaceutical={selectedMedical}
        onClose={() => setOpenRectify(false)}
      />
    </PharmacyActivityContent>
  );
}
