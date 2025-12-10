import checkIcon from "assets/check-icon.png";
import ConfirmationDialog from "components/accessories/confirmationDialog/ConfirmationDialog";
import InfoBox from "components/accessories/infoBox/InfoBox";
import { PATHS } from "consts";
import { MedicalWardDTO, MovementWardDTO } from "generated";
import { useNavigationHandler, useTranslation } from "libraries/hooks";
import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import React, { useCallback, useEffect, useRef } from "react";
import { useOutletContext, useParams } from "react-router";
import { getMedicals } from "state/medicals";
import { newMovementWard, resetNewMovementWard } from "state/pharmacy";
import { PharmacyActivityContent } from "../PharmacyActivityContent";
import RectifyQuantityForm from "./components/form/RectifyQuantityForm";

const WardStockRectify: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const infoBoxRef = useRef<HTMLDivElement>(null);

  const status = useAppSelector(
    (state) => state.pharmacy.newMovementWard.status
  );

  const errorMessage = useAppSelector(
    (state) =>
      state.pharmacy.newMovementWard.error?.message ??
      t("pharmacy.messages.rectify-movement-fail.description")
  );

  const handleGoBack = useNavigationHandler(PATHS.pharmacy_ward_stock, {
    replace: true,
  });

  const handleDialogActions = useCallback(() => {
    dispatch(resetNewMovementWard());
    if (status === "SUCCESS") {
      handleGoBack();
    }
  }, [dispatch, status, handleGoBack]);

  const params = useParams<{
    medCode?: string;
    wardCode?: string;
    lotCode?: string;
  }>();

  const { breadcrumbMap, setBreadcrumbMap } = useOutletContext<{
    breadcrumbMap: Record<string, string>;
    setBreadcrumbMap: (map: Record<string, string | undefined>) => void;
  }>();


  const selectedMedical = useAppSelector((state) =>
    state.pharmacy.wardMedicals.data?.find((med: MedicalWardDTO) => {
      return (
        String(med.id?.ward?.code ?? "") === String(params.wardCode ?? "") &&
        String(med.id?.medical?.code ?? "") === String(params.medCode ?? "")
      );
    })
  );

  const handleSubmit = useCallback(
    (updatedMedical: MovementWardDTO) => {
      dispatch(newMovementWard(updatedMedical));
    },
    [dispatch]
  );

  useEffect(() => {
    setBreadcrumbMap({
      ...breadcrumbMap,
      [t("pharmacy.labels.ward-stock")]: PATHS.pharmacy_ward_stock,
      [t("pharmacy.labels.rectify-ward-stock")]:
        PATHS.pharmacy_ward_stock_rectify
          .replace(":medCode", params.medCode ?? "")
          .replace(":wardCode", params.wardCode ?? "")
          .replace(":lotCode", params.lotCode ?? ""),
    });

    return () => {
      setBreadcrumbMap({
        [t("pharmacy.labels.ward-stock")]: PATHS.pharmacy_ward_stock,
      });
    };
  }, [params.medCode, params.wardCode, params.lotCode, t, breadcrumbMap, setBreadcrumbMap]);

  useEffect(() => {
    dispatch(getMedicals())
  }, [dispatch]);

  return (
    <PharmacyActivityContent
      data-cy="rectify-ward-stock"
      title={t("pharmacy.labels.rectify-ward-stock")}
    >
      <div className="update-pharmaceutical">
        {selectedMedical && (
          <RectifyQuantityForm
            onSubmit={handleSubmit}
            pharmaceutical={selectedMedical}
            loading={status === "LOADING"}
          />
        )}

        {status === "FAIL" && (
          <div ref={infoBoxRef} className="info-box-container">
            <InfoBox type="error" message={errorMessage} />
          </div>
        )}
      </div>

      <ConfirmationDialog
        isOpen={status === "SUCCESS"}
        title={t("pharmacy.messages.rectify-movement-success.title")}
        icon={checkIcon}
        info={t("pharmacy.messages.rectify-movement-success.description")}
        primaryButtonLabel="OK"
        handlePrimaryButtonClick={handleDialogActions}
        handleSecondaryButtonClick={handleDialogActions}
      />
    </PharmacyActivityContent>
  );
};

export default WardStockRectify;
