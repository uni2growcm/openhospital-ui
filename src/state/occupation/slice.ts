import { createSlice } from "@reduxjs/toolkit";
import { isEmpty } from "lodash";
import { ApiResponse } from "state/types";
import { initial } from "./initial";
import * as thunks from "./thunk";

export const occupationSlice = createSlice({
  name: "occupations",
  initialState: initial,
  reducers: {
    createOccupationReset: (state) => {
      state.create = initial.create;
    },
    updateOccupationReset: (state) => {
      state.update = initial.update;
    },
    deleteOccupationReset: (state) => {
      state.delete = initial.delete;
    },
    getOccupationByIdReset: (state) => {
      state.getById = initial.getById;
    },
  },
  extraReducers: (builder) =>
    builder
      // Get Occupations
      .addCase(thunks.getOccupations.pending, (state) => {
        state.occupationList = ApiResponse.loading();
      })
      .addCase(thunks.getOccupations.fulfilled, (state, action) => {
        state.occupationList = isEmpty(action.payload)
          ? ApiResponse.empty()
          : ApiResponse.value(action.payload);
      })
      .addCase(thunks.getOccupations.rejected, (state, action) => {
        state.occupationList = ApiResponse.error(action.payload);
      })
      // Get Occupation by id
      .addCase(thunks.getOccupationById.pending, (state) => {
        state.getById = ApiResponse.loading();
      })
      .addCase(thunks.getOccupationById.fulfilled, (state, action) => {
        state.getById = ApiResponse.value(action.payload);
      })
      .addCase(thunks.getOccupationById.rejected, (state, action) => {
        state.getById = ApiResponse.error(action.payload);
      })
      // Create Occupation
      .addCase(thunks.createOccupation.pending, (state) => {
        state.create = ApiResponse.loading();
      })
      .addCase(thunks.createOccupation.fulfilled, (state, action) => {
        state.create = ApiResponse.value(action.payload);
      })
      .addCase(thunks.createOccupation.rejected, (state, action) => {
        state.create = ApiResponse.error(action.payload);
      })
      // Update Occupation
      .addCase(thunks.updateOccupation.pending, (state) => {
        state.update = ApiResponse.loading();
      })
      .addCase(thunks.updateOccupation.fulfilled, (state, action) => {
        state.update = ApiResponse.value(action.payload);
      })
      .addCase(thunks.updateOccupation.rejected, (state, action) => {
        state.update = ApiResponse.error(action.payload);
      })
      // Delete Occupation
      .addCase(thunks.deleteOccupation.pending, (state) => {
        state.delete = ApiResponse.loading();
      })
      .addCase(thunks.deleteOccupation.fulfilled, (state, action) => {
        state.delete.status = "SUCCESS";
      })
      .addCase(thunks.deleteOccupation.rejected, (state, action) => {
        state.delete = ApiResponse.error(action.payload);
      }),
});

export const {
  createOccupationReset,
  updateOccupationReset,
  deleteOccupationReset,
  getOccupationByIdReset,
} = occupationSlice.actions;
