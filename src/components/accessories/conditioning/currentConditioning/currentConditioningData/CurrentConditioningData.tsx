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
      <div className="currentConditioningData__leading">
        {onEdit && (
          <IconButton onClick={onEdit}>
            <Edit />
          </IconButton>
        )}
      </div>
      <div className="currentConditioningData__content">
        {!isEmpty(conditioning?.date) && (
          <div className="currentConditioningData__item">
            <span className="item_label">{t("conditioning.date")}</span>
            <p className="item_content">{renderDateTime(conditioning?.date)}</p>
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

        {!isEmpty(conditioning?.mceDuree) && (
          <div className="currentConditioningData__item">
            <span className="item_label">{t("conditioning.mceDuree")}</span>
            <p className="item_content">{conditioning.mceDuree}</p>
          </div>
        )}

        {!isEmpty(conditioning?.ventilationDuree) && (
          <div className="currentConditioningData__item">
            <span className="item_label">
              {t("conditioning.ventilationDuree")}
            </span>
            <p className="item_content">{conditioning.ventilationDuree}</p>
          </div>
        )}

        {!isEmpty(conditioning?.oxygeneDebit) && (
          <div className="currentConditioningData__item">
            <span className="item_label">{t("conditioning.oxygeneDebit")}</span>
            <p className="item_content">{conditioning.oxygeneDebit}</p>
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

        {!isEmpty(conditioning?.sngNumero) && (
          <div className="currentConditioningData__item">
            <span className="item_label">{t("conditioning.sngNumero")}</span>
            <p className="item_content">{conditioning.sngNumero}</p>
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
