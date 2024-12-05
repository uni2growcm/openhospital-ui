import { createAsyncThunk } from "@reduxjs/toolkit";
import { RadiologyApi } from "../../generated";
import { customConfiguration } from "../../libraries/apiUtils/configuration";

const api = new RadiologyApi(customConfiguration());

export const getPatientStudies = createAsyncThunk(
  "radiology/getPatientStudies",
  async (id: string, thunkApi) =>
    api
      .getPatientStudiesById({ id })
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const getStudySeries = createAsyncThunk(
  "radiology/getStudySeries",
  async (id: string, thunkApi) =>
    api
      .getStudySeriesById({ id })
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const getSerieInstances = createAsyncThunk(
  "radiology/getSerieInstances",
  async (id: string, thunkApi) =>
    api
      .getSeriesInstancesById({ id })
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);
