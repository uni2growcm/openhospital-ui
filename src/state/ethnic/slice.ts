import { createSlice } from "@reduxjs/toolkit";
import { isEmpty } from "lodash";
import { ApiResponse } from "state/types";
import { initial } from "./initial";
import * as thunks from "./thunk";

export const ethnicSlice = createSlice({
  name: "ethnics",
  initialState: initial,
  reducers: {
    createEthnicReset: (state) => {
      state.create = initial.create;
    },
    updateEthnicReset: (state) => {
      state.update = initial.update;
    },
    deleteEthnicReset: (state) => {
      state.delete = initial.delete;
    },
    getEthnicByIdReset: (state) => {
      state.getById = initial.getById;
    },
  },
  extraReducers: (builder) =>
    builder
      // Get Ethnics
      .addCase(thunks.getEthnics.pending, (state) => {
        state.ethnicList = ApiResponse.loading();
      })
      .addCase(thunks.getEthnics.fulfilled, (state, action) => {
        state.ethnicList = isEmpty(action.payload)
          ? ApiResponse.empty()
          : ApiResponse.value(action.payload);
      })
      .addCase(thunks.getEthnics.rejected, (state, action) => {
        state.ethnicList = ApiResponse.error(action.payload);
      })
      // Get Ethnic by id
      .addCase(thunks.getEthnicById.pending, (state) => {
        state.getById = ApiResponse.loading();
      })
      .addCase(thunks.getEthnicById.fulfilled, (state, action) => {
        state.getById = ApiResponse.value(action.payload);
      })
      .addCase(thunks.getEthnicById.rejected, (state, action) => {
        state.getById = ApiResponse.error(action.payload);
      })
      // Create Ethnic
      .addCase(thunks.createEthnic.pending, (state) => {
        state.create = ApiResponse.loading();
      })
      .addCase(thunks.createEthnic.fulfilled, (state, action) => {
        state.create = ApiResponse.value(action.payload);
      })
      .addCase(thunks.createEthnic.rejected, (state, action) => {
        state.create = ApiResponse.error(action.payload);
      })
      // Update Ethnic
      .addCase(thunks.updateEthnic.pending, (state) => {
        state.update = ApiResponse.loading();
      })
      .addCase(thunks.updateEthnic.fulfilled, (state, action) => {
        state.update = ApiResponse.value(action.payload);
      })
      .addCase(thunks.updateEthnic.rejected, (state, action) => {
        state.update = ApiResponse.error(action.payload);
      })
      // Delete Ethnic
      .addCase(thunks.deleteEthnic.pending, (state) => {
        state.delete = ApiResponse.loading();
      })
      .addCase(thunks.deleteEthnic.fulfilled, (state, action) => {
        state.delete.status = "SUCCESS";
      })
      .addCase(thunks.deleteEthnic.rejected, (state, action) => {
        state.delete = ApiResponse.error(action.payload);
      }),
});

export const {
  createEthnicReset,
  updateEthnicReset,
  deleteEthnicReset,
  getEthnicByIdReset,
} = ethnicSlice.actions;
