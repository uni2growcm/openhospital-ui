import { CircularProgress } from "@mui/material";
import InfoBox from "components/accessories/infoBox/InfoBox";
import Table from "components/accessories/table/Table";
import { EthnicDTO } from "generated";
import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import { scrollToElement } from "libraries/uiUtils/scrollToElement";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  deleteEthnic,
  deleteEthnicReset,
  getEthnics,
  updateEthnicReset,
} from "state/ethnic";
import { IProps } from "./types";

export const EthnicsTable: React.FC<IProps> = ({ headerActions, onEdit }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const infoBoxRef = useRef<HTMLDivElement>(null);

  const { data, status, error } = useAppSelector(
    (state) => state.ethnics.ethnicList
  );

  const deleteState = useAppSelector((state) => state.ethnics.delete);
  const updateState = useAppSelector((state) => state.ethnics.update);

  useEffect(() => {
    dispatch(getEthnics());
    return () => {
      dispatch(deleteEthnicReset());
      dispatch(updateEthnicReset());
    };
  }, [dispatch]);

  const handleDelete = useCallback(
    (row: EthnicDTO) => {
      if (row?.id) {
        dispatch(deleteEthnic(row.id));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (deleteState.hasFailed || updateState.hasFailed) {
      scrollToElement(infoBoxRef.current);
    }

    if (deleteState.hasSucceeded || updateState.hasSucceeded) {
      dispatch(getEthnics());
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
      id: t("ethnic.id"),
      name: t("ethnic.name"),
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

  return (
    <div>
      {(() => {
        switch (status) {
          case "LOADING":
            return <CircularProgress style={{ marginLeft: "50%" }} />;

          case "FAIL":
            return <InfoBox type="error" message={error?.message} />;

          case "SUCCESS_EMPTY":
            return <InfoBox type="info" message={t("common.emptydata")} />;

          case "SUCCESS":
            return (
              <div>
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
                  rawData={(rowData ?? []).map((ethnic) => ({
                    ...ethnic,
                  }))}
                  rowKey="userName"
                  headerActions={headerActions}
                  onEdit={onEdit}
                  onDelete={handleDelete}
                  labels={{
                    delete: { message: t("ethnic.confirmDeletion") },
                  }}
                />
              </div>
            );

          default:
            return null;
        }
      })()}
    </div>
  );
};
