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
      state.createCommune = initial.createCommune;
    },
    updateCommuneReset: (state) => {
      state.updateCommune = initial.updateCommune;
    },
    deleteCommuneReset: (state) => {
      state.deleteCommune = initial.deleteCommune;
    },
    getCommuneByIdReset: (state) => {
      state.getCommuneById = initial.getCommuneById;
    },
  },
  extraReducers: (builder) =>
    builder
      // Get Communes
      .addCase(thunks.getCommunes.pending, (state) => {
        state.getCommunes = ApiResponse.loading();
      })
      .addCase(thunks.getCommunes.fulfilled, (state, action) => {
        state.getCommunes = isEmpty(action.payload)
          ? ApiResponse.empty()
          : ApiResponse.value(action.payload);
      })
      .addCase(thunks.getCommunes.rejected, (state, action) => {
        state.getCommunes = ApiResponse.error(action.payload);
      })
      // Get Commune by id
      .addCase(thunks.getCommuneById.pending, (state) => {
        state.getCommuneById = ApiResponse.loading();
      })
      .addCase(thunks.getCommuneById.fulfilled, (state, action) => {
        state.getCommuneById = ApiResponse.value(action.payload);
      })
      .addCase(thunks.getCommuneById.rejected, (state, action) => {
        state.getCommuneById = ApiResponse.error(action.payload);
      })
      // Create Commune
      .addCase(thunks.createCommune.pending, (state) => {
        state.createCommune = ApiResponse.loading();
      })
      .addCase(thunks.createCommune.fulfilled, (state, action) => {
        state.createCommune = ApiResponse.value(action.payload);
      })
      .addCase(thunks.createCommune.rejected, (state, action) => {
        state.createCommune = ApiResponse.error(action.payload);
      })
      // Update Commune
      .addCase(thunks.updateCommune.pending, (state) => {
        state.updateCommune = ApiResponse.loading();
      })
      .addCase(thunks.updateCommune.fulfilled, (state, action) => {
        state.updateCommune = ApiResponse.value(action.payload);
      })
      .addCase(thunks.updateCommune.rejected, (state, action) => {
        state.updateCommune = ApiResponse.error(action.payload);
      })
      // Delete Commune
      .addCase(thunks.deleteCommune.pending, (state) => {
        state.deleteCommune = ApiResponse.loading();
      })
      .addCase(thunks.deleteCommune.fulfilled, (state, action) => {
        state.deleteCommune.status = "SUCCESS";
      })
      .addCase(thunks.deleteCommune.rejected, (state, action) => {
        state.deleteCommune = ApiResponse.error(action.payload);
      }),
});

export const {
  createCommuneReset,
  updateCommuneReset,
  deleteCommuneReset,
  getCommuneByIdReset,
} = communeSlice.actions;
