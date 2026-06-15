import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import React, { FunctionComponent, useEffect, useState } from "react";
import { printCrossReferenceReport, updateAdmission } from "state/admissions";
import { AdmissionDTO, DiseaseDTO } from "../../../generated";
import { downloadBlob } from "../../../libraries/downloadUtils/downloadUtils";
import { IState } from "../../../types";
import { useFields } from "../admission/useFields";
import { CurrentAdmissionData } from "./currentAdmissionData/CurrentAdmissionData";
import { CurrentAdmissionForm } from "./currentAdmissionForm/CurrentAdmissionForm";
import "./styles.scss";
import { IOwnProps } from "./types";

export const CurrentAdmission: FunctionComponent<IOwnProps> = ({
  onEditChange,
}) => {
  const dispatch = useAppDispatch();
  const [editionMode, setEditionMode] = useState(false);
  const currentAdmission = useAppSelector(
    (state: IState) => state.admissions.currentAdmissionByPatientId.data
  );
  const lastOpd = useAppSelector((state) => state.opds.lastOpd.data);

  const handleEdit = () => {
    setEditionMode(true);
  };

  const handleDiscard = () => {
    setEditionMode(false);
  };

  const onPrint = (admission: AdmissionDTO) => {
    dispatch(
      printCrossReferenceReport({
        patId: admission.patient?.code || 0,
        admId: admission.id || 0,
      })
    )
      .unwrap()
      .then((result) => {
        if (result instanceof Blob)
          downloadBlob(
            result,
            `cross-reference-report-${admission.patient?.code}-${
              admission.id
            }-${new Date().getTime()}.pdf`
          );
      });
  };

  const fields = useFields(currentAdmission, lastOpd?.disease);

  const onSubmit = (adm: AdmissionDTO) => {
    let admissionToSave: AdmissionDTO = {
      ...currentAdmission,
      deleted: "N",
      type: adm.type,
      admitted: adm.admitted,
      fhu: adm.fhu,
      admDate: adm.admDate,
      admType: adm.admType,
      diagnosisIn: adm.diagnosisIn,
      anamnesis: adm.anamnesis,
      ward: adm.ward,
      preTreatment: adm.preTreatment,
      preAssessment: adm.preAssessment,
      entryReason: adm.entryReason,
      alertReceived: adm.alertReceived,
      referenceSheet: adm.referenceSheet,
      qualifiedAgent: adm.qualifiedAgent,
      transportation: adm.transportation,
      referralAlert: adm.referralAlert,
      referralReason: adm.referralReason,
      treatmentReceived: adm.treatmentReceived,
      outcome: adm.outcome,
      improvementFeedback: adm.improvementFeedback,
      physicalExam: adm.physicalExam,
      courseOfAction: adm.courseOfAction,
    };
    dispatch(updateAdmission(admissionToSave));
  };

  useEffect(() => {
    if (onEditChange) {
      onEditChange(editionMode);
    }
  }, [editionMode, onEditChange]);

  return (
    <div className="currentAdmission">
      {currentAdmission && !editionMode && (
        <CurrentAdmissionData
          onEdit={onEditChange ? handleEdit : undefined}
          onPrint={onPrint}
          admission={currentAdmission}
        />
      )}
      {currentAdmission && editionMode && (
        <CurrentAdmissionForm
          fields={fields}
          onSubmit={onSubmit}
          onDiscard={handleDiscard}
          onPrint={onPrint}
        />
      )}
    </div>
  );
};
