import { createSlice } from "@reduxjs/toolkit";
import { isEmpty } from "lodash";
import { ApiResponse } from "state/types";
import { initial } from "./initial";
import * as thunk from "./thunk";

export const conditioningSlice = createSlice({
  name: "conditionings",
  initialState: initial,
  reducers: {
    newConditioningReset: (state) => {
      state.newConditioning = initial.newConditioning;
    },
    updateConditioningReset: (state) => {
      state.updateConditioning = initial.updateConditioning;
    },
    getConditioningsByPatientCodeReset: (state) => {
      state.getConditioningByPatientCode = initial.getConditioningByPatientCode;
    },
    getLastConditioningByPatientCodeReset: (state) => {
      state.getLastConditioningByPatientCode =
        initial.getLastConditioningByPatientCode;
    },
  },
  extraReducers: (builder) =>
    builder

      //Create conditioning
      .addCase(thunk.newConditioning.pending, (state) => {
        state.newConditioning = ApiResponse.loading();
      })
      .addCase(thunk.newConditioning.fulfilled, (state, action) => {
        state.newConditioning = ApiResponse.value(action.payload);
      })
      .addCase(thunk.newConditioning.rejected, (state, action) => {
        state.newConditioning = ApiResponse.error(action.payload);
      })
      // Update Conditioning
      .addCase(thunk.updateConditioning.pending, (state) => {
        state.updateConditioning = ApiResponse.loading();
      })
      .addCase(thunk.updateConditioning.fulfilled, (state, action) => {
        state.updateConditioning = ApiResponse.value(action.payload);
      })
      .addCase(thunk.updateConditioning.rejected, (state, action) => {
        state.updateConditioning = ApiResponse.error(action.payload);
      })
      //Get last conditioning by patient code
      .addCase(thunk.getLastConditioningByPatientCode.pending, (state) => {
        state.getLastConditioningByPatientCode = ApiResponse.loading();
      })
      .addCase(
        thunk.getLastConditioningByPatientCode.fulfilled,
        (state, action) => {
          state.getLastConditioningByPatientCode = ApiResponse.value(
            action.payload
          );
        }
      )
      .addCase(
        thunk.getLastConditioningByPatientCode.rejected,
        (state, action) => {
          state.getLastConditioningByPatientCode = ApiResponse.error(
            action.payload
          );
        }
      )
      //Get conditionings by patient code
      .addCase(thunk.getConditioningByPatientCode.pending, (state) => {
        state.getConditioningByPatientCode = ApiResponse.loading();
      })
      .addCase(
        thunk.getConditioningByPatientCode.fulfilled,
        (state, action) => {
          state.getConditioningByPatientCode = isEmpty(action.payload)
            ? ApiResponse.empty()
            : ApiResponse.value(action.payload);
        }
      )
      .addCase(thunk.getConditioningByPatientCode.rejected, (state, action) => {
        state.getConditioningByPatientCode = ApiResponse.error(action.payload);
      }),
});

export const {
  newConditioningReset,
  updateConditioningReset,
  getConditioningsByPatientCodeReset,
  getLastConditioningByPatientCodeReset,
} = conditioningSlice.actions;
