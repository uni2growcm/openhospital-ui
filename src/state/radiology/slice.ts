import { createSlice } from "@reduxjs/toolkit";
import { ApiResponse } from "state/types";
import { initial } from "./initial";
import * as thunks from "./thunk";

export const radiologySlice = createSlice({
  name: "radiology",
  initialState: initial,
  reducers: {
    getPatientStudiesReset: (state) => {
      state.studies = initial.studies;
    },
    getStudySeriesReset: (state) => {
      state.series = initial.series;
    },
    getSerieInstancesReset: (state) => {
      state.instances = initial.instances;
    },
    getInstancePreviewReset: (state) => {
      state.preview = initial.preview;
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
      })
      // Get Instance Preview
      .addCase(thunks.getInstancePreview.pending, (state) => {
        state.preview = ApiResponse.loading();
      })
      .addCase(thunks.getInstancePreview.fulfilled, (state, action) => {
        state.preview = ApiResponse.value(action.payload);
      })
      .addCase(thunks.getInstancePreview.rejected, (state, action) => {
        state.preview = ApiResponse.error(action.payload);
      }),
});

export const {
  getPatientStudiesReset,
  getStudySeriesReset,
  getSerieInstancesReset,
  getInstancePreviewReset,
} = radiologySlice.actions;
