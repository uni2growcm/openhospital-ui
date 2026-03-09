import { createAsyncThunk } from "@reduxjs/toolkit";
import { wrapper } from "libraries/apiUtils/wrapper";
import { EthnicDTO, EthnicsApi } from "../../generated";
import { customConfiguration } from "../../libraries/apiUtils/configuration";

const api = new EthnicsApi(customConfiguration());

export const getEthnics = createAsyncThunk(
  "ethnics/getEthnics",
  async (payload: void, thunkApi) =>
    wrapper(() => api.getEthnics())
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const getEthnicById = createAsyncThunk(
  "ethnics/getEthnicById",
  async (id: number, thunkApi) =>
    wrapper(() => api.getEthnicById({ id }))
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const createEthnic = createAsyncThunk(
  "ethnics/createEthnic",
  async (ethnicDTO: EthnicDTO, thunkApi) =>
    wrapper(() => api.newEthnic({ ethnicDTO }))
      .toPromise()
      .then(() => ethnicDTO)
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const updateEthnic = createAsyncThunk(
  "ethnics/updateEthnic",
  async ({ id, ethnicDTO }: { id: number; ethnicDTO: EthnicDTO }, thunkApi) =>
    wrapper(() => api.updateEthnic({ id, ethnicDTO }))
      .toPromise()
      .then(() => ethnicDTO)
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const deleteEthnic = createAsyncThunk(
  "ethnics/deleteEthnic",
  async (id: number, thunkApi) =>
    wrapper(() => api.deleteEthnic({ id }))
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);