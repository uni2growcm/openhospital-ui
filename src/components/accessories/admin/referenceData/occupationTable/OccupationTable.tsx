import { CircularProgress } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import {
  deleteOccupation,
  deleteOccupationReset,
  getOccupations,
  updateOccupationReset,
} from "state/occupation";

import { OccupationDTO } from "generated";
import { scrollToElement } from "libraries/uiUtils/scrollToElement";

import InfoBox from "components/accessories/infoBox/InfoBox";
import Table from "components/accessories/table/Table";

import classes from "./OccupationTable.module.scss";
import { IProps } from "./types";

export const OccupationsTable = ({ headerActions, onEdit }: IProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const infoBoxRef = useRef<HTMLDivElement>(null);

  const { data, status, error } = useAppSelector(
    (state) => state.occupations.occupationList
  );

  const deleteState = useAppSelector((state) => state.occupations.delete);
  const updateState = useAppSelector((state) => state.occupations.update);

  useEffect(() => {
    dispatch(getOccupations());

    return () => {
      dispatch(deleteOccupationReset());
      dispatch(updateOccupationReset());
    };
  }, [dispatch]);

  const handleDelete = useCallback(
    (row: OccupationDTO) => {
      if (row?.id) {
        dispatch(deleteOccupation(row.id));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (deleteState.hasFailed || updateState.hasFailed) {
      scrollToElement(infoBoxRef.current);
    }

    if (deleteState.hasSucceeded || updateState.hasSucceeded) {
      dispatch(getOccupations());
    }
  }, [
    deleteState.hasFailed,
    deleteState.hasSucceeded,
    updateState.hasFailed,
    updateState.hasSucceeded,
    dispatch,
  ]);

  const header = useMemo(() => ["id", "name"], []);

  const label = useMemo(
    () => ({
      id: t("occupation.id"),
      name: t("occupation.name"),
    }),
    [t]
  );

  const order = useMemo(() => ["id", "name"], []);

  const rowData = useMemo(
    () =>
      (data ?? []).map((item) => ({
        id: item.id,
        name: item.name,
      })),
    [data]
  );

  const actionErrorMessage = deleteState.hasFailed
    ? deleteState.error?.message
    : updateState.error?.message;

  if (status === "LOADING") {
    return (
      <div className={classes.table}>
        <CircularProgress style={{ marginLeft: "50%" }} />
      </div>
    );
  }

  if (status === "FAIL") {
    return (
      <div className={classes.table}>
        <InfoBox type="error" message={error?.message} />
      </div>
    );
  }

  if (status === "SUCCESS_EMPTY") {
    return (
      <div className={classes.table}>
        <InfoBox type="info" message={t("common.emptydata")} />
      </div>
    );
  }

  if (status === "SUCCESS") {
    return (
      <div className={classes.table}>
        {(deleteState.hasFailed || updateState.hasFailed) && (
          <div ref={infoBoxRef} className="info-box-container">
            <InfoBox type="error" message={t(actionErrorMessage)} />
          </div>
        )}

         <Table
          rowData={rowData}
          tableHeader={header}
          labelData={label}
          columnsOrder={order}
          rowsPerPage={15}
          manualFilter={false}
          isCollapsabile={false}
          rawData={(rowData ?? []).map((occupation) => ({
            ...occupation
          }))}
          rowKey="userName"
          headerActions={headerActions}
          onEdit={onEdit}
          onDelete={handleDelete}
          labels={{
            delete: { message: t("occupation.confirmDeletion") },
          }}
        />
      </div>
    );
  }

  return null;
};