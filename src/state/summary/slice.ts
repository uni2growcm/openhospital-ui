import { createSlice } from "@reduxjs/toolkit";
import { initial, initialByEncounter } from "./initial";
import * as thunks from "./thunk";
import { ApiResponse } from "state/types";

export const summarySlice = createSlice({
  name: "symmary",
  initialState: initial,
  reducers: {},
  extraReducers: (builder) =>
    builder
      // Load Summary Data
      .addCase(thunks.loadSummaryData.pending, (state) => {
        state.summaryApisCall = ApiResponse.loading();
      })
      .addCase(thunks.loadSummaryData.fulfilled, (state, action) => {
        state.summaryApisCall = ApiResponse.value(action.payload);
      })
      .addCase(thunks.loadSummaryData.rejected, (state, action) => {
        state.summaryApisCall = ApiResponse.error(action.payload);
      }),
});

export const summaryByEncounterSlice = createSlice({
  name: "symmaryByEncounter",
  initialState: initialByEncounter,
  reducers: {},
  extraReducers: (builder) =>
    builder
      // Load Summary Data Grouped By Encounter
      .addCase(thunks.loadSummaryDataGroupedByEncounter.pending, (state) => {
        state.summaryApisCall = ApiResponse.loading();
      })
      .addCase(thunks.loadSummaryDataGroupedByEncounter.fulfilled, (state, action) => {
        state.summaryApisCall = ApiResponse.value(action.payload);
      })
      .addCase(thunks.loadSummaryDataGroupedByEncounter.rejected, (state, action) => {
        state.summaryApisCall = ApiResponse.error(action.payload);
      }),
});