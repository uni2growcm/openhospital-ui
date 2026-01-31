import { Edit, KeyboardArrowRight, Menu } from "@mui/icons-material";
import Button from "components/accessories/button/Button";
import { PATHS } from "consts";
import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { getMedical } from "state/pharmacy";
import { getWards } from "state/ward";
import MedicalItemCard from "../medicalItemCard/MedicalItemCard";
import { getPharmacyData } from "./consts";
import "./styles.scss";

const MedicalDetailsActivity = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const { breadcrumbMap, setBreadcrumbMap } = useOutletContext<{
    breadcrumbMap: Record<string, string>;
    setBreadcrumbMap: (map: Record<string, string | undefined>) => void;
  }>();

  const handleEdit = useCallback(() => {
    if (id) {
      navigate(`${PATHS.pharmacy_pharmaceutical}/${id}/update`);
    }
  }, [navigate, id]);

  const dispatch = useAppDispatch();
  const medical = useAppSelector((state) => state.pharmacy.getMedical.data);

  const addBreadcrumb = useCallback(() => {
    setBreadcrumbMap({
      [t("nav.pharmacy")]: PATHS.pharmacy,
      [t("pharmacy.labels.pharmaceutical-title")]:
        PATHS.pharmacy_pharmaceutical,
      [t("pharmacy.labels.details-pharmaceutical-title")]:
        PATHS.pharmacy_pharmaceutical_detail.replace(":id", id ?? ""),
    });
  }, [id, t, setBreadcrumbMap]);

  const removeBreadcrumb = useCallback(() => {
    setBreadcrumbMap({
      [t("nav.pharmacy")]: PATHS.pharmacy,
      [t("pharmacy.labels.pharmaceutical-title")]:
        PATHS.pharmacy_pharmaceutical,
    });
  }, [t, setBreadcrumbMap]);

  useEffect(() => {
    addBreadcrumb();
    return removeBreadcrumb;
  }, [addBreadcrumb, removeBreadcrumb]);

  useEffect(() => {
    dispatch(getMedical({ code: parseInt(id || "0") }));
    dispatch(getWards());
  }, [dispatch, id]);

  const wards = useAppSelector((state) => state.wards.allWards.data || []);

  if (!medical) return;
  const pharmacyData = getPharmacyData(medical);

  return (
    <div data-cy="medical-details" className="medicalDetails">
      <div className="medicalDetails__container">
        <div className="medicalDetails__sidebar">
          <div className="medicalDetails__sidebar__header">
            <div className="medicalDetails__sidebar__type">
              {medical.type?.description || "MEDICAL"}
            </div>
            <div className="medicalDetails__sidebar__name">
              {medical.prodCode && medical.description
                ? `${medical.description} ${medical.prodCode}`
                : medical.description || "Medical"}
            </div>
          </div>

          <div
            data-cy="medical-edit-button"
            className="medicalDetails__sidebar__button"
          >
            <Button variant="contained" color="primary" onClick={handleEdit}>
              <Edit fontSize="small" />
              <span>{t("pharmacy.medicalDetails.edit")}</span>
            </Button>
          </div>

          <div className="medicalDetails__sidebar__info">
            <div className="medicalDetails__sidebar__item">
              <div className="medicalDetails_status_wrapper medicalDetails_status_in">
                <h6
                  data-cy="medical-status"
                  className="medicalDetails__sidebar__item__label"
                >
                  {t("pharmacy.medicalDetails.status")}:{" "}
                  <span className="medicalDetails__sidebar__item__value">
                    {t("pharmacy.medicalDetails.available")}
                  </span>
                </h6>
              </div>
            </div>

            <div className="medicalDetails__sidebar__item">
              <span
                data-cy="medical-pcsperpck"
                className="medicalDetails__sidebar__item__label"
              >
                {t("pharmacy.medicalDetails.piecesPerPack")}
              </span>
              <span className="medicalDetails__sidebar__item__value">
                {medical.pcsperpck || 0}
              </span>
            </div>

            <div className="medicalDetails__sidebar__item">
              <span
                data-cy="medical-minqty"
                className="medicalDetails__sidebar__item__label"
              >
                {t("pharmacy.medicalDetails.criticalLevel")}
              </span>
              <span className="medicalDetails__sidebar__item__value">
                {medical.minqty || 0}
              </span>
            </div>

            <div className="medicalDetails__sidebar__item">
              <span
                data-cy="medical-code"
                className="medicalDetails__sidebar__item__label"
              >
                {t("pharmacy.medicalDetails.code")}
              </span>
              <span className="medicalDetails__sidebar__item__value">
                {medical.prodCode || "-"}
              </span>
            </div>
          </div>

          <div className="medicalDetails__sidebar__menu">
            <div className="medicalDetails__sidebar__menu__item">
              <span className="flex gap-1">
                <Menu /> {t("pharmacy.medicalDetails.overview")}
              </span>
              <KeyboardArrowRight fontSize="small" />
            </div>
          </div>
        </div>

        <div className="medicalDetails__content">
          <MedicalItemCard
            title="pharmacy.medicalDetails.pharmacy"
            items={pharmacyData}
          />

          <MedicalItemCard
            title="pharmacy.medicalDetails.wards"
            items={wards.map((ward) => ({
              title: ward.description,
              value: Math.floor((medical?.inqty ?? 0) / wards.length),
            }))}
          />
        </div>
      </div>
    </div>
  );
};

export default MedicalDetailsActivity;
