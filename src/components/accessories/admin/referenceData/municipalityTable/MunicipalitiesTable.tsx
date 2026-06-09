import { CircularProgress } from "@mui/material";
import InfoBox from "components/accessories/infoBox/InfoBox";
import Table from "components/accessories/table/Table";
import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import { scrollToElement } from "libraries/uiUtils/scrollToElement";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  deleteMunicipality,
  deleteMunicipalityReset,
  getMunicipalities,
  updateMunicipalityReset,
} from "state/municipality";
import { IProps } from "./types";
import { MunicipalityDTO } from "generated";

export const MunicipalitiesTable: React.FC<IProps> = ({
  headerActions,
  onEdit,
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const infoBoxRef = useRef<HTMLDivElement>(null);

  const { data, status, error } = useAppSelector(
    (state) => state.communes.getMunicipalities
  );

  const deleteState = useAppSelector((state) => state.communes.deleteMunicipality);
  const updateState = useAppSelector((state) => state.communes.updateMunicipality);

  useEffect(() => {
    dispatch(getMunicipalities());

    return () => {
      dispatch(deleteMunicipalityReset());
      dispatch(updateMunicipalityReset());
    };
  }, [dispatch]);

  const handleDelete = useCallback(
    (row: MunicipalityDTO) => {
      if (row?.id) {
        dispatch(deleteMunicipality(row.id));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (deleteState.hasFailed || updateState.hasFailed) {
      scrollToElement(infoBoxRef.current);
    }

    if (deleteState.hasSucceeded || updateState.hasSucceeded) {
      dispatch(getMunicipalities());
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
                  rawData={(rowData ?? []).map((municipality) => ({
                    ...municipality,
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

          default:
            return;
        }
      })()}
    </div>
  );
};
