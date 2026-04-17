import checkIcon from "~/assets/check-icon.png";
import React, { useCallback, useEffect } from "react";
import { useOutletContext, useParams } from "react-router";
import { PharmacyActivityContent } from "../PharmacyActivityContent";
import RectifyQuantityForm from "./components/form/RectifyQuantityForm";
import { useNavigationHandler, useTranslation } from "~/libraries/hooks";
import { useAppDispatch, useAppSelector } from "~/libraries/hooks/redux";
import { createWardMovement, getMedicals, resetCreateWardMovement } from "~/state/pharmacy";
import { PATHS } from "~/consts";
import { MedicalWardDTO, MovementWardDTO } from "~/generated";
import ConfirmationDialog from "~/components/accessories/confirmationDialog/ConfirmationDialog";

const WardStockRectify: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const status = useAppSelector(
    (state) => state.pharmacy.createWardMovement.status
  );

  const handleGoBack = useNavigationHandler(PATHS
    .pharmacy_ward_stock, {
    replace: true,
  });

  const handleDialogActions = useCallback(() => {
    dispatch(resetCreateWardMovement());
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
      dispatch(createWardMovement(updatedMedical));
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
  }, [
    params.medCode,
    params.wardCode,
    params.lotCode,
    t,
    breadcrumbMap,
    setBreadcrumbMap,
  ]);

  useEffect(() => {
    dispatch(getMedicals());
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
