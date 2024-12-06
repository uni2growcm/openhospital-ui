import { createSlice } from "@reduxjs/toolkit";
import { ApiResponse } from "state/types";
import { initial } from "./initial";
import * as thunks from "./thunk";

export const radiologySlice = createSlice({
  name: "radiology",
  initialState: initial,
  reducers: {
    getStudiesReset: (state) => {
      state.studies = initial.studies;
    },
    getSeriesReset: (state) => {
      state.series = initial.series;
    },
    getInstancesReset: (state) => {
      state.instances = initial.instances;
    },
  },
  extraReducers: (builder) =>
    builder
      // Get Patient Studies
      .addCase(thunks.getPatientStudies.pending, (state) => {
        state.studies = ApiResponse.loading();
      })
      .addCase(thunks.getPatientStudies.fulfilled, (state, action) => {
        state.studies = ApiResponse.value(action.payload);
      })
      .addCase(thunks.getPatientStudies.rejected, (state, action) => {
        state.studies = ApiResponse.error(action.payload);
      })
      // Get Study Series
      .addCase(thunks.getStudySeries.pending, (state) => {
        state.series = ApiResponse.loading();
      })
      .addCase(thunks.getStudySeries.fulfilled, (state, action) => {
        state.series = ApiResponse.value(action.payload);
      })
      .addCase(thunks.getStudySeries.rejected, (state, action) => {
        state.series = ApiResponse.error(action.payload);
      })
      // Get Serie Instances
      .addCase(thunks.getSerieInstances.pending, (state) => {
        state.instances = ApiResponse.loading();
      })
      .addCase(thunks.getSerieInstances.fulfilled, (state, action) => {
        state.instances = ApiResponse.value(action.payload);
      })
      .addCase(thunks.getSerieInstances.rejected, (state, action) => {
        state.instances = ApiResponse.error(action.payload);
      }),
});

export const { getStudiesReset, getSeriesReset, getInstancesReset } =
  radiologySlice.actions;
