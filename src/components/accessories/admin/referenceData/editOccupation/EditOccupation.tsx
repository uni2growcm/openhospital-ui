import { CircularProgress } from "@mui/material";
import { PATHS } from "consts";
import { OccupationDTO } from "generated";
import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { Navigate } from "react-router-dom";
import {
    createOccupation,
    createOccupationReset,
    getOccupationById,
    getOccupationByIdReset,
    updateOccupation,
    updateOccupationReset
} from "state/occupation";
import { EditOccupationForm } from "./EditOccupationForm";

export const EditOccupation = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [occupation, setOccupation] = useState<OccupationDTO | null>(null);
  const [occupationNotFound, setOccupationNotFound] = useState(false);

  const { t } = useTranslation();
  const isEdit = Boolean(id);

  const handleSuccess = () => {
    navigate(PATHS.admin_reference_data, { state: { tab: "occupation" } });
  };

  const { isLoading, hasSucceeded, hasFailed, error } = useAppSelector(
    (state) => state.occupations.update
  );
  const createState = useAppSelector((state) => state.occupations.create);

  const occupationRes = useAppSelector((state) => state.occupations.getById);

  useEffect(() => {
    if (id) {
      dispatch(getOccupationById(Number(id)));
    }

    return () => {
      dispatch(updateOccupationReset());
      dispatch(createOccupationReset());
      dispatch(getOccupationByIdReset());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (occupationRes.hasSucceeded) {
      if (occupationRes.data) {
        setOccupation(occupationRes.data);
      } else {
        setOccupationNotFound(true);
      }
    }
  }, [occupationRes.hasSucceeded, occupationRes.data]);

  const handleSubmit = (occupation: OccupationDTO) => {
    if (isEdit) {
      dispatch(updateOccupation({ id: occupation.id!, occupationDTO: occupation }));
    } else {
      dispatch(createOccupation(occupation));
    }
  };

  if (occupationNotFound) return <Navigate to={PATHS.admin} />;

  const initialValues: OccupationDTO = occupation || ({ id: 0, name: "" } as OccupationDTO);

  const loading = isEdit ? isLoading : createState.isLoading;
  const succeeded = isEdit ? hasSucceeded : createState.hasSucceeded;
  const failed = isEdit ? hasFailed : createState.hasFailed;
  const errorObj = isEdit ? error : createState.error;

  return (
    <div>
      {isEdit && (occupationRes.isLoading || !occupation) ? (
        <CircularProgress style={{ marginLeft: "50%", position: "relative" }} />
      ) : (
        <EditOccupationForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          isLoading={loading}
          hasSucceeded={succeeded}
          hasFailed={failed}
          error={errorObj}
          title={
            isEdit
              ? t("occupation.editoccupation")
              : t("occupation.newoccupation")
          }
          successTitle={
            isEdit ? t("occupation.updated") : t("occupation.created")
          }
          successInfo={
            isEdit
              ? t("occupation.updatedsuccessfully")
              : t("occupation.createdsuccessfully")
          }
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};