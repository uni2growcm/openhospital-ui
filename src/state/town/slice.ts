import { createSlice } from "@reduxjs/toolkit";
import { isEmpty } from "lodash";
import { ApiResponse } from "state/types";
import { initial } from "./initial";
import * as thunks from "./thunk";

export const townSlice = createSlice({
  name: "towns",
  initialState: initial,
  reducers: {
    createTownReset: (state) => {
      state.create = initial.create;
    },
    updateTownReset: (state) => {
      state.update = initial.update;
    },
    deleteTownReset: (state) => {
      state.delete = initial.delete;
    },
    getTownByIdReset: (state) => {
      state.getById = initial.getById;
    },
  },
  extraReducers: (builder) =>
    builder
      // Get Towns
      .addCase(thunks.getTowns.pending, (state) => {
        state.townList = ApiResponse.loading();
      })
      .addCase(thunks.getTowns.fulfilled, (state, action) => {
        state.townList = isEmpty(action.payload)
          ? ApiResponse.empty()
          : ApiResponse.value(action.payload);
      })
      .addCase(thunks.getTowns.rejected, (state, action) => {
        state.townList = ApiResponse.error(action.payload);
      })
      // Get Town by id
      .addCase(thunks.getTownById.pending, (state) => {
        state.getById = ApiResponse.loading();
      })
      .addCase(thunks.getTownById.fulfilled, (state, action) => {
        state.getById = ApiResponse.value(action.payload);
      })
      .addCase(thunks.getTownById.rejected, (state, action) => {
        state.getById = ApiResponse.error(action.payload);
      })
      // Create Town
      .addCase(thunks.createTown.pending, (state) => {
        state.create = ApiResponse.loading();
      })
      .addCase(thunks.createTown.fulfilled, (state, action) => {
        state.create = ApiResponse.value(action.payload);
      })
      .addCase(thunks.createTown.rejected, (state, action) => {
        state.create = ApiResponse.error(action.payload);
      })
      // Update Town
      .addCase(thunks.updateTown.pending, (state) => {
        state.update = ApiResponse.loading();
      })
      .addCase(thunks.updateTown.fulfilled, (state, action) => {
        state.update = ApiResponse.value(action.payload);
      })
      .addCase(thunks.updateTown.rejected, (state, action) => {
        state.update = ApiResponse.error(action.payload);
      })
      // Delete Town
      .addCase(thunks.deleteTown.pending, (state) => {
        state.delete = ApiResponse.loading();
      })
      .addCase(thunks.deleteTown.fulfilled, (state, action) => {
        state.delete.status = "SUCCESS";
      })
      .addCase(thunks.deleteTown.rejected, (state, action) => {
        state.delete = ApiResponse.error(action.payload);
      }),
});

export const {
  createTownReset,
  updateTownReset,
  deleteTownReset,
  getTownByIdReset,
} = townSlice.actions;