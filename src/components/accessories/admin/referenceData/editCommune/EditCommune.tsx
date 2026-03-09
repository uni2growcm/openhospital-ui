import { CircularProgress } from "@mui/material";
import { PATHS } from "consts";
import { CommuneDTO } from "generated";
import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { Navigate } from "react-router-dom";
import {
    createCommune,
    createCommuneReset,
    getCommuneById,
    getCommuneByIdReset,
    updateCommune,
    updateCommuneReset,
} from "state/commune";
import { EditCommuneForm } from "./EditCommuneForm";

export const EditCommune = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();

  const [commune, setCommune] = useState<CommuneDTO | null>(null);
  const [communeNotFound, setCommuneNotFound] = useState(false);

  const isEdit = Boolean(id);

  const handleSuccess = () => {
    navigate(PATHS.admin_reference_data, { state: { tab: "commune" } });
  };

  const { isLoading, hasSucceeded, hasFailed, error } = useAppSelector(
    (state) => state.communes.update
  );
  const createState = useAppSelector((state) => state.communes.create);

  const getCommune = useAppSelector((state) => state.communes.getById);

  /**
   * Load commune
   */
  useEffect(() => {
    if (id) {
      dispatch(getCommuneById(Number(id)));
    }

    return () => {
      dispatch(updateCommuneReset());
      dispatch(createCommuneReset());
      dispatch(getCommuneByIdReset());
    };
  }, [dispatch, id]);

  /**
   * Set commune after fetch
   */
  useEffect(() => {
    if (getCommune.hasSucceeded) {
      if (getCommune.data) {
        setCommune(getCommune.data);
      } else {
        setCommuneNotFound(true);
      }
    }
  }, [getCommune.hasSucceeded, getCommune.data]);

  const handleSubmit = (values: CommuneDTO) => {
    if (isEdit) {
      dispatch(updateCommune({ id: values.id!, communeDTO: values }));
    } else {
      dispatch(createCommune(values));
    }
  };

  if (communeNotFound) return <Navigate to={PATHS.admin} />;

  const initialValues: CommuneDTO = commune || ({ id: 0, name: "" } as CommuneDTO);

  const loading = isEdit ? isLoading : createState.isLoading;
  const succeeded = isEdit ? hasSucceeded : createState.hasSucceeded;
  const failed = isEdit ? hasFailed : createState.hasFailed;
  const errorObj = isEdit ? error : createState.error;

  if (isEdit && (getCommune.isLoading || !commune)) {
    return (
      <CircularProgress style={{ marginLeft: "50%", position: "relative" }} />
    );
  }

  return (
    <EditCommuneForm
      initialValues={initialValues}
      onSubmit={handleSubmit}
      isLoading={loading}
      hasSucceeded={succeeded}
      hasFailed={failed}
      error={errorObj}
      successTitle={
        isEdit ? t("commune.updated") : t("commune.created")
      }
      successInfo={
        isEdit
          ? t("commune.updatedsuccessfully")
          : t("commune.createdsuccessfully")
      }
      onSuccess={handleSuccess}
    />
  );
};