import { LocalHospital } from "@mui/icons-material";
import LargeButton from "components/accessories/largeButton/LargeButton";
import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { getPharmacyWards } from "../../../../state/ward";

export default function WardStock() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const pharmacyWards = useAppSelector(
    (state) => state.wards.pharmacyWards.data
  );
  const status = useAppSelector((state) => state.wards.pharmacyWards.status);

  useEffect(() => {
    dispatch(getPharmacyWards());
  }, [dispatch]);

  if (status === "LOADING") return <div>{t("loading")}...</div>;
  if (status === "FAIL") return <div>{t("error.loadingWards")}</div>;

  return (
    <div data-cy="ward-stock" className="wardStock">
      <h1 className="wardStock__title">{t("pharmacy.wards.ward-stock")}</h1>

      <div className="wardStock__list">
        {(pharmacyWards || []).map((ward) => (
          <LargeButton
            key={ward.code}
            handleClick={() => navigate(`/ward-stock/${ward.code}`)}
            data-cy={ward.code}
          >
            <div className="largeButton__inner">
              <LocalHospital />
              <div className="largeButton__inner__label">
                {ward.description}
              </div>
            </div>
          </LargeButton>
        ))}
      </div>
    </div>
  );
}
