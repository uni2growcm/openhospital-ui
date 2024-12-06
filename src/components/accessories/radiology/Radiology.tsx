import { parseNumericDate } from "libraries/formatUtils/parseNumericDate";
import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import { useTimeAgo } from "libraries/hooks/useTimeAgo";
import moment from "moment";
import "moment/min/locales";
import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";
import { getPatientStudies, getPatientStudiesReset } from "state/radiology";

export const Radiology = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const { timeAgo } = useTimeAgo();

  const patient = useAppSelector(
    (state) => state.patients.selectedPatient.data
  );

  const studiesState = useAppSelector((state) => state.radiology.studies);

  useEffect(() => {
    if (patient?.code) {
      dispatch(getPatientStudies(patient.code.toString()));
    }
  }, [dispatch, patient]);

  useEffect(() => {
    return () => {
      dispatch(getPatientStudiesReset());
    };
  }, [dispatch]);

  const lastStudyDate = useMemo(() => {
    const lastStudy = studiesState.data?.length
      ? studiesState.data?.reduce((acc, value) =>
          parseInt(acc.study?.date ?? "0") > parseInt(value.study?.date ?? "0")
            ? acc
            : value
        )
      : null;
    return parseNumericDate(lastStudy?.study?.date ?? "");
  }, [studiesState]);

  return (
    <div className="radiology">
      {studiesState.hasSucceeded && (
        <>
          <p>
            {t("radiology.studiesSummary", {
              count: studiesState.data?.length ?? 0,
            })}
          </p>
          {lastStudyDate && (
            <p>
              {t("radiology.lastStudy", {
                value: `${timeAgo.format(lastStudyDate)} | ${moment(
                  lastStudyDate
                )
                  .locale(i18n.language)
                  .format("LL")}`,
              })}
            </p>
          )}
        </>
      )}
      <Outlet />
    </div>
  );
};
