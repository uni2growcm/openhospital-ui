import { createSlice } from "@reduxjs/toolkit";
import { isEmpty } from "lodash";
import { ApiResponse } from "state/types";
import { initial } from "./initial";
import * as thunks from "./thunk";

export const hospitalisationconsultationSlice = createSlice({
  name: "hospitalisationconsultations",
  initialState: initial,
  reducers: {
    newHospitalizationConsultationReset: (state) => {
      state.newHospitalizationConsultation = initial.newHospitalizationConsultation;
    },
    updateHospitalizationConsultationReset: (state) => {
      state.updateHospitalizationConsultation = initial.updateHospitalizationConsultation;
    },
    deleteHospitalizationConsultationReset: (state) => {
      state.deleteHospitalizationConsultation = initial.deleteHospitalizationConsultation;
    },
    getHospitalizationConsultationReset: (state) => {
      state.getHospitalizationConsultation = initial.getHospitalizationConsultation;
    },
    getHospitalizationConsultationsReset: (state) => {
      state.getHospitalizationConsultations = initial.getHospitalizationConsultations;
    },
    getHospitalizationConsultationsByDateRangeReset: (state) => {
      state.getHospitalizationConsultationsByDateRange = initial.getHospitalizationConsultationsByDateRange;
    },
    getHospitalizationConsultationsByDateRangePageableReset: (state) => {
      state.getHospitalizationConsultationsByDateRangePageable = initial.getHospitalizationConsultationsByDateRangePageable;
    },
    getHospitalizationConsultationsByEncounterReset: (state) => {
      state.getHospitalizationConsultationsByEncounter = initial.getHospitalizationConsultationsByEncounter;
    },
    getHospitalizationConsultationsByEncounterPageableReset: (state) => {
      state.getHospitalizationConsultationsByEncounterPageable = initial.getHospitalizationConsultationsByEncounterPageable;
    },
    getHospitalizationConsultationsPageableReset: (state) => {
      state.getHospitalizationConsultationsPageable = initial.getHospitalizationConsultationsPageable;
    },
  },
  extraReducers: (builder) =>
    builder

      .addCase(thunks.newHospitalizationConsultation.pending, (state) => {
        state.newHospitalizationConsultation = ApiResponse.loading();
      })
      .addCase(thunks.newHospitalizationConsultation.fulfilled, (state, action) => {
        state.newHospitalizationConsultation = ApiResponse.value(action.payload);
      })
      .addCase(thunks.newHospitalizationConsultation.rejected, (state, action) => {
        state.newHospitalizationConsultation = ApiResponse.error(action.payload);
      })
      .addCase(thunks.updateHospitalizationConsultation.pending, (state) => {
        state.updateHospitalizationConsultation = ApiResponse.loading();
      })
      .addCase(thunks.updateHospitalizationConsultation.fulfilled, (state, action) => {
        state.updateHospitalizationConsultation = ApiResponse.value(action.payload);
      })
      .addCase(thunks.updateHospitalizationConsultation.rejected, (state, action) => {
        state.updateHospitalizationConsultation = ApiResponse.error(action.payload);
      })
      .addCase(thunks.deleteHospitalizationConsultation.pending, (state) => {
        state.deleteHospitalizationConsultation = ApiResponse.loading();
      })
      .addCase(thunks.deleteHospitalizationConsultation.fulfilled, (state, action) => {
        state.deleteHospitalizationConsultation = ApiResponse.value(action.payload);
      })
      .addCase(thunks.deleteHospitalizationConsultation.rejected, (state, action) => {
        state.deleteHospitalizationConsultation = ApiResponse.error(action.payload);
      })
      .addCase(thunks.getHospitalizationConsultation.pending, (state) => {
        state.getHospitalizationConsultation = ApiResponse.loading();
      })
      .addCase(thunks.getHospitalizationConsultation.fulfilled, (state, action) => {
        state.getHospitalizationConsultation = isEmpty(action.payload)
          ? ApiResponse.idle()
          : ApiResponse.value(action.payload);
      })
      .addCase(thunks.getHospitalizationConsultation.rejected, (state, action) => {
        state.getHospitalizationConsultation = ApiResponse.error(action.payload);
      })
      .addCase(thunks.getHospitalizationConsultations.pending, (state) => {
        state.getHospitalizationConsultations = ApiResponse.loading();
      })
      .addCase(thunks.getHospitalizationConsultations.fulfilled, (state, action) => {
        state.getHospitalizationConsultations = isEmpty(action.payload)
          ? ApiResponse.empty()
          : ApiResponse.value(action.payload);
      })
      .addCase(thunks.getHospitalizationConsultations.rejected, (state, action) => {
        state.getHospitalizationConsultations = ApiResponse.error(action.payload);
      })
      .addCase(thunks.getHospitalizationConsultationsByDateRange.pending, (state) => {
        state.getHospitalizationConsultationsByDateRange = ApiResponse.loading();
      })
      .addCase(thunks.getHospitalizationConsultationsByDateRange.fulfilled, (state, action) => {
        state.getHospitalizationConsultationsByDateRange = isEmpty(action.payload)
          ? ApiResponse.empty()
          : ApiResponse.value(action.payload);
      })
      .addCase(thunks.getHospitalizationConsultationsByDateRange.rejected, (state, action) => {
        state.getHospitalizationConsultationsByDateRange = ApiResponse.error(action.payload);
      })
      .addCase(thunks.getHospitalizationConsultationsByDateRangePageable.pending, (state) => {
        state.getHospitalizationConsultationsByDateRangePageable = ApiResponse.loading();
      })
      .addCase(thunks.getHospitalizationConsultationsByDateRangePageable.fulfilled, (state, action) => {
        state.getHospitalizationConsultationsByDateRangePageable = isEmpty(action.payload)
          ? ApiResponse.value({ data: [], pageInfo: { totalElements: 0, totalPages: 0, size: 0, number: 0 } })
          : ApiResponse.value(action.payload);
      })
      .addCase(thunks.getHospitalizationConsultationsByDateRangePageable.rejected, (state, action) => {
        state.getHospitalizationConsultationsByDateRangePageable = ApiResponse.error(action.payload);
      })
      .addCase(thunks.getHospitalizationConsultationsByEncounter.pending, (state) => {
        state.getHospitalizationConsultationsByEncounter = ApiResponse.loading();
      })
      .addCase(thunks.getHospitalizationConsultationsByEncounter.fulfilled, (state, action) => {
        state.getHospitalizationConsultationsByEncounter = isEmpty(action.payload)
          ? ApiResponse.empty()
          : ApiResponse.value(action.payload);
      })
      .addCase(thunks.getHospitalizationConsultationsByEncounter.rejected, (state, action) => {
        state.getHospitalizationConsultationsByEncounter = ApiResponse.error(action.payload);
      })
      .addCase(thunks.getHospitalizationConsultationsByEncounterPageable.pending, (state) => {
        state.getHospitalizationConsultationsByEncounterPageable = ApiResponse.loading();
      })
      .addCase(thunks.getHospitalizationConsultationsByEncounterPageable.fulfilled, (state, action) => {
        state.getHospitalizationConsultationsByEncounterPageable = isEmpty(action.payload)
          ? ApiResponse.value({ data: [], pageInfo: { totalElements: 0, totalPages: 0, size: 0, number: 0 } })
          : ApiResponse.value(action.payload);
      })
      .addCase(thunks.getHospitalizationConsultationsByEncounterPageable.rejected, (state, action) => {
        state.getHospitalizationConsultationsByEncounterPageable = ApiResponse.error(action.payload);
      })
      .addCase(thunks.getHospitalizationConsultationsPageable.pending, (state) => {
        state.getHospitalizationConsultationsPageable = ApiResponse.loading();
      })
      .addCase(thunks.getHospitalizationConsultationsPageable.fulfilled, (state, action) => {
        state.getHospitalizationConsultationsPageable = isEmpty(action.payload)
          ? ApiResponse.value({ data: [], pageInfo: { totalElements: 0, totalPages: 0, size: 0, number: 0 } })
          : ApiResponse.value(action.payload);
      })
      .addCase(thunks.getHospitalizationConsultationsPageable.rejected, (state, action) => {
        state.getHospitalizationConsultationsPageable = ApiResponse.error(action.payload);
      }),
});

export const { 
  newHospitalizationConsultationReset, 
  updateHospitalizationConsultationReset,
  deleteHospitalizationConsultationReset,
  getHospitalizationConsultationReset,
  getHospitalizationConsultationsReset,
  getHospitalizationConsultationsByDateRangeReset,
  getHospitalizationConsultationsByDateRangePageableReset,
  getHospitalizationConsultationsByEncounterReset,
  getHospitalizationConsultationsByEncounterPageableReset,
  getHospitalizationConsultationsPageableReset,
} = hospitalisationconsultationSlice.actions;
