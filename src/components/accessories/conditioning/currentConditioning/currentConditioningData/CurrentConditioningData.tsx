import { Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { ConditioningDTO } from "generated";
import { renderDateTime } from "libraries/formatUtils/dataFormatting";
import { isEmpty } from "lodash";
import React, { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import "../styles.scss";

interface IOwnProps {
  onEdit?: () => void;
  conditioning: ConditioningDTO;
}

export const CurrentConditioningData: FunctionComponent<IOwnProps> = ({
  onEdit,
  conditioning,
}) => {
  const { t } = useTranslation();

  return (
    <div className="currentConditioningData">
      <div className="currentConditioningData_leading">
        {onEdit && (
          <IconButton onClick={onEdit}>
            <Edit />
          </IconButton>
        )}
      </div>
      <div className="currentConditioningData__content">
        {!isEmpty(conditioning?.performedAt) && (
          <div className="currentConditioningData__item">
            <span className="item_label">{t("conditioning.performedAt")}</span>
            <p className="item_content">
              {renderDateTime(conditioning?.performedAt)}
            </p>
          </div>
        )}

        {!isEmpty(conditioning?.aspiration) && (
          <div className="currentConditioningData__item">
            <span className="item_label">{t("conditioning.aspiration")}</span>
            <p className="item_content">
              {conditioning.aspiration ? t("common.yes") : t("common.no")}
            </p>
          </div>
        )}

        {!isEmpty(conditioning?.mce) && (
          <div className="currentConditioningData__item">
            <span className="item_label">{t("conditioning.mce")}</span>
            <p className="item_content">{conditioning.mce}</p>
          </div>
        )}

        {!isEmpty(conditioning?.ventilation) && (
          <div className="currentConditioningData__item">
            <span className="item_label">{t("conditioning.ventilation")}</span>
            <p className="item_content">{conditioning.ventilation}</p>
          </div>
        )}

        {!isEmpty(conditioning?.oxygenDebit) && (
          <div className="currentConditioningData__item">
            <span className="item_label">{t("conditioning.oxygenDebit")}</span>
            <p className="item_content">{conditioning.oxygenDebit}</p>
          </div>
        )}

        {!isEmpty(conditioning?.sgVolume) && (
          <div className="currentConditioningData__item">
            <span className="item_label">{t("conditioning.sgVolume")}</span>
            <p className="item_content">{conditioning.sgVolume}</p>
          </div>
        )}

        {!isEmpty(conditioning?.diazepamDose) && (
          <div className="currentConditioningData__item">
            <span className="item_label">{t("conditioning.diazepamDose")}</span>
            <p className="item_content">{conditioning.diazepamDose}</p>
          </div>
        )}

        {!isEmpty(conditioning?.bolusSsVolume) && (
          <div className="currentConditioningData__item">
            <span className="item_label">
              {t("conditioning.bolusSsVolume")}
            </span>
            <p className="item_content">{conditioning.bolusSsVolume}</p>
          </div>
        )}

        {!isEmpty(conditioning?.sngNumber) && (
          <div className="currentConditioningData__item">
            <span className="item_label">{t("conditioning.sngNumber")}</span>
            <p className="item_content">{conditioning.sngNumber}</p>
          </div>
        )}

        {!isEmpty(conditioning?.others) && (
          <div className="fullWidth currentConditioningData__item">
            <span className="item_label">{t("conditioning.others")}</span>
            <p className="item_content">{conditioning.others}</p>
          </div>
        )}
      </div>
    </div>
  );
};
