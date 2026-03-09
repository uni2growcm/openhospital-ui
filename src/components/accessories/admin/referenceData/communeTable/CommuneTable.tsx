import { CircularProgress } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import {
  deleteCommune,
  deleteCommuneReset,
  getCommunes,
  updateCommuneReset,
} from "state/commune";

import { CommuneDTO } from "generated";
import { scrollToElement } from "libraries/uiUtils/scrollToElement";

import InfoBox from "components/accessories/infoBox/InfoBox";
import Table from "components/accessories/table/Table";

import classes from "./CommuneTable.module.scss";
import { IProps } from "./types";

export const CommunesTable = ({ headerActions, onEdit }: IProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const infoBoxRef = useRef<HTMLDivElement>(null);

  const { data, status, error } = useAppSelector(
    (state) => state.communes.communeList
  );

  const deleteState = useAppSelector((state) => state.communes.delete);
  const updateState = useAppSelector((state) => state.communes.update);

  useEffect(() => {
    dispatch(getCommunes());

    return () => {
      dispatch(deleteCommuneReset());
      dispatch(updateCommuneReset());
    };
  }, [dispatch]);

  const handleDelete = useCallback(
    (row: CommuneDTO) => {
      if (row?.id) {
        dispatch(deleteCommune(row.id));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (deleteState.hasFailed || updateState.hasFailed) {
      scrollToElement(infoBoxRef.current);
    }

    if (deleteState.hasSucceeded || updateState.hasSucceeded) {
      dispatch(getCommunes());
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
      id: t("commune.id"),
      name: t("commune.name"),
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
          rawData={(rowData ?? []).map((commune) => ({
            ...commune
          }))}
          rowKey="userName"
          headerActions={headerActions}
          onEdit={onEdit}
          onDelete={handleDelete}
          labels={{
            delete: { message: t("commune.confirmDeletion") },
          }}
        />
      </div>
    );
  }

  return null;
};