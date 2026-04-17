import { Edit, KeyboardArrowRight } from "@mui/icons-material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router";
import Button from "~/components/accessories/button/Button";
import { PATHS } from "~/consts";
import { MedicalWardQuantityDTO } from "~/generated";
import { useAppDispatch, useAppSelector } from "~/libraries/hooks/redux";
import { getCurrentQuantityInAllWards, getMedical } from "~/state/pharmacy";
import { getWards } from "~/state/wards";
import MedicalItemCard from "../medicalItemCard/MedicalItemCard";
import { getPharmacyData } from "./consts";
import "./styles.scss";

const MedicalDetails = () => {
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

  const wardQties: MedicalWardQuantityDTO[] = useAppSelector(
    (state) => state.pharmacy.getCurrentQuantityInAllWards.data || []
  );

  useEffect(() => {
    if (!medical) return;

    dispatch(
      getCurrentQuantityInAllWards({
        medicalId: medical.code ?? 0,
      })
    );
  }, [dispatch, medical]);

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
                ? `${medical.description}`
                : medical.description || "Medical"}
            </div>
          </div>

          <div
            data-cy="medical-edit-button"
            className="medicalDetails__sidebar__button"
          >
            <Button variant="contained" color="primary" type="button" onClick={handleEdit}>
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
                <DashboardOutlinedIcon fontSize="small" />{" "}
                {t("pharmacy.medicalDetails.overview")}
              </span>
              <KeyboardArrowRight fontSize="small" />
            </div>
          </div>
        </div>

        <div className="medicalDetails__content">
          <h5 className="medicalDetails__title">
            {t("pharmacy.medicalDetails.pharmacy")}
          </h5>
          <div data-cy="medical-item-card" className="medicalItem__cards">
            {pharmacyData.map((item) => (
              <MedicalItemCard key={item.title} item={item} />
            ))}
          </div>

          <h5 className="medicalDetails__title">
            {t("pharmacy.medicalDetails.wards")}
          </h5>

          <div data-cy="medical-item-card" className="medicalItem__cards">
            {wardQties.map((wardQty) => (
              <MedicalItemCard
                key={wardQty.medical.code}
                item={{
                  title: wardQty.ward.description,
                  value: wardQty.quantity,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalDetails;
