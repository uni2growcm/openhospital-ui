import React from "react";
import { useTranslation } from "react-i18next";
import "./styles.scss";

interface MedicalDetailsMenuProps {
  medicalCode?: number;
}

const MedicalDetailsMenu: React.FC<MedicalDetailsMenuProps> = ({
  medicalCode,
}) => {
  const { t } = useTranslation();

  return (
    <div className="medicalDetailsMenu" data-cy="medical-details-menu">
      <div className="medicalDetailsMenu__section">
        <h6 className="medicalDetailsMenu__title">
          {t("pharmacy.medicalDetails.menu.pharmacyStock")}
        </h6>
        <div className="medicalDetailsMenu__item">
          <span>{t("pharmacy.medicalDetails.menu.availableStock")}</span>
        </div>
        <div className="medicalDetailsMenu__item">
          <span>{t("pharmacy.medicalDetails.menu.expiringSoon")}</span>
        </div>
      </div>

      <div className="medicalDetailsMenu__section">
        <h6 className="medicalDetailsMenu__title">
          {t("pharmacy.medicalDetails.menu.wardDistribution")}
        </h6>
        <div className="medicalDetailsMenu__item">
          <span>{t("pharmacy.medicalDetails.menu.internalMedicine")}</span>
        </div>
        <div className="medicalDetailsMenu__item">
          <span>{t("pharmacy.medicalDetails.menu.maternity")}</span>
        </div>
        <div className="medicalDetailsMenu__item">
          <span>{t("pharmacy.medicalDetails.menu.nursery")}</span>
        </div>
        <div className="medicalDetailsMenu__item">
          <span>{t("pharmacy.medicalDetails.menu.surgery")}</span>
        </div>
      </div>
    </div>
  );
};

export default MedicalDetailsMenu;
