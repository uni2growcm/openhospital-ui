import { CircularProgress } from "@mui/material";
import { PATHS } from "consts";
import { EthnicDTO } from "generated";
import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { Navigate } from "react-router-dom";
import {
    createEthnic,
    createEthnicReset,
    getEthnicById,
    getEthnicByIdReset,
    updateEthnic,
    updateEthnicReset
} from "state/ethnic";
import { EditEthnicForm } from "./EditEthnicForm";

export const EditEthnic = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [ethnic, setEthnic] = useState<EthnicDTO | null>(null);
  const [ethnicNotFound, setEthnicNotFound] = useState(false);

  const { t } = useTranslation();
  const isEdit = Boolean(id);

  const handleSuccess = () => {
    navigate(PATHS.admin_reference_data, { state: { tab: "ethnic" } });
  };

  const { isLoading, hasSucceeded, hasFailed, error } = useAppSelector(
    (state) => state.ethnics.update
  );
  const createState = useAppSelector((state) => state.ethnics.create);

  const ethnicRes = useAppSelector((state) => state.ethnics.getById);

  useEffect(() => {
    if (id) {
      dispatch(getEthnicById(Number(id)));
    }

    return () => {
      dispatch(updateEthnicReset());
      dispatch(createEthnicReset());
      dispatch(getEthnicByIdReset());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (ethnicRes.hasSucceeded) {
      if (ethnicRes.data) {
        setEthnic(ethnicRes.data);
      } else {
        setEthnicNotFound(true);
      }
    }
  }, [ethnicRes.hasSucceeded, ethnicRes.data]);

  const handleSubmit = (ethnic: EthnicDTO) => {
    if (isEdit) {
      dispatch(updateEthnic({ id: ethnic.id!, ethnicDTO: ethnic }));
    } else {
      dispatch(createEthnic(ethnic));
    }
  };

  if (ethnicNotFound) return <Navigate to={PATHS.admin} />;

  const initialValues: EthnicDTO = ethnic || ({ id: 0, name: "" } as EthnicDTO);

  const loading = isEdit ? isLoading : createState.isLoading;
  const succeeded = isEdit ? hasSucceeded : createState.hasSucceeded;
  const failed = isEdit ? hasFailed : createState.hasFailed;
  const errorObj = isEdit ? error : createState.error;

  return (
    <div>
      {isEdit && (ethnicRes.isLoading || !ethnic) ? (
        <CircularProgress style={{ marginLeft: "50%", position: "relative" }} />
      ) : (
        <EditEthnicForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          isLoading={loading}
          hasSucceeded={succeeded}
          hasFailed={failed}
          error={errorObj}
          title={isEdit ? t("ethnic.editethnic") : t("ethnic.newethnic")}
          successTitle={isEdit ? t("ethnic.updated") : t("ethnic.created")}
          successInfo={
            isEdit
              ? t("ethnic.updatedsuccessfully")
              : t("ethnic.createdsuccessfully")
          }
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};