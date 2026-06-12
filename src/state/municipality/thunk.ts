import { createAsyncThunk } from "@reduxjs/toolkit";
import { wrapper } from "libraries/apiUtils/wrapper";
import { MunicipalitiesApi, MunicipalityDTO } from "../../generated";
import { customConfiguration } from "../../libraries/apiUtils/configuration";

const api = new MunicipalitiesApi(customConfiguration());

export const getMunicipalities = createAsyncThunk(
  "municipalities/getMunicipalities",
  async (payload: void, thunkApi) =>
    wrapper(() => api.getMunicipalities())
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const getMunicipalityById = createAsyncThunk(
  "municipalities/getMunicipalityById",
  async (id: number, thunkApi) =>
    wrapper(() => api.getMunicipalityById({ id }))
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const createMunicipality = createAsyncThunk(
  "municipalities/createMunicipality",
  async (municipalityDTO: MunicipalityDTO, thunkApi) =>
    wrapper(() => api.newMunicipality({ municipalityDTO }))
      .toPromise()
      .then(() => municipalityDTO)
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const updateMunicipality = createAsyncThunk(
  "municipalities/updateMunicipality",
  async ({ id, municipalityDTO }: { id: number; municipalityDTO: MunicipalityDTO }, thunkApi) =>
    wrapper(() => api.updateMunicipality({ id, municipalityDTO }))
      .toPromise()
      .then(() => municipalityDTO)
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const deleteMunicipality = createAsyncThunk(
  "municipalities/deleteMunicipality",
  async (id: number, thunkApi) =>
    wrapper(() => api.deleteMunicipality({ id }))
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);