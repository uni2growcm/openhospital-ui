import {
  AcUnit,
  ArtTrack,
  Colorize,
  Healing,
  HistoryEdu,
  LocalHospital,
  LocalHotel,
  Pageview,
} from "@mui/icons-material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useEncountersEnabled } from "libraries/hooks";
import { usePermission } from "libraries/permissionUtils/usePermission";
import React, { FunctionComponent, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import Arrow from "../../../assets/arrow-w.svg";
import "./styles.scss";
import { TUserSection } from "./types";
import { Permission } from "libraries/permissionUtils/Permission";

interface IOwnProps {
  userSection: TUserSection;
}

const OutPatientDashboardMenu: FunctionComponent<IOwnProps> = ({
  userSection,
}) => {
  const { t } = useTranslation();

  const encountersEnabled = useEncountersEnabled();

  const isActive = useCallback(
    (value: string) => (value === userSection ? "active" : "default"),
    [userSection]
  );

  const canReadRadiology = usePermission("radiology.access");

  const navigate = useNavigate();

  const changeUserSection = useCallback(
    (section: TUserSection) => {
      navigate(`${section}`, { replace: true });
    },
    [navigate]
  );

  return (
    <div
      data-cy="patient-details-main-menu"
      className="patientDetails__main_menu"
    >
      <h6>{t("patient.usersections")}</h6>

      {encountersEnabled && (
        <Permission require="encounters.access">
        <div
          className={
            "patientDetails__main_menu__item " + isActive("encounters")
          }
          onClick={() => {
            changeUserSection("encounters");
          }}
        >
          <AcUnit
            fontSize="small"
            style={{
              color: "white",
            }}
          />
          <span>{t("nav.encounters")}:</span>
          <img src={Arrow} className="icon_toggle" alt="Accordion toogle" />
        </div>
        </Permission>
      )}

      {encountersEnabled && (
        <Permission require="conditioning.access">
        <div
          className={
            "patientDetails__main_menu__item " + isActive("conditioning")
          }
          onClick={() => changeUserSection("conditioning")}
        >
          <FormatListBulletedIcon fontSize="small" style={{ color: "white" }} />
          <span>{t("nav.conditioning")}:</span>
          <img src={Arrow} className="icon_toggle" alt="Accordion toggle" />
        </div>
        </Permission>
      )}

      {encountersEnabled && (
        <Permission require="medicalhistories.access">
        <div
          className={
            "align__element patientDetails__main_menu__item " +
            isActive("medical-history")
          }
          onClick={() => {
            changeUserSection("medical-history");
          }}
        >
          <HistoryEdu fontSize="small" style={{ color: "white" }} />
          <span>{t("nav.medicalHistory")}:</span>
          <img src={Arrow} className="icon_toggle" alt="Accordion toggle" />
        </div>
        </Permission>
      )}

      <Permission require="admissions.access">
      <div
        className={"patientDetails__main_menu__item " + isActive("admissions")}
        onClick={() => {
          changeUserSection("admissions");
        }}
      >
        <LocalHotel
          fontSize="small"
          style={{
            color: "white",
          }}
        />
        <span>{t("nav.admissions")}:</span>
        <img src={Arrow} className="icon_toggle" alt="Accordion toogle" />
      </div>
      </Permission>

      {!encountersEnabled && (
        <Permission require="visits.access">
        <div
          className={
            "align__element patientDetails__main_menu__item " +
            isActive("visits")
          }
          onClick={() => {
            changeUserSection("visits");
          }}
        >
          <Pageview fontSize="small" style={{ color: "white" }} />
          <span>{t("nav.visits")}:</span>
          <img src={Arrow} className="icon_toggle" alt="Accordion toogle" />
        </div>
        </Permission>
      )}

      <Permission require="triage.access">
      <div
        className={
          "align__element patientDetails__main_menu__item " + isActive("triage")
        }
        onClick={() => {
          changeUserSection("triage");
        }}
      >
        <ArtTrack fontSize="small" style={{ color: "white" }} />
        <span>{t("nav.triage")}:</span>
        <img src={Arrow} className="icon_toggle" alt="Accordion toogle" />
      </div>
      </Permission>

      <Permission require="laboratories.access">
      <div
        className={
          "align__element patientDetails__main_menu__item " +
          isActive("laboratory")
        }
        onClick={() => {
          changeUserSection("laboratory");
        }}
      >
        <Colorize fontSize="small" style={{ color: "white" }} />
        <span>{t("nav.laboratory")}:</span>
        <img src={Arrow} className="icon_toggle" alt="Accordion toogle" />
      </div>
      </Permission>

      <Permission require="therapies.access">
      {false && (
        <div
          className={
            "align__element patientDetails__main_menu__item " +
            isActive("therapy")
          }
          onClick={() => {
            changeUserSection("therapy");
          }}
        >
          <Healing fontSize="small" style={{ color: "white" }} />
          <span>{t("nav.therapy")}:</span>
          <img src={Arrow} className="icon_toggle" alt="Accordion toogle" />
        </div>
      )}
      </Permission>
      <Permission require="clinic.access">
      <div
        className={
          "align__element patientDetails__main_menu__item " + isActive("clinic")
        }
        onClick={() => {
          changeUserSection("clinic");
        }}
      >
        <LocalHospital fontSize="small" style={{ color: "white" }} />
        <span>{t("nav.userclinic")}</span>
        <img src={Arrow} className="icon_toggle" alt="Accordion toogle" />
      </div>
      </Permission>
      {canReadRadiology && (
        <div
          className={
            "align__element patientDetails__main_menu__item " +
            isActive("radiology")
          }
          onClick={() => {
            changeUserSection("radiology");
          }}
        >
          <Healing fontSize="small" style={{ color: "white" }} />
          <span>{t("nav.radiology")}</span>
          <img src={Arrow} className="icon_toggle" alt="Accordion toogle" />
        </div>
      )}
    </div>
  );
};

export default OutPatientDashboardMenu;
