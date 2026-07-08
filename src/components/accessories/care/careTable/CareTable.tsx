import { CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import { useUser } from "libraries/hooks/useUser";
import React, { FunctionComponent, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getCareByPatientCode } from "state/care";
import { getEncounterCares } from "state/encounter";
import { CareDTO } from "../../../../generated";
import { renderDateTime } from "../../../../libraries/formatUtils/dataFormatting";
import { usePermission } from "../../../../libraries/permissionUtils/usePermission";
import InfoBox from "../../infoBox/InfoBox";
import Table from "../../table/Table";

interface IOwnProps {
  shouldUpdateTable: boolean;
  handleEdit?: (row: any) => void;
}

const CareTable: FunctionComponent<IOwnProps> = ({
  shouldUpdateTable,
  handleEdit, 
}) => {
  const { t } = useTranslation();
  const canUpdate = usePermission("care.update");

  const header = ["careDate"];
  const dateFields = ["careDate"];

  const { code } = useParams();

  const label = {
    id: t("care.id"),
    careDate: t("care.careDate"),
    observation: t("care.observation"),
    plannedCare: t("care.plannedCare"),
    team: t("care.team"),
    note: t("care.note"),
  };

  const order = ["careDate"];

  const dispatch = useAppDispatch();

  const data = useAppSelector((state) =>
    code
      ? state.encounters.encounterCares.data || []
      : state.care.getCareByPatientCode.data || []
  );

  const { formatValues: formatCare } = useUser();

  const patientCode = useAppSelector(
    (state) => state.patients.selectedPatient.data?.code
  );

  const onEdit = handleEdit
    ? (row: CareDTO) => {
        handleEdit(data.find((item: CareDTO) => item.id === row?.id));
      }
    : undefined;

  useEffect(() => {
    if (shouldUpdateTable || patientCode || code) {
      code
        ? dispatch(getEncounterCares({ code: code as string }))
        : dispatch(getCareByPatientCode(patientCode as number));
    }
  }, [shouldUpdateTable, dispatch, patientCode, code]);

  const formatDataToDisplay = (data: CareDTO[]) => {
    return data.map((item) => {
      return {
        id: item.id ?? "",
        careDate: item.careDate ? renderDateTime(item.careDate) : "",
        observation: item.observation ? t("common.yes") : t("common.no"),
        plannedCare: item.plannedCare ?? "",
        team: formatCare(item.team).join(", "),
        note: item.note ?? "",
      };
    });
  };

  const status = useAppSelector((state) =>
    code
      ? state.encounters.encounterCares.status
      : state.care.getCareByPatientCode.status
  );

  const errorMessage = useAppSelector((state) =>
    code
      ? state.encounters.encounterCares.error?.message
      : state.care.getCareByPatientCode.error?.message ||
        t("common.somethingwrong")
  ) as string;

  const createCareStatus = useAppSelector((state) =>
    code ? state.encounters.encounterCares.status : state.care.newCare.status
  );

  return (
    <div className="careTable">
      <h5>{t("care.previousentries")}</h5>
      {(() => {
        switch (status) {
          case "FAIL":
            return (
              createCareStatus !== "FAIL" && (
                <InfoBox type="error" message={errorMessage} />
              )
            );
          case "LOADING":
            return (
              <CircularProgress
                style={{ marginLeft: "50%", position: "relative" }}
              />
            );
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
                initialOrderBy="careDate"
                showEmptyCell={false}
              />
            );
          case "SUCCESS_EMPTY":
            return <InfoBox type="info" message={t("common.emptydata")} />;
          default:
            return;
        }
      })()}
    </div>
  );
};

export default CareTable;
