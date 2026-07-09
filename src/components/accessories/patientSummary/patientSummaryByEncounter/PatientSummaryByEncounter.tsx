import { CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { renderSummary } from "../../../../libraries/reduxUtils/convert";
import { loadSummaryDataGroupedByEncounter } from "../../../../state/summary";
import { IState } from "../../../../types";
import Table from "../../table/Table";
import { ORDER_BY_TYPE_PAGE_SIZE } from "../consts";

import { printSubject } from "libraries/printUtilis/printUtils";
import useSummaryMetaData from "../useSummaryMetaData";
import { SummaryType } from "../types";
import InfoBox from "components/accessories/infoBox/InfoBox";

const PatientSummaryByEncounter = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { labels, dateFields, header, order } = useSummaryMetaData();
  const [expanded, setExpanded] = useState(false);
  const patientCode = useAppSelector(
    (state: IState) => state.patients.selectedPatient.data?.code
  );

  const { isLoading, summaryData } = useAppSelector((state) => ({
    isLoading: state.summaryByEncounter.summaryApisCall.status === "LOADING",
    hasSucceeded: state.summaryByEncounter.summaryApisCall.status === "SUCCESS",
    hasFailed: state.summaryByEncounter.summaryApisCall.status === "FAIL",
    summaryData: state.summaryByEncounter.summaryApisCall.data ?? [],
  }));

  useEffect(() => {
    if (patientCode) dispatch(loadSummaryDataGroupedByEncounter(patientCode));
  }, [patientCode, dispatch]);
  
  const medicals = useAppSelector((state) =>
    state.medicals.medicalsOrderByName.data
      ? state.medicals.medicalsOrderByName.data
      : []
  );

  useEffect(() => {
    const subscription = printSubject.subscribe(() => {
      setExpanded(true);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const summaryGroups = Array.isArray(summaryData) ? summaryData : [];
  const filterByType = (data: any[], type: string) => {
    return data.filter((item) => item.type === type);
  };

  return (
    <>
      {!isLoading ? (
        summaryGroups.length === 0 ? (
          <InfoBox type="info" message={t("summary.noData")} />
        ) : (
        <div className="patientSummary_type">
          {summaryGroups.map((group: any, index: number) => {
            const encounter = group.encounter || {};
            const groupData = Array.isArray(group.summaryData)
              ? group.summaryData
              : [];
            const title =
              t("summary.encounter") +
              " " +
              (encounter.code ?? index) +
              ": " +
              (encounter.createdAt ?? "");

            return (
              <div
                key={encounter.code ?? index}
                className="patientSummary_encounter_group"
              >
                <h3 className="patientSummary_encounter_title">{title}</h3>
                {filterByType(groupData, SummaryType.OPD).length > 0 && (
                  <div className="patientSummary_type_row">
                    <h4>
                      {t("summary.opd")}({filterByType(groupData, SummaryType.OPD).length})
                    </h4>
                    <Table
                      rowData={renderSummary(
                        filterByType(groupData, SummaryType.OPD),
                        dateFields,
                        labels
                      )}
                      dateFields={dateFields}
                      tableHeader={header.type.opd}
                      labelData={labels}
                      columnsOrder={order}
                      rowsPerPage={ORDER_BY_TYPE_PAGE_SIZE}
                      isCollapsabile={true}
                      showEmptyCell={false}
                      detailsExcludedFields={["date"]}
                      isExpanded={expanded}
                    />
                  </div>
                )}
                {filterByType(groupData, SummaryType.ADMISSION).length > 0 && (
                  <div className="patientSummary_type_row">
                    <h4>
                      {t("summary.admission")}({filterByType(groupData, SummaryType.ADMISSION).length})
                    </h4>
                    <Table
                      rowData={renderSummary(
                        filterByType(groupData, SummaryType.ADMISSION),
                        dateFields,
                        labels,
                        medicals
                      )}
                      dateFields={dateFields}
                      tableHeader={header.type.admission}
                      labelData={labels}
                      columnsOrder={order}
                      rowsPerPage={ORDER_BY_TYPE_PAGE_SIZE}
                      isCollapsabile={true}
                      showEmptyCell={false}
                      detailsExcludedFields={["date"]}
                      isExpanded={expanded}
                    />
                  </div>
                )}
                {filterByType(groupData, SummaryType.VISIT).length > 0 && (
                  <div className="patientSummary_type_row">
                    <h4>
                      {t("summary.visits")}({filterByType(groupData, SummaryType.VISIT).length})
                    </h4>
                    <Table
                      rowData={renderSummary(
                        filterByType(groupData, SummaryType.VISIT),
                        dateFields,
                        labels,
                        medicals
                      )}
                      dateFields={dateFields}
                      tableHeader={header.type.visit}
                      labelData={labels}
                      columnsOrder={order}
                      rowsPerPage={ORDER_BY_TYPE_PAGE_SIZE}
                      isCollapsabile={true}
                      showEmptyCell={false}
                      detailsExcludedFields={["date"]}
                      isExpanded={expanded}
                    />
                  </div>
                )}
                {filterByType(groupData, SummaryType.OPERATION).length > 0 && (
                  <div className="patientSummary_type_row">
                    <h4>
                      {t("summary.operation")}({filterByType(groupData, SummaryType.OPERATION).length})
                    </h4>
                    <Table
                      rowData={renderSummary(
                        filterByType(groupData, SummaryType.OPERATION),
                        dateFields,
                        labels,
                        medicals
                      )}
                      dateFields={dateFields}
                      tableHeader={header.type.operation}
                      labelData={labels}
                      columnsOrder={order}
                      rowsPerPage={ORDER_BY_TYPE_PAGE_SIZE}
                      isCollapsabile={true}
                      showEmptyCell={false}
                      detailsExcludedFields={["date"]}
                      isExpanded={expanded}
                    />
                  </div>
                )}
                {filterByType(groupData, SummaryType.TRIAGE).length > 0 && (
                  <div className="patientSummary_type_row">
                    <h4>
                      {t("summary.triage")}({filterByType(groupData, SummaryType.TRIAGE).length})
                    </h4>
                    <Table
                      rowData={renderSummary(
                        filterByType(groupData, SummaryType.TRIAGE),
                        dateFields,
                        labels
                      )}
                      dateFields={dateFields}
                      tableHeader={header.type.triage}
                      labelData={labels}
                      columnsOrder={order}
                      rowsPerPage={ORDER_BY_TYPE_PAGE_SIZE}
                      isCollapsabile={true}
                      showEmptyCell={false}
                      detailsExcludedFields={["date"]}
                      isExpanded={expanded}
                    />
                  </div>
                )}
                {filterByType(groupData, SummaryType.EXAMS).length > 0 && (
                  <div className="patientSummary_type_row">
                    <h4>
                      {t("summary.exams")}({filterByType(groupData, SummaryType.EXAMS).length})
                    </h4>
                    <Table
                      rowData={renderSummary(
                        filterByType(groupData, SummaryType.EXAMS),
                        dateFields,
                        labels
                      )}
                      dateFields={dateFields}
                      tableHeader={header.type.exam}
                      labelData={labels}
                      columnsOrder={order}
                      rowsPerPage={ORDER_BY_TYPE_PAGE_SIZE}
                      isCollapsabile={true}
                      showEmptyCell={false}
                      detailsExcludedFields={["date"]}
                      isExpanded={expanded}
                    />
                  </div>
                )}
                {filterByType(groupData, SummaryType.THERAPY).length > 0 && (
                  <div className="patientSummary_type_row">
                    <h4>
                      {t("summary.therapy")}({filterByType(groupData, SummaryType.THERAPY).length})
                    </h4>
                    <Table
                      rowData={renderSummary(
                        filterByType(groupData, SummaryType.THERAPY),
                        dateFields,
                        labels
                      )}
                      dateFields={dateFields}
                      tableHeader={header.type.therapy}
                      labelData={labels}
                      columnsOrder={order}
                      rowsPerPage={ORDER_BY_TYPE_PAGE_SIZE}
                      isCollapsabile={true}
                      showEmptyCell={false}
                      detailsExcludedFields={["date"]}
                      isExpanded={expanded}
                    />
                  </div>
                )}
                {filterByType(groupData, SummaryType.CONDITIONING).length > 0 && (
                  <div className="patientSummary_type_row">
                    <h4>
                      {t("summary.conditioning")}({filterByType(groupData, SummaryType.CONDITIONING).length})
                    </h4>
                    <Table
                      rowData={renderSummary(
                        filterByType(groupData, SummaryType.CONDITIONING),
                        dateFields,
                        labels
                      )}
                      dateFields={dateFields}
                      tableHeader={header.type.conditioning}
                      labelData={labels}
                      columnsOrder={order}
                      rowsPerPage={ORDER_BY_TYPE_PAGE_SIZE}
                      isCollapsabile={true}
                      showEmptyCell={false}
                      detailsExcludedFields={["date"]}
                      isExpanded={expanded}
                    />
                  </div>
                )}
                {filterByType(groupData, SummaryType.CARE).length > 0 && (
                  <div className="patientSummary_type_row">
                    <h4>
                      {t("summary.care")}({filterByType(groupData, SummaryType.CARE).length})
                    </h4>
                    <Table
                      rowData={renderSummary(
                        filterByType(groupData, SummaryType.CARE),
                        dateFields,
                        labels,
                        medicals
                      )}
                      dateFields={dateFields}
                      tableHeader={header.type.care}
                      labelData={labels}
                      columnsOrder={order}
                      rowsPerPage={ORDER_BY_TYPE_PAGE_SIZE}
                      isCollapsabile={true}
                      showEmptyCell={false}
                      detailsExcludedFields={["date"]}
                      isExpanded={expanded}
                    />
                  </div>
                )}
                {filterByType(groupData, SummaryType.MEDICALHISTORY).length > 0 && (
                  <div className="patientSummary_type_row">
                    <h4>
                      {t("summary.medicalHistory")}({filterByType(groupData, SummaryType.MEDICALHISTORY).length})
                    </h4>
                    <Table
                      rowData={renderSummary(
                        filterByType(groupData, SummaryType.MEDICALHISTORY),
                        dateFields,
                        labels,
                        medicals
                      )}
                      dateFields={dateFields}
                      tableHeader={header.type.medicalHistory}
                      labelData={labels}
                      columnsOrder={order}
                      rowsPerPage={ORDER_BY_TYPE_PAGE_SIZE}
                      isCollapsabile={true}
                      showEmptyCell={false}
                      detailsExcludedFields={["date"]}
                      isExpanded={expanded}
                    />
                  </div>
                )}
                {groupData.length === 0 && <InfoBox type="info" message={t("summary.noDataForEncounter")} />}
              </div>
            );
          })}
        </div>
      )) : (
        <CircularProgress style={{ marginLeft: "50%", position: "relative" }} />
      )}
    </>
  );
};

export default PatientSummaryByEncounter;
