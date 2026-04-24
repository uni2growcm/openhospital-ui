import { createSlice } from "@reduxjs/toolkit";
import { isEmpty } from "lodash";
import { ApiResponse } from "state/types";
import { initial } from "./initial";
import * as thunks from "./thunk";

export const careSlice = createSlice({
  name: "cares",
  initialState: initial,
  reducers: {
    newCareReset: (state) => {
      state.newCare = initial.newCare;
    },
    updateCareReset: (state) => {
      state.updateCare = initial.updateCare;
    },
    getCaresByPatientCodeReset: (state) => {
      state.getCareByPatientCode = initial.getCareByPatientCode;
    },
  },
  extraReducers: (builder) =>
    builder

      .addCase(thunks.newCare.pending, (state) => {
        state.newCare = ApiResponse.loading();
      })
      .addCase(thunks.newCare.fulfilled, (state, action) => {
        state.newCare = ApiResponse.value(action.payload);
      })
      .addCase(thunks.newCare.rejected, (state, action) => {
        state.newCare = ApiResponse.error(action.payload);
      })
      .addCase(thunks.updateCare.pending, (state) => {
        state.updateCare = ApiResponse.loading();
      })
      .addCase(thunks.updateCare.fulfilled, (state, action) => {
        state.updateCare = ApiResponse.value(action.payload);
      })
      .addCase(thunks.updateCare.rejected, (state, action) => {
        state.updateCare = ApiResponse.error(action.payload);
      })
      .addCase(thunks.getCareByPatientCode.pending, (state) => {
        state.getCareByPatientCode = ApiResponse.loading();
      })
      .addCase(thunks.getCareByPatientCode.fulfilled, (state, action) => {
        state.getCareByPatientCode = isEmpty(action.payload)
          ? ApiResponse.empty()
          : ApiResponse.value(action.payload);
      })
      .addCase(thunks.getCareByPatientCode.rejected, (state, action) => {
        state.getCareByPatientCode = ApiResponse.error(action.payload);
      }),
});

export const { newCareReset, updateCareReset, getCaresByPatientCodeReset } =
  careSlice.actions;
