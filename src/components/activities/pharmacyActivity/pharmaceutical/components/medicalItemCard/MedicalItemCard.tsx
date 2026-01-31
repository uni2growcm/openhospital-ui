import { CallMade, TrendingDown, TrendingUp } from "@mui/icons-material";
import React from "react";
import { useTranslation } from "react-i18next";
import type { MedicalItemData } from "../medicalDetails/types";
import "./styles.scss";

interface MedicalItemCardProps {
  title: string;
  items: MedicalItemData[];
}

const MedicalItemCard = ({ title, items }: MedicalItemCardProps) => {
  const { t } = useTranslation();

  return (
    <div className="medicalItem">
      <h5 className="medicalItem__title">{t(title)}</h5>

      <div data-cy="medical-item-card" className="medicalItem__cards">
        {items.map((item, index) => (
          <div key={index} className="medicalItem__card">
            <div className="medicalItem__card__content">
              <div className="medicalItem__card__label">
                {t(item.title)}

                {item.icon === "up" && (
                  <TrendingUp fontSize="small" className="icon-up" />
                )}
                {item.icon === "down" && (
                  <TrendingDown fontSize="small" className="icon-down" />
                )}
              </div>

              <div className="medicalItem__card__value">{item.value}</div>
            </div>

            {!item.removeIcon && (
              <div className="medicalItem__card__icon">
                <div>
                  <CallMade fontSize="small" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicalItemCard;
