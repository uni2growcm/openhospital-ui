import {
  AirlineSeatFlat,
  ArrowForwardIosRounded,
  AssignmentInd,
  BlurCircular,
  GroupWork,
  Healing,
  LocalDrink,
  LocalHospitalSharp,
  LocationCity,
  People,
  SupervisedUserCircle,
  Tune,
} from "@mui/icons-material";
import { PATHS } from "consts";
import React, { ReactNode, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import { useAppSelector } from "../../../../libraries/hooks/redux";
import Button from "../../../accessories/button/Button";
import { MenuItem } from "../../../accessories/menuItem";
import { IAdminSection } from "../types";
import classes from "./SideMenu.module.scss";

const SideMenu = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();

  const hospital = useAppSelector((state) => state.hospital.getHospital);

  const changeAdminSection = useCallback(
    (section: IAdminSection, path?: string) => {
      if (path) {
        navigate(path);
      } else {
        navigate(`${section}`);
      }
    },
    [navigate]
  );

  const menuItems: { key: IAdminSection; icon: ReactNode; path?: string }[] = [
    {
      key: "wards",
      icon: <AirlineSeatFlat fontSize="small" />,
      path: PATHS.admin_wards,
    },
    {
      key: "diseases",
      icon: <BlurCircular fontSize="small" />,
      path: PATHS.admin_diseases,
    },
    {
      key: "exams",
      icon: <AssignmentInd fontSize="small" />,
      path: PATHS.admin_exams,
    },
    {
      key: "operations",
      icon: <Healing fontSize="small" />,
      path: PATHS.admin_operations,
    },
    {
      key: "vaccines",
      icon: <LocalDrink fontSize="small" />,
      path: PATHS.admin_vaccines,
    },
    {
      key: "suppliers",
      icon: <SupervisedUserCircle fontSize="small" />,
      path: PATHS.admin_suppliers,
    },
    {
      key: "referenceData",
      icon: <LocationCity fontSize="small" />,
      path: PATHS.admin_reference_data,
    },
    {
      key: "users",
      icon: <People fontSize="small" />,
      path: PATHS.admin_users,
    },
    {
      key: "settings",
      icon: <Tune fontSize="small" />,
      path: PATHS.admin_settings,
    },
    {
      key: "types",
      icon: <GroupWork fontSize="small" />,
      path: PATHS.admin_types,
    },
  ];

  return (
    <div data-cy="admin-side-menu" className={classes.menu}>
      {menuItems.map((item) => (
        <MenuItem
          key={item.key}
          icon={item.icon}
          label={t(`nav.${item.key}`)}
          selected={
            item.path
              ? location.pathname.startsWith(item.path)
              : location.pathname
                  .slice(location.pathname.lastIndexOf("admin") + 6)
                  .startsWith(item.key)
          }
          onClick={() => {
            changeAdminSection(item.key, item.path);
          }}
          trailingIcon={<ArrowForwardIosRounded fontSize="small" />}
        />
      ))}
      <h6 className={classes.label}>{t("nav.hospital")}</h6>
      <MenuItem
        dataCy="hospital-infos"
        icon={<LocalHospitalSharp fontSize="small" />}
        label={t(`nav.hospitalInfo`)}
        onClick={() => {}}
        expandedContent={
          <div className={classes.hospitalData}>
            {hospital.data &&
              Object.entries(hospital.data)
                .filter((entry) => entry[0] !== "lock")
                .map((entry) => (
                  <div key={entry[0]} className={classes.item}>
                    <span className={classes.labelSmall}>
                      {t(`hospital.${entry[0]}`)}
                    </span>
                    <span className={classes.value}>{entry[1] ?? "---"}</span>
                  </div>
                ))}
            <Button
              type="button"
              variant="text"
              dataCy="edit-hospital"
              className={classes.editButton}
              onClick={() => {
                navigate(PATHS.admin_hospital_edit);
              }}
            >
              {t("hospital.editHospital")}
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default SideMenu;
