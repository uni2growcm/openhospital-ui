import { CircularProgress } from "@mui/material";
import { PATHS } from "consts";
import { MunicipalityDTO } from "generated";
import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { Navigate } from "react-router-dom";
import {
  createMunicipality,
  createMunicipalityReset,
  getMunicipalityById,
  getMunicipalityByIdReset,
  updateMunicipality,
  updateMunicipalityReset,
} from "state/municipality";
import { EditMunicipalityForm } from "./EditMunicipalityForm";

export const EditMunicipality = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();

  const [municipality, setMunicipality] = useState<MunicipalityDTO | null>(
    null
  );
  const [municipalityNotFound, setMunicipalityNotFound] = useState(false);

  const isEdit = Boolean(id);

  const handleSuccess = () => {
    navigate(PATHS.admin_reference_data, { state: { tab: "commune" } });
  };

  const { isLoading, hasSucceeded, hasFailed, error } = useAppSelector(
    (state) => state.communes.updateMunicipality
  );
  const createState = useAppSelector(
    (state) => state.communes.createMunicipality
  );

  const municipalityRes = useAppSelector(
    (state) => state.communes.getMunicipalityById
  );

  useEffect(() => {
    if (id) {
      dispatch(getMunicipalityById(Number(id)));
    }

    return () => {
      dispatch(updateMunicipalityReset());
      dispatch(createMunicipalityReset());
      dispatch(getMunicipalityByIdReset());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (municipalityRes.hasSucceeded) {
      if (municipalityRes.data) {
        setMunicipality(municipalityRes.data);
      } else {
        setMunicipalityNotFound(true);
      }
    }
  }, [municipalityRes.hasSucceeded, municipalityRes.data]);

  const handleSubmit = (values: MunicipalityDTO) => {
    if (isEdit) {
      dispatch(updateMunicipality({ id: values.id!, municipalityDTO: values }));
    } else {
      dispatch(createMunicipality(values));
    }
  };

  if (municipalityNotFound) return <Navigate to={PATHS.admin} />;

  const initialValues: MunicipalityDTO =
    municipality || ({ id: 0, name: "" } as MunicipalityDTO);

  const loading = isEdit ? isLoading : createState.isLoading;
  const succeeded = isEdit ? hasSucceeded : createState.hasSucceeded;
  const failed = isEdit ? hasFailed : createState.hasFailed;
  const errorObj = isEdit ? error : createState.error;

  return (
    <div>
      {isEdit && (municipalityRes.isLoading || !municipality) ? (
        <CircularProgress style={{ marginLeft: "50%", position: "relative" }} />
      ) : (
        <EditMunicipalityForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          isLoading={loading}
          hasSucceeded={succeeded}
          hasFailed={failed}
          error={errorObj}
          successTitle={isEdit ? t("commune.updated") : t("commune.created")}
          successInfo={
            isEdit
              ? t("commune.updatedsuccessfully")
              : t("commune.createdsuccessfully")
          }
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};
