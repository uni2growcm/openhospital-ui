import { PATHS } from "consts";
import { MedicalDTO } from "generated";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
import { PharmacyActivityContent } from "../PharmacyActivityContent";
import PharmaceuticalActions from "./components/pharmaceuticalActions/PharmaceuticalActions";
import PharmaceuticalTable from "./components/pharmaceuticalTable/PharmaceuticalTable";
import MedicalDetailsActivity from "./components/medicalDetails/MedicalDetailsActivity";

export default function Pharmaceutical() {
  const { t } = useTranslation();
  const [selectedMedical, setSelectedMedical] = useState<MedicalDTO | null>(
    null
  );
  const { setBreadcrumbMap } = useOutletContext<{
    breadcrumbMap: Record<string, string>;
    setBreadcrumbMap: (map: Record<string, string>) => void;
  }>();

  useEffect(() => {
    setBreadcrumbMap({
      [t("nav.pharmacy")]: PATHS.pharmacy,
      [t("pharmacy.labels.pharmaceutical-title")]:
        PATHS.pharmacy_pharmaceutical,
    });
    return () => {
      setBreadcrumbMap({
        [t("nav.pharmacy")]: PATHS.pharmacy,
      });
    };
  }, [t, setBreadcrumbMap]);

  if (selectedMedical) {
    return (
      <MedicalDetailsActivity
        medical={selectedMedical}
        onClose={() => setSelectedMedical(null)}
      />
    );
  }

  return (
    <PharmacyActivityContent
      data-cy="pharmaceutical"
      title={t("pharmacy.labels.pharmaceutical-title")}
    >
      <div className="pharmaceutical">
        <div data-cy="pharmaceutical-actions">
          <PharmaceuticalActions data-cy="pharmaceutical-actions" />
        </div>

        <div data-cy="pharmaceutical-table">
          <PharmaceuticalTable onSelectMedical={setSelectedMedical} />
        </div>
      </div>
    </PharmacyActivityContent>
  );
}
