import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router";
import checkIcon from "../../../../assets/check-icon.png";
import { PharmacyActivityContent } from "../PharmacyActivityContent";
import { WardDischargeForm } from "./components/dischargeMovementForm/DischargeMovementForm";
import { DisChargeMovementTransitionState } from "./types";
import { useWardMedicals } from "~/libraries/hooks/api";
import { useAppDispatch, useAppSelector } from "~/libraries/hooks/redux";
import { PATHS } from "~/consts";
import { MovementWardDTO } from "~/generated";
import { createMovementReset, createWardMovement, resetCreateWardMovement } from "~/state/pharmacy";
import ConfirmationDialog from "~/components/accessories/confirmationDialog/ConfirmationDialog";
import InfoBox from "~/components/accessories/infoBox/InfoBox";

export function WardDischargeMovement() {
  const params = useParams();

  const medId = params["medical"];
  const wardCode = params["ward"];

  const { selectMedical } = useWardMedicals(wardCode || "0");

  const medical = useMemo(() => selectMedical(+(medId ?? "0")), [medId]);

  const dispatch = useAppDispatch();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const infoBoxRef = useRef<HTMLDivElement>(null);

  const [activityTransitionState, setActivityTransitionState] =
    useState<DisChargeMovementTransitionState>("IDLE");

  const createStatus = useAppSelector(
    (state) => state.pharmacy.createWardMovement.status
  );

  const errorMessage = useAppSelector(
    (state) => state.pharmacy.createWardMovement.error?.message
  ) as string;

  const { breadcrumbMap, setBreadcrumbMap } = useOutletContext<{
    breadcrumbMap: Record<string, string>;
    setBreadcrumbMap: (map: Record<string, string | undefined>) => void;
  }>();

  const breadcrumbValues = useMemo(
    () => ({
      pharmacy: t("nav.pharmacy"),
      wardStock: t("pharmacy.labels.ward-stock"),
      discharge: t("pharmacy.labels.discharge-movement"),
    }),
    [t]
  );

  useEffect(() => {
    setBreadcrumbMap({
      [breadcrumbValues.pharmacy]: PATHS.pharmacy,
      [breadcrumbValues.wardStock]: PATHS.pharmacy_ward_stock,
      [breadcrumbValues.discharge]: PATHS.pharmacy_ward_stock_discharge,
    });

    return () =>
      setBreadcrumbMap({
        [breadcrumbValues.pharmacy]: PATHS.pharmacy,
      });
  }, [breadcrumbValues, setBreadcrumbMap]);

  const handleSubmit = useCallback(
    (payload: MovementWardDTO) => {
      dispatch(
        createWardMovement({ ...payload, isPatient: !!payload.patient })
      );
    },
    [dispatch]
  );

  const handleReset = useCallback(() => {
    const newMap = { ...breadcrumbMap };
    delete newMap[breadcrumbValues.wardStock];
    delete newMap[breadcrumbValues.discharge];

    dispatch(resetCreateWardMovement());
    setBreadcrumbMap(newMap);
    setActivityTransitionState("TO_RESET");

    navigate(PATHS.pharmacy_ward_stock, { replace: true });
  }, [dispatch, breadcrumbMap, navigate, breadcrumbValues, setBreadcrumbMap]);

  useEffect(() => {
    if (activityTransitionState === "TO_RESET") {
      dispatch(createMovementReset());
      setActivityTransitionState("IDLE");
    }
  }, [activityTransitionState, dispatch]);

  return (
    <PharmacyActivityContent
      data-cy="ward-discharge-movement"
      title={`${t("pharmacy.stock.ward.dischargeMovement")} (${
        medical?.ward.description
      })`}
    >
      <div className="discharge-movement">
        {medical && (
          <WardDischargeForm
            medical={medical as any}
            onSubmit={handleSubmit}
            onCancel={() => navigate(PATHS.pharmacy_ward_stock)}
          />
        )}
      </div>

      <ConfirmationDialog
        isOpen={createStatus === "SUCCESS"}
        title={t("pharmacy.stock.ward.movementCreated")}
        icon={checkIcon}
        info={t("pharmacy.stock.ward.dischargeMovementCreatedSuccessfully")}
        primaryButtonLabel={t("pharmacy.labels.ok")}
        handlePrimaryButtonClick={handleReset}
        handleSecondaryButtonClick={() => ({})}
      />

      {createStatus === "SUCCESS_EMPTY" && (
        <div ref={infoBoxRef} className="info-box-container">
          <InfoBox type="info" message={t("admission.patientnotadmitted")} />
        </div>
      )}

      {createStatus === "FAIL" && (
        <div ref={infoBoxRef} className="info-box-container">
          <InfoBox type="error" message={errorMessage} />
        </div>
      )}
    </PharmacyActivityContent>
  );
}
