import { createAsyncThunk } from "@reduxjs/toolkit";
import { wrapper } from "libraries/apiUtils/wrapper";
import { TownDTO, TownsApi } from "../../generated";
import { customConfiguration } from "../../libraries/apiUtils/configuration";

const api = new TownsApi(customConfiguration());

export const getTowns = createAsyncThunk(
  "towns/getTowns",
  async (payload: void, thunkApi) =>
    wrapper(() => api.getTowns())
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const getTownById = createAsyncThunk(
  "towns/getTownById",
  async (id: number, thunkApi) =>
    wrapper(() => api.getTownById({ id }))
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const createTown = createAsyncThunk(
  "towns/createTown",
  async (townDTO: TownDTO, thunkApi) =>
    wrapper(() => api.newTown({ townDTO }))
      .toPromise()
      .then(() => townDTO)
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const updateTown = createAsyncThunk(
  "towns/updateTown",
  async ({ id, townDTO }: { id: number; townDTO: TownDTO }, thunkApi) =>
    wrapper(() => api.updateTown({ id, townDTO }))
      .toPromise()
      .then(() => townDTO)
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const deleteTown = createAsyncThunk(
  "towns/deleteTown",
  async (id: number, thunkApi) =>
    wrapper(() => api.deleteTown({ id }))
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);