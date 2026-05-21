import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import { Permission } from "libraries/permissionUtils/Permission";
import { scrollToElement } from "libraries/uiUtils/scrollToElement";
import React, { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import {
  newHospitalizationConsultation,
  newHospitalizationConsultationReset,
  updateHospitalizationConsultation,
  updateHospitalizationConsultationReset
} from "state/hospitalisationconsultation";
import { IState } from "types";
import checkIcon from "../../../assets/check-icon.png";
import failIcon from "../../../assets/fail-icon.png";
import { HospitalizationConsultationDTO } from "../../../generated";
import ConfirmationDialog from "../confirmationDialog/ConfirmationDialog";
import InfoBox from "../infoBox/InfoBox";
import HospitalisationconsultationForm from "./hospitalisationconsultationForm/HospitalisationconsultationForm";
import HospitalisationconsultationTable from "./hospitalisationconsultationTable/HospitalisationconsultationTable";
import "./styles.scss";
import { HospitalisationconsultationTransitionState } from "./types";
import { useFields } from "./useFields";

const Hospitalisationconsultation: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { id, code } = useParams<{ id: string; code?: string }>();

  const [shouldResetForm, setShouldResetForm] = useState(false);
  const [creationMode, setCreationMode] = useState(true);
  const [shouldUpdateTable, setShouldUpdateTable] = useState(false);
  const [activityTransitionState, setActivityTransitionState] = useState<HospitalisationconsultationTransitionState>("IDLE");
  const [consultationToEdit, setConsultationToEdit] = useState<HospitalizationConsultationDTO | undefined>(undefined);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const infoBoxRef = useRef<HTMLDivElement>(null);

  const encounter = useAppSelector((state) =>
    code
      ? state.encounters.getEncountersByPatient.data?.find(
        (item) => item.patient.code?.toString() === id && item.code === code
      )
      : state.encounters.getCurrentEncounterByPatient.data
  );

  const patient = useAppSelector((state: IState) => state.patients.selectedPatient.data);

  const createStatus = useAppSelector((state) => state.hospitalisationconsultations.newHospitalizationConsultation.status);
  const updateStatus = useAppSelector((state) => state.hospitalisationconsultations.updateHospitalizationConsultation.status);

  const errorMessage = useAppSelector((state) =>
    state.hospitalisationconsultations.newHospitalizationConsultation.error?.message ||
    state.hospitalisationconsultations.updateHospitalizationConsultation.error?.message ||
    t("common.somethingwrong")
  );

  useEffect(() => {
    if (createStatus === "FAIL" || updateStatus === "FAIL") {
      setActivityTransitionState("FAIL");
      scrollToElement(infoBoxRef.current);
    }
  }, [createStatus, updateStatus]);

  const fields = useFields(consultationToEdit);

  const onSubmit = (consultation: HospitalizationConsultationDTO) => {
    setShouldResetForm(false);

    if (!encounter && !code) {
      setOpenConfirmDialog(true);
      return;
    }

    const payload = { ...consultation };

    if (encounter) {
      payload.encounter = encounter;
    } else if (patient) {
      payload.encounter = { patient: patient } as any;
    }

    if (creationMode) {
      dispatch(newHospitalizationConsultation(payload));
    } else {
      payload.id = consultationToEdit?.id!;
      dispatch(updateHospitalizationConsultation({ id: payload.id, body: payload }));
    }
  };

  useEffect(() => {
    if (activityTransitionState === "TO_RESET") {
      dispatch(newHospitalizationConsultationReset());
      dispatch(updateHospitalizationConsultationReset());
      setShouldResetForm(true);
      setShouldUpdateTable(prev => !prev);
      setActivityTransitionState("IDLE");
    }
  }, [dispatch, activityTransitionState]);

  const resetFormCallback = () => {
    setCreationMode(true);
    setShouldResetForm(false);
    setConsultationToEdit(undefined);
  };

  const onEdit = (row: HospitalizationConsultationDTO) => {
    setCreationMode(false);
    setConsultationToEdit(row);
    scrollToElement(null);
  };

  return (
    <div className="hospitalisationconsultation">
      {(!encounter?.closedAt || !encounter) && (
        <Permission require="hospitalisationconsultation.create">
          <HospitalisationconsultationForm
            fields={fields}
            creationMode={creationMode}
            submitButtonLabel={consultationToEdit ? t("common.update") : t("common.save")}
            resetButtonLabel={t("common.reset")}
            isLoading={createStatus === "LOADING" || updateStatus === "LOADING"}
            onSubmit={onSubmit}
            shouldResetForm={shouldResetForm}
            resetFormCallback={resetFormCallback}
          />
        </Permission>
      )}

      {activityTransitionState === "FAIL" && (
        <div ref={infoBoxRef} className="info-box-container">
          <InfoBox type="error" message={errorMessage} />
        </div>
      )}

      <HospitalisationconsultationTable
        handleEdit={encounter?.closedAt ? undefined : onEdit}
        shouldUpdateTable={shouldUpdateTable}
      />

      <ConfirmationDialog
        isOpen={createStatus === "SUCCESS" || updateStatus === "SUCCESS"}
        title={creationMode ? t("hospitalisationconsultation.created") : t("hospitalisationconsultation.updated")}
        icon={checkIcon}
        info={creationMode ? t("hospitalisationconsultation.createsuccess") : t("hospitalisationconsultation.updatesuccess")}
        primaryButtonLabel="Ok"
        handlePrimaryButtonClick={() => setActivityTransitionState("TO_RESET")}
        handleSecondaryButtonClick={() => ({})}
      />

      <ConfirmationDialog
        isOpen={openConfirmDialog}
        title={t("encounters.information")}
        icon={failIcon}
        info={t("encounters.informationmessage")}
        primaryButtonLabel="Ok"
        handlePrimaryButtonClick={() => setOpenConfirmDialog(false)}
        handleSecondaryButtonClick={() => ({})}
      />
    </div>
  );
};

export default Hospitalisationconsultation;