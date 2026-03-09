import { createSlice } from "@reduxjs/toolkit";
import { isEmpty } from "lodash";
import { ApiResponse } from "state/types";
import { initial } from "./initial";
import * as thunks from "./thunk";

export const communeSlice = createSlice({
  name: "communes",
  initialState: initial,
  reducers: {
    createCommuneReset: (state) => {
      state.create = initial.create;
    },
    updateCommuneReset: (state) => {
      state.update = initial.update;
    },
    deleteCommuneReset: (state) => {
      state.delete = initial.delete;
    },
    getCommuneByIdReset: (state) => {
      state.getById = initial.getById;
    },
  },
  extraReducers: (builder) =>
    builder
      // Get Communes
      .addCase(thunks.getCommunes.pending, (state) => {
        state.communeList = ApiResponse.loading();
      })
      .addCase(thunks.getCommunes.fulfilled, (state, action) => {
        state.communeList = isEmpty(action.payload)
          ? ApiResponse.empty()
          : ApiResponse.value(action.payload);
      })
      .addCase(thunks.getCommunes.rejected, (state, action) => {
        state.communeList = ApiResponse.error(action.payload);
      })
      // Get Commune by id
      .addCase(thunks.getCommuneById.pending, (state) => {
        state.getById = ApiResponse.loading();
      })
      .addCase(thunks.getCommuneById.fulfilled, (state, action) => {
        state.getById = ApiResponse.value(action.payload);
      })
      .addCase(thunks.getCommuneById.rejected, (state, action) => {
        state.getById = ApiResponse.error(action.payload);
      })
      // Create Commune
      .addCase(thunks.createCommune.pending, (state) => {
        state.create = ApiResponse.loading();
      })
      .addCase(thunks.createCommune.fulfilled, (state, action) => {
        state.create = ApiResponse.value(action.payload);
      })
      .addCase(thunks.createCommune.rejected, (state, action) => {
        state.create = ApiResponse.error(action.payload);
      })
      // Update Commune
      .addCase(thunks.updateCommune.pending, (state) => {
        state.update = ApiResponse.loading();
      })
      .addCase(thunks.updateCommune.fulfilled, (state, action) => {
        state.update = ApiResponse.value(action.payload);
      })
      .addCase(thunks.updateCommune.rejected, (state, action) => {
        state.update = ApiResponse.error(action.payload);
      })
      // Delete Commune
      .addCase(thunks.deleteCommune.pending, (state) => {
        state.delete = ApiResponse.loading();
      })
      .addCase(thunks.deleteCommune.fulfilled, (state, action) => {
        state.delete.status = "SUCCESS";
      })
      .addCase(thunks.deleteCommune.rejected, (state, action) => {
        state.delete = ApiResponse.error(action.payload);
      }),
});

export const {
  createCommuneReset,
  updateCommuneReset,
  deleteCommuneReset,
  getCommuneByIdReset,
} = communeSlice.actions;
