import { Tab, Tabs } from "@mui/material";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import { useAppDispatch } from "libraries/hooks/redux";
import Button from "../../button/Button";
import { PATHS } from "consts";
import { CommunesTable } from "./communeTable";
import { EthnicsTable } from "./ethnicTable";
import { OccupationsTable } from "./occupationTable";
import { TownsTable } from "./townTable";

export enum TabOptions {
  commune = "commune",
  ethnic = "ethnic",
  town = "town",
  occupation = "occupation",
}

export const ReferenceData = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { state }: { state: { tab?: TabOptions } } = useLocation();
  const activeTab = state?.tab ?? TabOptions.commune;

  const setTab = (tab: TabOptions) =>
    navigate(PATHS.admin_reference_data, { state: { tab } });

  const handleEdit = useCallback(
    (path: string) => (row: any) => {
      navigate(path.replace(":id", row.id!), { state: row });
    },
    [navigate]
  );

  const tabsConfig = {
    [TabOptions.commune]: {
      label: t("common.communes"),
      table: CommunesTable,
      addPath: PATHS.admin_communes_new,
      editPath: PATHS.admin_communes_edit,
      addLabel: t("common.addCommune"),
    },

    [TabOptions.ethnic]: {
      label: t("common.ethnics"),
      table: EthnicsTable,
      addPath: PATHS.admin_ethnics_new,
      editPath: PATHS.admin_ethnics_edit,
      addLabel: t("common.addEthnic"),
    },

    [TabOptions.town]: {
      label: t("common.towns"),
      table: TownsTable,
      addPath: PATHS.admin_towns_new,
      editPath: PATHS.admin_towns_edit,
      addLabel: t("common.addTown"),
    },

    [TabOptions.occupation]: {
      label: t("common.occupations"),
      table: OccupationsTable,
      addPath: PATHS.admin_occupations_new,
      editPath: PATHS.admin_occupations_edit,
      addLabel: t("common.addOccupation"),
    },
  };

  const config = tabsConfig[activeTab];
  const TableComponent = config.table;

  return (
    <>
      <Tabs
        value={activeTab}
        onChange={(_, value) => setTab(value)}
        aria-label="reference data tabs"
      >
        {Object.entries(tabsConfig).map(([key, value]) => (
          <Tab key={key} value={key} label={value.label} />
        ))}
      </Tabs>

      <TableComponent
        headerActions={
          <Button
            onClick={() => navigate(config.addPath)}
            type="button"
            variant="contained"
            color="primary"
          >
            {config.addLabel}
          </Button>
        }
        onEdit={handleEdit(config.editPath)}
      />
    </>
  );
};