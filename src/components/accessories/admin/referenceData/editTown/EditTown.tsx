import { CircularProgress } from "@mui/material";
import { PATHS } from "consts";
import { TownDTO } from "generated";
import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { Navigate, useNavigate } from "react-router-dom";
import {
    createTown,
    createTownReset,
    getTownById,
    getTownByIdReset,
    updateTown,
    updateTownReset
} from "state/town";
import { EditTownForm } from "./EditTownForm";

export const EditTown = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [town, setTown] = useState<TownDTO | null>(null);
  const [townNotFound, setTownNotFound] = useState(false);

  const { t } = useTranslation();
  const isEdit = Boolean(id);

  const handleSuccess = () => {
    navigate(PATHS.admin_reference_data, { state: { tab: "town" } });
  };

  const createState = useAppSelector((state) => state.towns.create);

  const { isLoading, hasSucceeded, hasFailed, error } = useAppSelector(
    (state) => state.towns.update
  );

  const townRes = useAppSelector((state) => state.towns.getById);

  useEffect(() => {
    if (id) {
      dispatch(getTownById(Number(id)));
    }

    return () => {
      dispatch(updateTownReset());
      dispatch(createTownReset());
      dispatch(getTownByIdReset());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (townRes.hasSucceeded) {
      if (townRes.data) {
        setTown(townRes.data);
      } else {
        setTownNotFound(true);
      }
    }
  }, [townRes.hasSucceeded, townRes.data]);

  const handleSubmit = (town: TownDTO) => {
    if (isEdit) {
      dispatch(updateTown({ id: town.id!, townDTO: town }));
    } else {
      dispatch(createTown(town));
    }
  };

  if (townNotFound) return <Navigate to={PATHS.admin} />;

  const initialValues: TownDTO =
    town || ({ id: 0, name: "" } as TownDTO);

  const loading = isEdit ? isLoading : createState.isLoading;
  const succeeded = isEdit ? hasSucceeded : createState.hasSucceeded;
  const failed = isEdit ? hasFailed : createState.hasFailed;
  const errorObj = isEdit ? error : createState.error;

  return (
    <div>
      {isEdit && (townRes.isLoading || !town) ? (
        <CircularProgress style={{ marginLeft: "50%", position: "relative" }} />
      ) : (
        <EditTownForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          isLoading={loading}
          hasSucceeded={succeeded}
          hasFailed={failed}
          error={errorObj}
          title={isEdit ? t("town.edittown") : t("town.newtown")}
          successTitle={isEdit ? t("town.updated") : t("town.created")}
          successInfo={
            isEdit
              ? t("town.updatedsuccessfully")
              : t("town.createdsuccessfully")
          }
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};