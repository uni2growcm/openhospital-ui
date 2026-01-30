import {
  CallMade,
  Edit,
  KeyboardArrowRight,
  TrendingDown,
  TrendingUp,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import Button from "components/accessories/button/Button";
import { PATHS } from "consts";
import { MedicalDTO } from "generated";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { getPharmacyData, getWardsData } from "./consts";
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

  const navigate = useNavigate();

  const handleEdit = useCallback(() => {
    navigate(`${PATHS.pharmacy_pharmaceutical}/${medical?.code}/update`);
  }, [navigate, medical?.code]);

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

  const pharmacyData = getPharmacyData(medical);
  const wardsData = getWardsData(medical);

  return (
    <div data-cy="medical-details" className="medicalDetails">
      <div className="medicalDetails__container">
        <div className="medicalDetails__sidebar">
          <div className="medicalDetails__sidebar__header">
            <div className="medicalDetails__sidebar__type">
              {medical.type?.description || "MEDICAL"}
            </div>
            <div className="medicalDetails__sidebar__name">
              {medical.prodCode && medical.description
                ? `${medical.description} ${medical.prodCode}`
                : medical.description || "Medical"}
            </div>
          </div>

          <div className="medicalDetails__sidebar__button">
            <Button variant="contained" color="primary" onClick={handleEdit}>
              <Edit fontSize="small" />
              <span>{t("pharmacy.medicalDetails.edit")}</span>
            </Button>
          </div>

          <div className="medicalDetails__sidebar__info">
            <div className="medicalDetails__sidebar__item">
              <div className="medicalDetails_status_wrapper medicalDetails_status_in">
                <h6 className="medicalDetails__sidebar__item__label">
                  {t("pharmacy.medicalDetails.status")}:{" "}
                  <span className="medicalDetails__sidebar__item__value">
                    {t("pharmacy.medicalDetails.available")}
                  </span>
                </h6>
              </div>
            </div>

            <div className="medicalDetails__sidebar__item">
              <span className="medicalDetails__sidebar__item__label">
                {t("pharmacy.medicalDetails.piecesPerPack")}
              </span>
              <span className="medicalDetails__sidebar__item__value">
                {medical.pcsperpck || 0}
              </span>
            </div>

            <div className="medicalDetails__sidebar__item">
              <span className="medicalDetails__sidebar__item__label">
                {t("pharmacy.medicalDetails.criticalLevel")}
              </span>
              <span className="medicalDetails__sidebar__item__value">
                {medical.minqty || 0}
              </span>
            </div>

            <div className="medicalDetails__sidebar__item">
              <span className="medicalDetails__sidebar__item__label">
                {t("pharmacy.medicalDetails.code")}
              </span>
              <span className="medicalDetails__sidebar__item__value">
                {medical.prodCode || "-"}
              </span>
            </div>
          </div>

          <div className="medicalDetails__sidebar__menu">
            <div className="medicalDetails__sidebar__menu__item">
              <span>≡ {t("pharmacy.medicalDetails.overview")}</span>
              <KeyboardArrowRight fontSize="small" />
            </div>
          </div>
        </div>

        <div className="medicalDetails__content">
          <div className="medicalDetails__section">
            <h5 className="medicalDetails__section__title">
              {t("pharmacy.medicalDetails.pharmacy")}
            </h5>
            <div className="medicalDetails__cards">
              {pharmacyData.map((item, index) => (
                <div key={index} className="medicalDetails__card">
                  <div className="medicalDetails__card__content">
                    <div className="medicalDetails__card__label">
                      {t(item.title)}
                      {item.icon && item.icon === "up" && (
                        <TrendingUp fontSize="small" className="icon-up" />
                      )}
                      {item.icon && item.icon === "down" && (
                        <TrendingDown fontSize="small" className="icon-down" />
                      )}
                    </div>
                    <div className="medicalDetails__card__value">
                      {item.value}
                    </div>
                  </div>
                  {!item.removeIcon && (
                    <div className="medicalDetails__card__icon">
                      <div>
                        <CallMade fontSize="small" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="medicalDetails__section">
            <h5 className="medicalDetails__section__title">
              {t("pharmacy.medicalDetails.wards")}
            </h5>
            <div className="medicalDetails__cards">
              {wardsData.map((item, index) => (
                <div key={index} className="medicalDetails__card">
                  <div className="medicalDetails__card__content">
                    <div className="medicalDetails__card__label">
                      {t(item.title)}
                    </div>
                    <div className="medicalDetails__card__value">
                      {item.value}
                    </div>
                  </div>
                  <div className="medicalDetails__card__icon ">
                    <div>
                      <CallMade fontSize="small" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalDetailsActivity;
