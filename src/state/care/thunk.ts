import { createAsyncThunk } from "@reduxjs/toolkit";
import { wrapper } from "libraries/apiUtils/wrapper";
import { CareDTO, CaresApi } from "../../generated";
import { customConfiguration } from "../../libraries/apiUtils/configuration";
import { Param } from "./params";

const api = new CaresApi(customConfiguration());

export const newCare = createAsyncThunk(
  "care/CREATE_CARE",
  async (careDTO: CareDTO, thunkApi) =>
    wrapper(() => api.newCare({ careDTO }))
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const updateCare = createAsyncThunk(
  "care/UPDATE_CARE",
  async ({ id, body }: Param, thunkApi) =>
    wrapper(() => api.updateCare({ id, careDTO: body }))
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const getCareByPatientCode = createAsyncThunk(
  "care/GET_CARES_BY_PATIENT",
  async (patientCode: number, thunkApi) =>
    wrapper(() => api.getCareByPatientCode({ patientCode }))
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);
