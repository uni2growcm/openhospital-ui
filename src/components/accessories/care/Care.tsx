import { IS_PROD } from "libraries/consts";
import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import { Permission } from "libraries/permissionUtils/Permission";
import { scrollToElement } from "libraries/uiUtils/scrollToElement";
import React, { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { newCare, newCareReset, updateCare, updateCareReset } from "state/care";
import { IState } from "types";
import checkIcon from "../../../assets/check-icon.png";
import failIcon from "../../../assets/fail-icon.png";
import { CareDTO } from "../../../generated";
import ConfirmationDialog from "../confirmationDialog/ConfirmationDialog";
import InfoBox from "../infoBox/InfoBox";
import CareForm from "./careForm/CareForm";
import CareTable from "./careTable/CareTable";
import "./styles.scss";
import { CareTransitionState } from "./types";
import { useFields } from "./useFields";

const Care: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [shouldResetForm, setShouldResetForm] = useState(false);
  const [creationMode, setCreationMode] = useState(true);
  const [shouldUpdateTable, setShouldUpdateTable] = useState(false);
  const [activityTransitionState, setActivityTransitionState] =
    useState<CareTransitionState>("IDLE");
  const infoBoxRef = useRef<HTMLDivElement>(null);
  const [careToEdit, setCareToEdit] = useState<CareDTO | undefined>(undefined);

  const { id, code } = useParams();

  const encounter = useAppSelector((state) =>
    state.encounters.getEncountersByPatient.data?.find(
      (item) => item.patient.code?.toString() === id && item.code === code
    )
  );

  const createStatus = useAppSelector((state) => state.care.newCare.status);

  const updateStatus = useAppSelector((state) => state.care.updateCare.status);

  const patient = useAppSelector(
    (state: IState) => state.patients.selectedPatient.data
  );

  const usersList = useAppSelector(
    (state: IState) => state.users.userList.data
  );

  const errorMessage = useAppSelector(
    (state) => state.care.newCare.error?.message || t("common.somethingwrong")
  );

  useEffect(() => {
    if (createStatus === "FAIL" || updateStatus === "FAIL") {
      setActivityTransitionState("FAIL");
      scrollToElement(infoBoxRef.current);
    }
  }, [createStatus, updateStatus]);

  const fields = useFields(careToEdit);

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const onSubmit = (care: CareDTO) => {
    setShouldResetForm(false);
    if (!encounter && IS_PROD) {
      setOpenConfirmDialog(true);
      return;
    }
    if (creationMode) {
      care.patient = patient!;
      dispatch(newCare(care));
    } else {
      care.id = careToEdit?.id!;
      care.patient = patient!;
      dispatch(updateCare({ id: careToEdit?.id!, body: care }));
    }
  };

  useEffect(() => {
    if (activityTransitionState === "TO_RESET") {
      dispatch(newCareReset());
      dispatch(updateCareReset());
      setShouldResetForm(true);
      setShouldUpdateTable(true);
    }
  }, [dispatch, patient, activityTransitionState]);

  const resetFormCallback = () => {
    setCreationMode(true);
    setShouldResetForm(false);
    setShouldUpdateTable(false);
    setActivityTransitionState("IDLE");
    setCareToEdit(undefined);
    scrollToElement(null);
  };

  const onEdit = (row: CareDTO) => {
    setCreationMode(false);
    setCareToEdit(row);
    scrollToElement(null);
  };

  return (
    <div className="care">
      {!encounter?.closedAt && (
        <Permission require="care.create">
          <CareForm
            fields={fields}
            creationMode={creationMode}
            submitButtonLabel={
              careToEdit ? t("common.update") : t("common.save")
            }
            resetButtonLabel={t("common.reset")}
            isLoading={createStatus === "LOADING"}
            onSubmit={onSubmit}
            shouldResetForm={shouldResetForm}
            resetFormCallback={resetFormCallback}
          />
        </Permission>
      )}

      {createStatus === "FAIL" && (
        <div ref={infoBoxRef} className="info-box-container">
          <InfoBox type="error" message={errorMessage} />
        </div>
      )}

      <CareTable
        handleEdit={encounter?.closedAt ? undefined : onEdit}
        shouldUpdateTable={shouldUpdateTable}
      />

      <ConfirmationDialog
        isOpen={createStatus === "SUCCESS" || updateStatus === "SUCCESS"}
        title={creationMode ? t("care.created") : t("care.updated")}
        icon={checkIcon}
        info={creationMode ? t("care.createsuccess") : t("care.updatesuccess")}
        primaryButtonLabel="Ok"
        handlePrimaryButtonClick={() => setActivityTransitionState("TO_RESET")}
        handleSecondaryButtonClick={() => ({})}
      />
      <ConfirmationDialog
        isOpen={openConfirmDialog}
        title={t("encounters.information")}
        icon={failIcon}
        info={t("encounters.informationmessage")}
        primaryButtonLabel="Ok"
        handlePrimaryButtonClick={() => setOpenConfirmDialog(false)}
        handleSecondaryButtonClick={() => ({})}
      />
    </div>
  );
};

export default Care;
