import { createAsyncThunk } from "@reduxjs/toolkit";
import { wrapper } from "libraries/apiUtils/wrapper";
import { firstValueFrom } from "rxjs";
import {
  GetAdmissionReportPdfRequest,
  PrintDeathReportPdfRequest,
  PrintDischargesPdfRequest,
  PrintPathologiesByAgeGenderPdfRequest,
  PrintPathologiesPdfRequest,
  StatisticsApi,
} from "../../generated";
import { customConfiguration } from "../../libraries/apiUtils/configuration";

const api = new StatisticsApi(customConfiguration());

// Helper function to convert string dates to Date objects
const convertPayloadDates = (payload: any) => {
  return {
    ...payload,
    fromDate:
      typeof payload.fromDate === "string"
        ? new Date(payload.fromDate)
        : payload.fromDate,
    toDate:
      typeof payload.toDate === "string"
        ? new Date(payload.toDate)
        : payload.toDate,
  };
};

export const printAdmissionReport = createAsyncThunk(
  "statistics/PRINT_ADMISSION_REPORT",
  async (payload: GetAdmissionReportPdfRequest, thunkApi) =>
    firstValueFrom(
      wrapper(() => api.getAdmissionReportPdf(convertPayloadDates(payload)))
    ).catch((error) => thunkApi.rejectWithValue(error.response))
);

export const printDischargesReport = createAsyncThunk(
  "discharges/PRINT_DISCHARGES_REPORT",
  async (payload: PrintDischargesPdfRequest, thunkApi) =>
    firstValueFrom(
      wrapper(() => api.printDischargesPdf(convertPayloadDates(payload)))
    ).catch((error) => thunkApi.rejectWithValue(error.response))
);

export const printPathologiesByAgeGenderReport = createAsyncThunk(
  "pathologies/PRINT_PATHOLOGIES_BY_AGE_GENDER_REPORT",
  async (payload: PrintPathologiesByAgeGenderPdfRequest, thunkApi) =>
    firstValueFrom(
      wrapper(() =>
        api.printPathologiesByAgeGenderPdf(convertPayloadDates(payload))
      )
    ).catch((error) => thunkApi.rejectWithValue(error.response))
);

export const printPathologiesReport = createAsyncThunk(
  "pathologies/PRINT_PATHOLOGIES_REPORT",
  async (payload: PrintPathologiesPdfRequest, thunkApi) =>
    firstValueFrom(
      wrapper(() => api.printPathologiesPdf(convertPayloadDates(payload)))
    ).catch((error) => thunkApi.rejectWithValue(error.response))
);

export const printDeathReport = createAsyncThunk(
  "statistics/PRINT_DEATH_REPORT",
  async (payload: PrintDeathReportPdfRequest, thunkApi) =>
    firstValueFrom(
      wrapper(() => api.printDeathReportPdf(convertPayloadDates(payload)))
    ).catch((error) => thunkApi.rejectWithValue(error.response))
);
