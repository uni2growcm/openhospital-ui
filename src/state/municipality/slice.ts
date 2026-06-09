import { createSlice } from "@reduxjs/toolkit";
import { isEmpty } from "lodash";
import { ApiResponse } from "state/types";
import { initial } from "./initial";
import * as thunks from "./thunk";

export const municipalitySlice = createSlice({
  name: "municipalities",
  initialState: initial,
  reducers: {
    createMunicipalityReset: (state) => {
      state.createMunicipality = initial.createMunicipality;
    },
    updateMunicipalityReset: (state) => {
      state.updateMunicipality = initial.updateMunicipality;
    },
    deleteMunicipalityReset: (state) => {
      state.deleteMunicipality = initial.deleteMunicipality;
    },
    getMunicipalityByIdReset: (state) => {
      state.getMunicipalityById = initial.getMunicipalityById;
    },
  },
  extraReducers: (builder) =>
    builder
      // Get Municipalities
      .addCase(thunks.getMunicipalities.pending, (state) => {
        state.getMunicipalities = ApiResponse.loading();
      })
      .addCase(thunks.getMunicipalities.fulfilled, (state, action) => {
        state.getMunicipalities = isEmpty(action.payload)
          ? ApiResponse.empty()
          : ApiResponse.value(action.payload);
      })
      .addCase(thunks.getMunicipalities.rejected, (state, action) => {
        state.getMunicipalities = ApiResponse.error(action.payload);
      })
      // Get Municipality by id
      .addCase(thunks.getMunicipalityById.pending, (state) => {
        state.getMunicipalityById = ApiResponse.loading();
      })
      .addCase(thunks.getMunicipalityById.fulfilled, (state, action) => {
        state.getMunicipalityById = ApiResponse.value(action.payload);
      })
      .addCase(thunks.getMunicipalityById.rejected, (state, action) => {
        state.getMunicipalityById = ApiResponse.error(action.payload);
      })
      // Create Municipality
      .addCase(thunks.createMunicipality.pending, (state) => {
        state.createMunicipality = ApiResponse.loading();
      })
      .addCase(thunks.createMunicipality.fulfilled, (state, action) => {
        state.createMunicipality = ApiResponse.value(action.payload);
      })
      .addCase(thunks.createMunicipality.rejected, (state, action) => {
        state.createMunicipality = ApiResponse.error(action.payload);
      })
      // Update Municipality
      .addCase(thunks.updateMunicipality.pending, (state) => {
        state.updateMunicipality = ApiResponse.loading();
      })
      .addCase(thunks.updateMunicipality.fulfilled, (state, action) => {
        state.updateMunicipality = ApiResponse.value(action.payload);
      })
      .addCase(thunks.updateMunicipality.rejected, (state, action) => {
        state.updateMunicipality = ApiResponse.error(action.payload);
      })
      // Delete Municipality
      .addCase(thunks.deleteMunicipality.pending, (state) => {
        state.deleteMunicipality = ApiResponse.loading();
      })
      .addCase(thunks.deleteMunicipality.fulfilled, (state, action) => {
        state.deleteMunicipality.status = "SUCCESS";
      })
      .addCase(thunks.deleteMunicipality.rejected, (state, action) => {
        state.deleteMunicipality = ApiResponse.error(action.payload);
      }),
});

export const {
  createMunicipalityReset: createMunicipalityReset,
  updateMunicipalityReset: updateMunicipalityReset,
  deleteMunicipalityReset: deleteMunicipalityReset,
  getMunicipalityByIdReset: getMunicipalityByIdReset,
} = municipalitySlice.actions;
