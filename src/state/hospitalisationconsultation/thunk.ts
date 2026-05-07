import { createAsyncThunk } from "@reduxjs/toolkit";
import { wrapper } from "libraries/apiUtils/wrapper";
import { HospitalizationConsultationDTO, HospitalizationConsultationApi } from "../../generated";
import { customConfiguration } from "../../libraries/apiUtils/configuration";
import { Param } from "./params";

const api = new HospitalizationConsultationApi(customConfiguration());

export const newHospitalizationConsultation = createAsyncThunk(
  "hospitalisationconsultation/CREATE_HOSPITALISATIONCONSULTATION",
  async (hospitalizationConsultationDTO: HospitalizationConsultationDTO, thunkApi) =>
    wrapper(() => api.createHospitalizationConsultation({ hospitalizationConsultationDTO }))
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const updateHospitalizationConsultation = createAsyncThunk(
  "hospitalisationconsultation/UPDATE_HOSPITALISATIONCONSULTATION",
  async ({ id, body }: Param, thunkApi) =>
    wrapper(() => api.updateHospitalizationConsultation({ id, hospitalizationConsultationDTO: body }))
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const deleteHospitalizationConsultation = createAsyncThunk(
  "hospitalisationconsultation/DELETE_HOSPITALISATIONCONSULTATION",
  async (id: number, thunkApi) =>
    wrapper(() => api.deleteHospitalizationConsultation({ id }))
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const getHospitalizationConsultation = createAsyncThunk(
  "hospitalisationconsultation/GET_HOSPITALISATIONCONSULTATION",
  async (id: number, thunkApi) =>
    wrapper(() => api.getHospitalizationConsultation({ id }))
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const getHospitalizationConsultations = createAsyncThunk(
  "hospitalisationconsultation/GET_ALL_HOSPITALISATIONCONSULTATIONS",
  async (_, thunkApi) =>
    wrapper(() => api.getHospitalizationConsultations())
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const getHospitalizationConsultationsByDateRange = createAsyncThunk(
  "hospitalisationconsultation/GET_HOSPITALISATIONCONSULTATIONS_BY_DATE_RANGE",
  async ({ dateFrom, dateTo }: { dateFrom: string; dateTo: string }, thunkApi) =>
    wrapper(() => api.getHospitalizationConsultationsByDateRange({ dateFrom, dateTo }))
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const getHospitalizationConsultationsByDateRangePageable = createAsyncThunk(
  "hospitalisationconsultation/GET_HOSPITALISATIONCONSULTATIONS_BY_DATE_RANGE_PAGEABLE",
  async ({ dateFrom, dateTo, page, size }: { dateFrom: string; dateTo: string; page: number; size: number }, thunkApi) =>
    wrapper(() => api.getHospitalizationConsultationsByDateRangePageable({ dateFrom, dateTo, page, size }))
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const getHospitalizationConsultationsByEncounter = createAsyncThunk(
  "hospitalisationconsultation/GET_HOSPITALISATIONCONSULTATIONS_BY_ENCOUNTER",
  async (encounterCode: string, thunkApi) =>
    wrapper(() => api.getHospitalizationConsultationsByEncounter({ encounterCode }))
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const getHospitalizationConsultationsByEncounterPageable = createAsyncThunk(
  "hospitalisationconsultation/GET_HOSPITALISATIONCONSULTATIONS_BY_ENCOUNTER_PAGEABLE",
  async ({ encounterCode, page, size }: { encounterCode: string; page: number; size: number }, thunkApi) =>
    wrapper(() => api.getHospitalizationConsultationsByEncounterPageable({ encounterCode, page, size }))
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);

export const getHospitalizationConsultationsPageable = createAsyncThunk(
  "hospitalisationconsultation/GET_HOSPITALISATIONCONSULTATIONS_PAGEABLE",
  async ({ page, size }: { page: number; size: number }, thunkApi) =>
    wrapper(() => api.getHospitalizationConsultationsPageable({ page, size }))
      .toPromise()
      .catch((error) => thunkApi.rejectWithValue(error.response))
);
