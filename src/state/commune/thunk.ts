import { createAsyncThunk } from "@reduxjs/toolkit";
import { wrapper } from "libraries/apiUtils/wrapper";
import { CommuneDTO, CommunesApi } from "../../generated";
import { customConfiguration } from "../../libraries/apiUtils/configuration";

const api = new CommunesApi(customConfiguration());

export const getCommunes = createAsyncThunk(
  "communes/getCommunes",
  async (payload: void, thunkApi) =>
    wrapper(() => api.getCommunes())
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const getCommuneById = createAsyncThunk(
  "communes/getCommuneById",
  async (id: number, thunkApi) =>
    wrapper(() => api.getCommuneById({ id }))
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const createCommune = createAsyncThunk(
  "communes/createCommune",
  async (communeDTO: CommuneDTO, thunkApi) =>
    wrapper(() => api.newCommune({ communeDTO }))
      .toPromise()
      .then(() => communeDTO)
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const updateCommune = createAsyncThunk(
  "communes/updateCommune",
  async ({ id, communeDTO }: { id: number; communeDTO: CommuneDTO }, thunkApi) =>
    wrapper(() => api.updateCommune({ id, communeDTO }))
      .toPromise()
      .then(() => communeDTO)
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const deleteCommune = createAsyncThunk(
  "communes/deleteCommune",
  async (id: number, thunkApi) =>
    wrapper(() => api.deleteCommune({ id }))
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);