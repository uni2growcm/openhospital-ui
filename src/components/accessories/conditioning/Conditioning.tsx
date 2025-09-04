import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import { usePermission } from "libraries/permissionUtils/usePermission";
import { scrollToElement } from "libraries/uiUtils/scrollToElement";
import React, { FC, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import {
  getLastConditioningByPatientCode,
  newConditioning,
  newConditioningReset,
  updateConditioning,
  updateConditioningReset,
} from "state/conditionings";
import { getPatient } from "state/patients";
import { IState } from "types";
import checkIcon from "../../../assets/check-icon.png";
import { ConditioningDTO } from "../../../generated";
import ConfirmationDialog from "../confirmationDialog/ConfirmationDialog";
import InfoBox from "../infoBox/InfoBox";
import ConditioningForm from "./conditioningForm/conditioningForm";
import ConditioningTable from "./conditioningTable/ConditioningTable";
import { CurrentConditioning } from "./currentConditioning/CurrentConditioning";
import "./styles.scss";
import { ConditioningTransitionState } from "./types";
import { useFields } from "./useFields";

const Conditioning: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const infoBoxRef = useRef<HTMLDivElement>(null);

  const canCreate = usePermission("conditioning.new");
  const canUpdate = usePermission("conditioning.update");

  const patient = useAppSelector(
    (state: IState) => state.patients.selectedPatient.data
  );
  const currentConditioning = useAppSelector(
    (state: IState) => state.conditioning.getLastConditioningByPatientCode.data
  );

  const createStatus = useAppSelector(
    (state) => state.conditioning.newConditioning.status
  );
  const updateStatus = useAppSelector(
    (state) => state.conditioning.updateConditioning.status
  );

  const errorMessage = useAppSelector(
    (state) =>
      state.conditioning.newConditioning.error?.message ||
      state.conditioning.updateConditioning.error?.message ||
      t("common.somethingwrong")
  );

  const [creationMode, setCreationMode] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [conditioningToEdit, setConditioningToEdit] = useState<
    ConditioningDTO | undefined
  >();
  const [isEditingCurrent, setIsEditingCurrent] = useState(false);
  const { id } = useParams();
  const [shouldResetForm, setShouldResetForm] = useState(false);
  const [shouldUpdateTable, setShouldUpdateTable] = useState(false);
  const [activityTransitionState, setActivityTransitionState] =
    useState<ConditioningTransitionState>("IDLE");

  const patientCode = useAppSelector(
    (state) => state.patients.selectedPatient.data?.code
  );

  const onSubmit = (cond: ConditioningDTO) => {
    setShouldResetForm(false);
    if (creationMode) {
      cond.patient = patient!;
      dispatch(newConditioning(cond));
    } else {
      cond.patient = patient!;
      cond.id = conditioningToEdit?.id!;
      dispatch(
        updateConditioning({
          id: cond.id,
          body: cond,
        })
      );
    }
  };

  useEffect(() => {
    if (activityTransitionState === "TO_RESET") {
      dispatch(newConditioningReset());
      dispatch(updateConditioningReset());
      setShouldResetForm(true);
      setShouldUpdateTable(true);
    }
  }, [dispatch, activityTransitionState]);

  useEffect(() => {
    if (patientCode && creationMode) {
      dispatch(getLastConditioningByPatientCode(parseInt(id!!)));
    }
  }, [dispatch, patientCode, creationMode, id]);

  useEffect(() => {
    if (creationMode && !!currentConditioning) {
      setShowForm(false);
    } else {
      setShowForm(true);
    }
  }, [creationMode, currentConditioning]);

  useEffect(() => {
    dispatch(newConditioningReset());
    dispatch(updateConditioningReset());
  }, [dispatch]);

  const resetFormCallback = () => {
    setCreationMode(true);
    setShouldResetForm(false);
    setShouldUpdateTable(false);
    setActivityTransitionState("IDLE");
    setConditioningToEdit(undefined);
    scrollToElement(null);
  };

  const fields = useFields(conditioningToEdit);

  useEffect(() => {
    if (createStatus === "SUCCESS" || updateStatus === "SUCCESS") {
      dispatch(getPatient(id!!));
      dispatch(getLastConditioningByPatientCode(parseInt(id!!)));
    }
  }, [createStatus, dispatch, id, updateStatus]);

  const onEdit = (row: ConditioningDTO) => {
    setConditioningToEdit(row);
    setCreationMode(false);
    scrollToElement(null);
  };

  const onCurrentConditioningChange = (value: boolean) => {
    setIsEditingCurrent(value);
  };

  return (
    <div className="Conditioning">
      {!showForm && currentConditioning && (
        <InfoBox type="info" message={t("conditioning.currentexists")} />
      )}
      {!showForm && currentConditioning && (
        <CurrentConditioning
          onEditChange={onCurrentConditioningChange}
          onEditConditioning={onEdit}
        />
      )}
      {showForm && (creationMode ? canCreate : canUpdate) && (
        <ConditioningForm
          fields={fields}
          onSubmit={onSubmit}
          submitButtonLabel={
            conditioningToEdit ? t("common.update") : t("common.save")
          }
          resetButtonLabel={t("common.reset")}
          shouldResetForm={shouldResetForm}
          resetFormCallback={resetFormCallback}
          isLoading={createStatus === "LOADING" || updateStatus === "LOADING"}
        />
      )}

      {(createStatus === "FAIL" || updateStatus === "FAIL") && (
        <div ref={infoBoxRef} className="info-box-container">
          <InfoBox type="error" message={errorMessage} />
        </div>
      )}

      <ConditioningTable
        handleEdit={onEdit}
        shouldUpdateTable={shouldUpdateTable}
      />

      <ConfirmationDialog
        isOpen={
          createStatus === "SUCCESS" ||
          (updateStatus === "SUCCESS" && !isEditingCurrent)
        }
        title={
          creationMode ? t("conditioning.created") : t("conditioning.updated")
        }
        icon={checkIcon}
        info={
          creationMode
            ? t("conditioning.createsuccess")
            : t("conditioning.updatesuccess")
        }
        primaryButtonLabel="Ok"
        handlePrimaryButtonClick={() => setActivityTransitionState("TO_RESET")}
        handleSecondaryButtonClick={() => ({})}
      />
    </div>
  );
};

export default Conditioning;
