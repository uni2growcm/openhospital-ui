import { createAsyncThunk } from "@reduxjs/toolkit";
import { wrapper } from "libraries/apiUtils/wrapper";
import { RadiologyApi } from "../../generated";
import { customConfiguration } from "../../libraries/apiUtils/configuration";

const api = new RadiologyApi(customConfiguration());

export const getPatientStudies = createAsyncThunk(
  "radiology/getPatientStudies",
  async (id: string, thunkApi) =>
    wrapper(() => api.getPatientStudiesById({ id }))
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const getStudySeries = createAsyncThunk(
  "radiology/getStudySeries",
  async (id: string, thunkApi) =>
    wrapper(() => api.getStudySeriesById({ id }))
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const getSerieInstances = createAsyncThunk(
  "radiology/getSerieInstances",
  async (id: string, thunkApi) =>
    wrapper(() => api.getSeriesInstancesById({ id }))
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const getInstancePreview = createAsyncThunk(
  "radiology/getInstancePreview",
  async (id: string, thunkApi) =>
    wrapper(() => api.getInstancePreview({ id }))
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);
