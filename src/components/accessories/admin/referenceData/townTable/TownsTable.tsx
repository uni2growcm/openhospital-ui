import { CircularProgress } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import {
  deleteTown,
  deleteTownReset,
  getTowns,
  updateTownReset,
} from "state/town";

import { TownDTO } from "generated";
import { scrollToElement } from "libraries/uiUtils/scrollToElement";

import InfoBox from "components/accessories/infoBox/InfoBox";
import Table from "components/accessories/table/Table";

import classes from "./TownsTable.module.scss";
import { IProps } from "./types";

export const TownsTable = ({ headerActions, onEdit }: IProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const infoBoxRef = useRef<HTMLDivElement>(null);

  const { data, status, error } = useAppSelector((state) => state.towns.townList);
  const deleteState = useAppSelector((state) => state.towns.delete);
  const updateState = useAppSelector((state) => state.towns.update);

  useEffect(() => {
    dispatch(getTowns());

    return () => {
      dispatch(deleteTownReset());
      dispatch(updateTownReset());
    };
  }, [dispatch]);

  const handleDelete = useCallback(
    (row: TownDTO) => {
      if (row?.id) {
        dispatch(deleteTown(row.id));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (updateState.hasFailed || deleteState.hasFailed) {
      scrollToElement(infoBoxRef.current);
    }

    if (updateState.hasSucceeded || deleteState.hasSucceeded) {
      dispatch(getTowns());
    }
  }, [
    updateState.hasFailed,
    updateState.hasSucceeded,
    deleteState.hasFailed,
    deleteState.hasSucceeded,
    dispatch,
  ]);

  const header = useMemo(() => ["id", "name"], []);

  const label = useMemo(
    () => ({
      id: t("town.id"),
      name: t("town.name"),
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
          rawData={data}
          tableHeader={header}
          columnsOrder={order}
          labelData={label}
          rowsPerPage={15}
          manualFilter={false}
          isCollapsabile={false}
          onEdit={onEdit}
          onDelete={handleDelete}
          rowKey="id"
          headerActions={headerActions}
          labels={{
            delete: { message: t("town.confirmDeletion") },
          }}
        />
      </div>
    );
  }

  return null;
};