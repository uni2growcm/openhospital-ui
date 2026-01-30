import { Edit } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import Button from "components/accessories/button/Button";
import { PATHS } from "consts";
import { MedicalDTO } from "generated";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./styles.scss";

interface MedicalDetailsActivityProps {
  medical?: MedicalDTO;
  onClose?: () => void;
}

const MedicalDetailsActivity = ({
  medical,
  onClose,
}: MedicalDetailsActivityProps) => {
  const { t } = useTranslation();
  const [isLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="medicalDetails__loading">
        <CircularProgress />
      </div>
    );
  }

  if (!medical) {
    return null;
  }

  const data = medical as MedicalDTO;

  const handleEdit = () => {
    window.location.href = `${PATHS.pharmacy_pharmaceutical}/${data.code}/update`;
  };

  return (
    <div data-cy="medical-details" className="medicalDetails">
      <div className="medicalDetails__panel">
        <div className="medicalDetails__personalData">
          <div className="medicalDetails__personalData_sidebar">
            <div className="medicalDetails__profilePictureContainer_wrapper">
              <div className="medicalDetails__header__info">
                <div className="medicalDetails__header__info__item">
                  {data.type?.description || "MEDICAL"}
                </div>
              </div>
            </div>

            <div className="medicalDetails__personalData_edit_button_wrapper">
              <div className="medicalDetails__personalData_edit_button">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEdit}
                >
                  <Edit fontSize="small" />
                  <span>{t("pharmacy.medicalDetails.edit")}</span>
                </Button>
              </div>
            </div>

            <div className="medicalDetails__main_menu">
              <div className="medicalDetails__personalData__item">
                <div className="medicalDetails__personalData__item__label">
                  {t("pharmacy.medicalDetails.status")}
                </div>
                <div className="medicalDetails__personalData__item__value">
                  {t("pharmacy.medicalDetails.available")}
                </div>
              </div>

              <div className="medicalDetails__personalData__item">
                <div className="medicalDetails__personalData__item__label">
                  {t("pharmacy.medicalDetails.piecesPerPack")}
                </div>
                <div className="medicalDetails__personalData__item__value">
                  {data.pcsperpck || 0}
                </div>
              </div>

              <div className="medicalDetails__personalData__item">
                <div className="medicalDetails__personalData__item__label">
                  {t("pharmacy.medicalDetails.criticalLevel")}
                </div>
                <div className="medicalDetails__personalData__item__value">
                  {data.minqty || 0}
                </div>
              </div>

              <div className="medicalDetails__personalData__item">
                <div className="medicalDetails__personalData__item__label">
                  {t("pharmacy.medicalDetails.code")}
                </div>
                <div className="medicalDetails__personalData__item__value">
                  {data.prodCode || "-"}
                </div>
              </div>

              <h6>{t("pharmacy.medicalDetails.mainMenu")}</h6>
              <div className="medicalDetails__main_menu__item">
                ≡ {t("pharmacy.medicalDetails.overview")}
                <span className="icon_toggle">›</span>
              </div>
            </div>

            <div className="medicalDetails__personalData_edit_button_wrapper">
              <div className="medicalDetails__personalData_edit_button">
                <Button variant="outlined" onClick={onClose}>
                  <span>{t("pharmacy.medicalDetails.back")}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="medicalDetails__content">
          <div className="medicalDetails__nested_content">
            <h6 className="medicalDetails__sectionTitle">
              {t("pharmacy.medicalDetails.pharmacy")}
            </h6>
            <div className="medicalDetails__cards">
              <div className="card-item">
                <div className="card-label">
                  {t("pharmacy.medicalDetails.pharmaceuticalStock")}
                </div>
                <div className="card-value">{data.initialqty || 0}</div>
              </div>
              <div className="card-item">
                <div className="card-label">
                  {t("pharmacy.medicalDetails.lotsExpiringThisMonth")}
                </div>
                <div className="card-value">{data.lots?.length || 0}</div>
              </div>
              <div className="card-item">
                <div className="card-label">
                  {t("pharmacy.medicalDetails.criticalLevel")}
                </div>
                <div className="card-value">{data.minqty || 0}</div>
              </div>
              <div className="card-item">
                <div className="card-label">
                  {t("pharmacy.medicalDetails.amc")}
                </div>
                <div className="card-value">{data.outqty || 0}</div>
              </div>
            </div>

            <h6 className="medicalDetails__sectionTitle">
              {t("pharmacy.medicalDetails.wards")}
            </h6>
            <div className="medicalDetails__cards">
              <div className="card-item">
                <div className="card-label">
                  {t("pharmacy.medicalDetails.stockInInternalMedicine")}
                </div>
                <div className="card-value">
                  {Math.floor((data.inqty || 0) * 0.3)}
                </div>
              </div>
              <div className="card-item">
                <div className="card-label">
                  {t("pharmacy.medicalDetails.stockInMaternity")}
                </div>
                <div className="card-value">
                  {Math.floor((data.inqty || 0) * 0.25)}
                </div>
              </div>
              <div className="card-item">
                <div className="card-label">
                  {t("pharmacy.medicalDetails.stockInNursery")}
                </div>
                <div className="card-value">
                  {Math.floor((data.inqty || 0) * 0.2)}
                </div>
              </div>
              <div className="card-item">
                <div className="card-label">
                  {t("pharmacy.medicalDetails.stockInSurgery")}
                </div>
                <div className="card-value">
                  {Math.floor((data.inqty || 0) * 0.25)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalDetailsActivity;
