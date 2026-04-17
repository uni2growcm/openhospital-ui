import { MedicalServices, Medication, SyncAlt } from "@mui/icons-material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import LargeButton from "../../accessories/largeButton/LargeButton";
import { PATHS } from "../../../consts";
import { PharmacyActivityContent } from "./PharmacyActivityContent";

const actions = [
  { icon: Medication, key: "pharmaceutical", path: PATHS.pharmacy_pharmaceutical },
  { icon: MedicalServices, key: "pharmaceutical-stock", path: PATHS.pharmacy_pharmaceuticalstock },
  { icon: SyncAlt, key: "ward-stock", path: PATHS.pharmacy_ward_stock },
];

export function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <PharmacyActivityContent title={t("nav.pharmacy")} data-cy="pharmacy-home">
      <div className="pharmacy__actions">
        {actions.map((action) => (
          <LargeButton
            key={action.key}
            handleClick={() => {
              navigate(action.path);
            }}
            data-cy={action.key}
          >
            <div className="largeButton__inner">
              <action.icon />
              <div className="largeButton__inner__label">
                {t(`pharmacy.labels.${action.key}`)}
              </div>
            </div>
          </LargeButton>
        ))}
      </div>
    </PharmacyActivityContent>
  );
}
