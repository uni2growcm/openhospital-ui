import { CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import React, { FunctionComponent, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {
  getHospitalizationConsultationsByEncounter
} from "state/hospitalisationconsultation";
import { HospitalizationConsultationDTO } from "../../../../generated";
import { renderDateTime } from "../../../../libraries/formatUtils/dataFormatting";
import { usePermission } from "../../../../libraries/permissionUtils/usePermission";
import InfoBox from "../../infoBox/InfoBox";
import Table from "../../table/Table";

interface IOwnProps {
  shouldUpdateTable: boolean;
  handleEdit?: (row: HospitalizationConsultationDTO) => void;
}

const HospitalisationconsultationTable: FunctionComponent<IOwnProps> = ({
                                                                          shouldUpdateTable,
                                                                          handleEdit,
                                                                        }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const canUpdate = usePermission("hospitalisationconsultation.update");

  const { id, code } = useParams<{ id: string; code?: string }>();

  const patientCodeFromStore = useAppSelector(
    (state) => state.patients.selectedPatient.data?.code
  );

  const effectivePatientCode = patientCodeFromStore?.toString() || id;

  const createConsultationStatus = useAppSelector((state) =>
    state.hospitalisationconsultations.newHospitalizationConsultation.status
  );

  useEffect(() => {
    if (code) {
      dispatch(getHospitalizationConsultationsByEncounter(code));
    }
  }, [dispatch, code, effectivePatientCode, id, shouldUpdateTable]);

  const data = useAppSelector((state) => state.hospitalisationconsultations.getHospitalizationConsultationsByEncounter.data || []
  );

  const status = useAppSelector((state) => state.hospitalisationconsultations.getHospitalizationConsultationsByEncounter.status
  );

  const errorMessage = useAppSelector((state) => {
    const errorState = state.hospitalisationconsultations.getHospitalizationConsultationsByEncounter
    return errorState.error?.message || t("common.somethingwrong");
  });

  const header = ["consultationDate", "teams", "diagnosis"];
  const dateFields = ["consultationDate"];
  const order = ["consultationDate", "teams", "diagnosis"];

  const label = {
    id: t("hospitalisationconsultation.id"),
    consultationDate: t("hospitalisationconsultation.consultationDate"),
    teams: t("hospitalisationconsultation.teams"),
    parentComplaints: t("hospitalisationconsultation.parentComplaints"),
    physicalExamination: t("hospitalisationconsultation.physicalExamination"),
    diagnosis: t("hospitalisationconsultation.diagnosis"),
    instructions: t("hospitalisationconsultation.instructions"),
  };

  const onEdit = (row: any) => {
    if (handleEdit) {
      const fullRow = data.find((item) => item.id === row.id);
      if (fullRow) handleEdit(fullRow);
    }
  };

  const formatDataToDisplay = (rawData: HospitalizationConsultationDTO[]) => {
    return rawData.map((item) => ({
      id: item.id ?? "",
      consultationDate: item.consultationDate ? renderDateTime(item.consultationDate) : "",
      teams: item.teams ?? "",
      parentComplaints: item.parentComplaints ?? "",
      physicalExamination: item.physicalExamination ?? "",
      diagnosis: item.diagnosis ?? "",
      instructions: item.instructions ?? "",
    }));
  };

  return (
    <div className="hospitalisationconsultationTable">
      <h5>{t("hospitalisationconsultation.previousentries")}</h5>
      {(() => {
        switch (status) {
          case "LOADING":
            return <CircularProgress style={{ display: "block", margin: "20px auto" }} />;
          case "FAIL":
            return createConsultationStatus !== "FAIL" && <InfoBox type="error" message={errorMessage} />;
          case "SUCCESS":
            return (
              <Table
                rowData={formatDataToDisplay(data)}
                dateFields={dateFields}
                tableHeader={header}
                labelData={label}
                columnsOrder={order}
                rowsPerPage={5}
                isCollapsabile={true}
                onEdit={canUpdate ? onEdit : undefined}
                initialOrderBy="consultationDate"
                showEmptyCell={false}
              />
            );
          case "SUCCESS_EMPTY":
            return <InfoBox type="info" message={t("common.emptydata")} />;
          default:
            return null;
        }
      })()}
    </div>
  );
};

export default HospitalisationconsultationTable;