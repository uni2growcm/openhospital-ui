import { CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { renderSummary } from "../../../../libraries/reduxUtils/convert";
import { loadSummaryDataGroupedByEncounter } from "../../../../state/summary";
import { IState } from "../../../../types";
import Table from "../../table/Table";
import { ORDER_BY_DATE_PAGE_SIZE } from "../consts";

import { printSubject } from "libraries/printUtilis/printUtils";
import useSummaryMetaData from "../useSummaryMetaData";

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

  return (
    <>
      {!isLoading ? (
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
                <h3>{title}</h3>
                <div className="patientSummary_date">
                  {!isLoading ? (
                    groupData.length > 0 && (
                      <Table
                        rowData={renderSummary(
                          groupData,
                          dateFields,
                          labels,
                          medicals
                        )}
                        dateFields={dateFields}
                        tableHeader={header.date}
                        labelData={labels}
                        columnsOrder={order}
                        rowsPerPage={ORDER_BY_DATE_PAGE_SIZE}
                        isCollapsabile={true}
                        showEmptyCell={false}
                        detailsExcludedFields={["date"]}
                        isExpanded={expanded}
                      />
                    )
                  ) : (
                    <CircularProgress
                      style={{ marginLeft: "50%", position: "relative" }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <CircularProgress style={{ marginLeft: "50%", position: "relative" }} />
      )}
    </>
  );
};

export default PatientSummaryByEncounter;
