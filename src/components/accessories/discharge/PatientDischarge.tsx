import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import React, { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { updateEncounter } from "state/encounter";
import { getPatient } from "state/patients";
import warningIcon from "../../../assets/warning-icon.png";
import { AdmissionDTO, EncounterDTO } from "../../../generated";
import { parseDateTime } from "../../../libraries/formDataHandling/functions";
import { scrollToElement } from "../../../libraries/uiUtils/scrollToElement";
import {
  dischargePatient,
  dischargePatientReset,
  getCurrentAdmission,
} from "../../../state/admissions";
import { IState } from "../../../types";
import { CurrentAdmission } from "../currentAdmission/CurrentAdmission";
import CloseEncounterDialog from "../encounters/closeEncounterDialog/CloseEncounterDialog";
import InfoBox from "../infoBox/InfoBox";
import DischargeForm from "./dischargeForm/DischargeForm";
import "./styles.scss";
import { AdmissionTransitionState } from "./types";
import { useFields } from "./useFields";

const PatientDischarge: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const infoBoxRef = useRef<HTMLDivElement>(null);
  const [shouldResetForm, setShouldResetForm] = useState(false);
  const [, setShouldUpdateTable] = useState(false);
  const [activityTransitionState, setActivityTransitionState] =
    useState<AdmissionTransitionState>("IDLE");

  const [openCloseEncounterDialog, setOpenCloseEncounterDialog] =
    useState(false);

  const currentAdmission = useAppSelector(
    (state: IState) => state.admissions.currentAdmissionByPatientId.data
  );

  const currentAdmissionStatus = useAppSelector(
    (state: IState) => state.admissions.currentAdmissionByPatientId.status
  );

  const currentEncounter = useAppSelector(
    (state: IState) => state.encounters.getCurrentEncounterByPatient.data
  );

  const fields = useFields(currentAdmission);

  const patient = useAppSelector(
    (state: IState) => state.patients.selectedPatient.data
  );

  const dischargeStatus = useAppSelector(
    (state) => state.admissions.dischargePatient.status
  );

  const errorMessage = useAppSelector(
    (state) =>
      state.admissions.dischargePatient.error?.message ||
      state.admissions.currentAdmissionByPatientId.error?.message
  ) as string;

  const onSubmit = (adm: AdmissionDTO) => {
    setShouldResetForm(false);
    if (currentAdmission) {
      const dischargeToSave: AdmissionDTO = {
        ...currentAdmission,
        disDate: parseDateTime(adm.disDate ?? ""),
        disType: adm.disType,
        diseaseOut1: adm.diseaseOut1,
        diseaseOut2: adm.diseaseOut2,
        diseaseOut3: adm.diseaseOut3,
        note: adm.note,
        admitted: 0,
      };
      dispatch(
        dischargePatient({
          patientCode: patient?.code ?? -1,
          admissionDTO: dischargeToSave,
        })
      );
    }
  };

  const closeEncounter = (closureDate: string) => {
    if (!currentEncounter) return;
    const encounterToUpdate = {
      ...currentEncounter,
      closedAt: closureDate,
    } as EncounterDTO;
    dispatch(
      updateEncounter({
        code: currentEncounter.code!,
        body: encounterToUpdate,
      })
    );
    setOpenCloseEncounterDialog(false);
    setActivityTransitionState("TO_RESET");
  };

  useEffect(() => {
    if (dischargeStatus === "FAIL" || currentAdmissionStatus === "FAIL") {
      setActivityTransitionState("FAIL");
      scrollToElement(infoBoxRef.current);
    }
  }, [dischargeStatus, currentAdmissionStatus]);

  useEffect(() => {
    if (dischargeStatus === "SUCCESS") {
      setOpenCloseEncounterDialog(true);
    }
  }, [dischargeStatus]);

  useEffect(() => {
    dispatch(dischargePatientReset());
  }, [dispatch]);

  useEffect(() => {
    if (activityTransitionState === "TO_RESET") {
      dispatch(getCurrentAdmission(patient?.code));
      dispatch(getPatient((patient?.code ?? 0).toString()));
      dispatch(dischargePatientReset());
      setShouldResetForm(true);
      setActivityTransitionState("IDLE");
    }
  }, [dispatch, activityTransitionState]);

  const resetFormCallback = () => {
    setShouldResetForm(false);
    setShouldUpdateTable(false);
    setActivityTransitionState("IDLE");
    scrollToElement(null);
  };

  useEffect(() => {
    dispatch(getCurrentAdmission(patient?.code));
  }, [patient, dispatch]);

  return (
    <div className="patientAdmission">
      {currentAdmissionStatus === "SUCCESS" && (
        <>
          <CurrentAdmission />
          <DischargeForm
            fields={fields}
            onSubmit={onSubmit}
            submitButtonLabel={t("common.save")}
            resetButtonLabel={t("common.reset")}
            shouldResetForm={shouldResetForm}
            resetFormCallback={resetFormCallback}
            isLoading={dischargeStatus === "LOADING"}
            admission={currentAdmission}
          />
        </>
      )}
      {currentAdmissionStatus === "SUCCESS_EMPTY" && (
        <div ref={infoBoxRef} className="info-box-container">
          <InfoBox type="info" message={t("admission.patientnotadmitted")} />
        </div>
      )}
      {(dischargeStatus === "FAIL" || currentAdmissionStatus === "FAIL") && (
        <div ref={infoBoxRef} className="info-box-container">
          <InfoBox type="error" message={errorMessage} />
        </div>
      )}

      <CloseEncounterDialog
        isOpen={openCloseEncounterDialog}
        title={t("encounter.closedtitle").toUpperCase()}
        info={t("encounter.closeddate")}
        icon={warningIcon}
        primaryButtonLabel={t("common.yes")}
        secondaryButtonLabel={t("common.no")}
        handlePrimaryButtonClick={(date) => {
          console.log("=== CloseEncounterDialog primaryButton clicked ===");
          console.log("Date from dialog:", date);
          closeEncounter(date);
        }}
        handleSecondaryButtonClick={() => {
          console.log("=== CloseEncounterDialog secondaryButton clicked ===");
          setOpenCloseEncounterDialog(false);
          setActivityTransitionState("TO_RESET");
        }}
        withDateField={true}
      />
    </div>
  );
};

export default PatientDischarge;
