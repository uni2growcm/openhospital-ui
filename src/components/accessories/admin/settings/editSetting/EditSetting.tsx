import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import EditSettingForm from "./EditSettingForm";
import { SettingDTO } from "~/generated";
import { CustomDialog } from "~/components/accessories/customDialog/CustomDialog";

type IOwnProps = {
  setting: SettingDTO;
  open: boolean;
  onClose: () => void;
  onSucceed: () => void;
};

const EditSetting: FC<IOwnProps> = ({ open, setting, onClose, onSucceed }) => {
  const { t } = useTranslation();

  return (
    <CustomDialog
      description=""
      open={open}
      content={
        <EditSettingForm
          setting={setting}
          onCancel={onClose}
          onSucceed={onSucceed}
        />
      }
      onClose={onClose}
      title={t("settings.editdialogtitle", { name: setting.code })}
    />
  );
};

export default EditSetting;
