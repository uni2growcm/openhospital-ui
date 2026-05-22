import { createSlice } from "@reduxjs/toolkit";
import { ApiResponse } from "state/types";
import { initial } from "./initial";
import * as thunks from "./thunk";

export const statisticsSlice = createSlice({
  name: "statistics",
  initialState: initial,
  reducers: {
    printAdmissionReportReset: (state) => {
      state.printAdmissionReport = initial.printAdmissionReport;
    },
    printDeathReportReset: (state) => {
      state.printDeathReport = initial.printDeathReport;
    },
    printDischargeReportReset: (state) => {
      state.printDischargeReport = initial.printDischargeReport;
    },
    printPathologiesReportReset: (state) => {
      state.printPathologiesReport = initial.printPathologiesReport;
    },
    printPathologyByAgeGenderReportReset: (state) => {
      state.printPathologyByAgeGenderReport =
        initial.printPathologyByAgeGenderReport;
    },
  },
  extraReducers: (builder) =>
    builder
      // Print Admission Report
      .addCase(thunks.printAdmissionReport.pending, (state) => {
        state.printAdmissionReport = ApiResponse.loading();
      })
      .addCase(thunks.printAdmissionReport.fulfilled, (state, action) => {
        if (action.payload instanceof Blob) {
          state.printAdmissionReport = ApiResponse.value(action.payload);
        } else {
          state.printAdmissionReport = ApiResponse.error(action.payload);
        }
      })
      .addCase(thunks.printAdmissionReport.rejected, (state, action) => {
        state.printAdmissionReport = ApiResponse.error(action.payload);
      })
      // Print Discharges Report
      .addCase(thunks.printDischargesReport.pending, (state) => {
        state.printDischargeReport = ApiResponse.loading();
      })
      .addCase(thunks.printDischargesReport.fulfilled, (state, action) => {
        if (action.payload instanceof Blob) {
          state.printDischargeReport = ApiResponse.value(action.payload);
        } else {
          state.printDischargeReport = ApiResponse.error(action.payload);
        }
      })
      .addCase(thunks.printDischargesReport.rejected, (state, action) => {
        state.printDischargeReport = ApiResponse.error(action.payload);
      })
      // Print Pathologies By Age Gender Report
      .addCase(thunks.printPathologiesByAgeGenderReport.pending, (state) => {
        state.printPathologyByAgeGenderReport = ApiResponse.loading();
      })
      .addCase(
        thunks.printPathologiesByAgeGenderReport.fulfilled,
        (state, action) => {
          if (action.payload instanceof Blob) {
            state.printPathologyByAgeGenderReport = ApiResponse.value(
              action.payload
            );
          } else {
            state.printPathologyByAgeGenderReport = ApiResponse.error(
              action.payload
            );
          }
        }
      )
      .addCase(
        thunks.printPathologiesByAgeGenderReport.rejected,
        (state, action) => {
          state.printPathologyByAgeGenderReport = ApiResponse.error(
            action.payload
          );
        }
      )
      // Print Pathologies Report
      .addCase(thunks.printPathologiesReport.pending, (state) => {
        state.printPathologiesReport = ApiResponse.loading();
      })
      .addCase(thunks.printPathologiesReport.fulfilled, (state, action) => {
        if (action.payload instanceof Blob) {
          state.printPathologiesReport = ApiResponse.value(action.payload);
        } else {
          state.printPathologiesReport = ApiResponse.error(action.payload);
        }
      })
      .addCase(thunks.printPathologiesReport.rejected, (state, action) => {
        state.printPathologiesReport = ApiResponse.error(action.payload);
      })
      // Print Death Report
      .addCase(thunks.printDeathReport.pending, (state) => {
        state.printDeathReport = ApiResponse.loading();
      })
      .addCase(thunks.printDeathReport.fulfilled, (state, action) => {
        if (action.payload instanceof Blob) {
          state.printDeathReport = ApiResponse.value(action.payload);
        } else {
          state.printDeathReport = ApiResponse.error(action.payload);
        }
      })
      .addCase(thunks.printDeathReport.rejected, (state, action) => {
        state.printDeathReport = ApiResponse.error(action.payload);
      }),
});

export const {
  printAdmissionReportReset,
  printDeathReportReset,
  printDischargeReportReset,
  printPathologiesReportReset,
  printPathologyByAgeGenderReportReset,
} = statisticsSlice.actions;

export default statisticsSlice.reducer;
