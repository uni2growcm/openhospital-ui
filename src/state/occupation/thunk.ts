import { createAsyncThunk } from "@reduxjs/toolkit";
import { wrapper } from "libraries/apiUtils/wrapper";
import { OccupationDTO, OccupationsApi } from "../../generated";
import { customConfiguration } from "../../libraries/apiUtils/configuration";

const api = new OccupationsApi(customConfiguration());

export const getOccupations = createAsyncThunk(
  "occupations/getOccupations",
  async (payload: void, thunkApi) =>
    wrapper(() => api.getOccupations())
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const getOccupationById = createAsyncThunk(
  "occupations/getOccupationById",
  async (id: number, thunkApi) =>
    wrapper(() => api.getOccupationById({ id }))
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const createOccupation = createAsyncThunk(
  "occupations/createOccupation",
  async (occupationDTO: OccupationDTO, thunkApi) =>
    wrapper(() => api.newOccupation({ occupationDTO }))
      .toPromise()
      .then(() => occupationDTO)
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const updateOccupation = createAsyncThunk(
  "occupations/updateOccupation",
  async ({ id, occupationDTO }: { id: number; occupationDTO: OccupationDTO }, thunkApi) =>
    wrapper(() => api.updateOccupation({ id, occupationDTO }))
      .toPromise()
      .then(() => occupationDTO)
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const deleteOccupation = createAsyncThunk(
  "occupations/deleteOccupation",
  async (id: number, thunkApi) =>
    wrapper(() => api.deleteOccupation({ id }))
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);
