import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { isEmpty } from "lodash";
import { initial } from "./initial";
import * as thunks from "./thunk";
import { TWardStockFIlter } from "./types";
import { ApiResponse } from "../types";

export const pharmacySlice = createSlice({
  name: "pharmacy",
  initialState: initial,
  reducers: {
    createMovementReset: (state) => {
      state.createMovement = initial.createMovement;
    },
    updateMovementReset: (state) => {
      state.updateMovement = initial.updateMovement;
    },
    deleteMovementReset: (state) => {
      state.deleteMovement = initial.deleteMovement;
    },
    resetMovementTypes: (state) => {
      state.movementTypes = initial.movementTypes;
    },
    resetWardMovements: (state) => {
      state.wardMovements = initial.wardMovements;
    },
    resetWardMedicals: (state) => {
      state.wardMedicals = initial.wardMedicals;
    },
    updateWardStockFIilter: (
      state,
      action: PayloadAction<TWardStockFIlter>
    ) => {
      state.wardStock.filter = action.payload;
    },
    resetWardStockFilter: (state) => {
      state.wardStock.filter = initial.wardStock.filter;
    },
    resetChargeMovements: (state) => {
      state.chargeMovements = initial.chargeMovements;
    },
    resetDischargeMovements: (state) => {
      state.dischargeMovements = initial.dischargeMovements;
    },
    resetMedicals: (state) => {
      state.getMedicals = initial.getMedicals;
    },
    resetMedicalTypes: (state) => {
      state.getMedicalTypes = initial.getMedicalTypes;
    },
    resetGetMedical: (state) => {
      state.getMedical = initial.getMedical;
    },
    resetNewMedical: (state) => {
      state.newMedical = initial.newMedical;
    },
    resetUpdateMedical: (state) => {
      state.updateMedical = initial.updateMedical;
    },
    resetCreateWardMovement: (state) => {
      state.createWardMovement = initial.createWardMovement;
    },
    resetGetMedicalLots: (state) => {
      state.medicalLots = initial.medicalLots;
    },
    resetPrintPharmaceuticalStockWardPdf: (state) => {
      state.printPharmaceuticalStockWardPdf =
        initial.printPharmaceuticalStockWardPdf;
    },
    resetPrintPharmaceuticalStockPdf: (state) => {
      state.printPharmaceuticalStockPdf = initial.printPharmaceuticalStockPdf;
    },
    resetPrintPharmaceuticalStockCardPdf: (state) => {
      state.printPharmaceuticalStockCardPdf =
        initial.printPharmaceuticalStockCardPdf;
    },
    resetPrintPharmaceuticalAMCPdf: (state) => {
      state.printPharmaceuticalAMCPdf = initial.printPharmaceuticalAMCPdf;
    },
    resetPrintPharmaceuticalStockWardExcel: (state) => {
      state.printPharmaceuticalStockWardExcel =
        initial.printPharmaceuticalStockWardExcel;
    },
    resetPrintPharmaceuticalExpirationPdf: (state) => {
      state.printPharmaceuticalExpirationPdf =
        initial.printPharmaceuticalExpirationPdf;
    },
  },
  extraReducers: (builder) => {
    builder
      // get movement types list
      .addCase(thunks.getMovementTypes.pending, (state) => {
        state.movementTypes = ApiResponse.loading();
      })
      .addCase(thunks.getMovementTypes.fulfilled, (state, action) => {
        state.movementTypes = isEmpty(action.payload)
          ? ApiResponse.empty()
          : ApiResponse.value(action.payload);
      })
      .addCase(thunks.getMovementTypes.rejected, (state, action) => {
        state.movementTypes = ApiResponse.error(action.payload);
      })
      // get movements list
      .addCase(thunks.getMovements.pending, (state) => {
        state.getMovements = ApiResponse.loading();
      })
      .addCase(thunks.getMovements.fulfilled, (state, action) => {
        state.getMovements = isEmpty(action.payload)
          ? ApiResponse.empty()
          : ApiResponse.value(action.payload);
      })
      .addCase(thunks.getMovements.rejected, (state, action) => {
        state.getMovements = ApiResponse.error(action.payload);
      })
      // get movements ward list
      .addCase(thunks.getMovementsWard.pending, (state) => {
        state.getMovementsWard = ApiResponse.loading();
      })
      .addCase(thunks.getMovementsWard.fulfilled, (state, action) => {
        state.getMovementsWard = isEmpty(action.payload)
          ? ApiResponse.empty()
          : ApiResponse.value(action.payload);
      })
      .addCase(thunks.getMovementsWard.rejected, (state, action) => {
        state.getMovementsWard = ApiResponse.error(action.payload);
      })
      // get ward movements list
      .addCase(thunks.getWardMovements.pending, (state) => {
        state.wardMovements = ApiResponse.loading();
      })
      .addCase(thunks.getWardMovements.fulfilled, (state, action) => {
        state.wardMovements = isEmpty(action.payload)
          ? ApiResponse.empty()
          : ApiResponse.value(action.payload);
      })
      .addCase(thunks.getWardMovements.rejected, (state, action) => {
        state.wardMovements = ApiResponse.error(action.payload);
      })
      // get ward movements to ward list
      .addCase(thunks.getWardMovementsToWard.pending, (state) => {
        state.getWardMovementsToWard = ApiResponse.loading();
      })
      .addCase(thunks.getWardMovementsToWard.fulfilled, (state, action) => {
        state.getWardMovementsToWard = isEmpty(action.payload)
          ? ApiResponse.empty()
          : ApiResponse.value(action.payload);
      })
      .addCase(thunks.getWardMovementsToWard.rejected, (state, action) => {
        state.getWardMovementsToWard = ApiResponse.error(action.payload);
      })
      // get medicals list
      .addCase(thunks.getMedicals.pending, (state) => {
        state.getMedicals = ApiResponse.loading();
      })
      .addCase(thunks.getMedicals.fulfilled, (state, action) => {
        state.getMedicals = isEmpty(action.payload)
          ? ApiResponse.empty()
          : ApiResponse.value(action.payload);
      })
      .addCase(thunks.getMedicals.rejected, (state, action) => {
        state.getMedicals = ApiResponse.error(action.payload);
      })
      // get ward medicals list
      .addCase(thunks.getWardMedicals.pending, (state) => {
        state.wardMedicals = ApiResponse.loading();
      })
      .addCase(thunks.getWardMedicals.fulfilled, (state, action) => {
        state.wardMedicals = isEmpty(action.payload)
          ? ApiResponse.empty()
          : ApiResponse.value(action.payload);
      })
      .addCase(thunks.getWardMedicals.rejected, (state, action) => {
        state.wardMedicals = ApiResponse.error(action.payload);
      })
      // get current quantity of medical in ward
      .addCase(thunks.getCurrentQuantityInWard.pending, (state, action) => {
        const wardCode = action.meta.arg.wardCode;
        state.getCurrentQuantityInWard[wardCode] = ApiResponse.loading();
      })
      .addCase(thunks.getCurrentQuantityInWard.fulfilled, (state, action) => {
        const wardCode = action.meta.arg.wardCode;
        state.getCurrentQuantityInWard[wardCode] = ApiResponse.value(
          action.payload
        );
      })
      .addCase(thunks.getCurrentQuantityInWard.rejected, (state, action) => {
        const wardCode = action.meta.arg.wardCode;
        state.getCurrentQuantityInWard[wardCode] = ApiResponse.error(
          action.payload
        );
      })
      // get current quantity of medical in all wards
      .addCase(thunks.getCurrentQuantityInAllWards.pending, (state) => {
        state.getCurrentQuantityInAllWards = ApiResponse.loading();
      })
      .addCase(thunks.getCurrentQuantityInAllWards.fulfilled, (state, action) => {
        state.getCurrentQuantityInAllWards = ApiResponse.value(action.payload);
      })
      .addCase(thunks.getCurrentQuantityInAllWards.rejected, (state, action) => {
        state.getCurrentQuantityInAllWards = ApiResponse.error(action.payload);
      })
      // Charge movements
      .addCase(thunks.chargeMovements.pending, (state) => {
        state.chargeMovements = ApiResponse.loading();
      })
      .addCase(thunks.chargeMovements.fulfilled, (state, action) => {
        state.chargeMovements = ApiResponse.value(action.payload);
      })
      .addCase(thunks.chargeMovements.rejected, (state, action) => {
        state.chargeMovements = ApiResponse.error(action.payload);
      })
      // Discharge movements
      .addCase(thunks.dischargeMovements.pending, (state) => {
        state.dischargeMovements = ApiResponse.loading();
      })
      .addCase(thunks.dischargeMovements.fulfilled, (state, action) => {
        state.dischargeMovements = ApiResponse.value(action.payload);
      })
      .addCase(thunks.dischargeMovements.rejected, (state, action) => {
        state.dischargeMovements = ApiResponse.error(action.payload);
      })
      // get medical types list
      .addCase(thunks.getMedicalTypes.pending, (state) => {
        state.getMedicalTypes = ApiResponse.loading();
      })
      .addCase(thunks.getMedicalTypes.fulfilled, (state, action) => {
        const data = action.payload.response || action.payload;
        state.getMedicalTypes = ApiResponse.value(data);
      })
      .addCase(thunks.getMedicalTypes.rejected, (state, action) => {
        state.getMedicalTypes = ApiResponse.error(action.payload);
      })
      // Get medical
      .addCase(thunks.getMedical.pending, (state) => {
        state.getMedical = ApiResponse.loading();
      })
      .addCase(thunks.getMedical.fulfilled, (state, action) => {
        state.getMedical = ApiResponse.value(action.payload);
      })
      .addCase(thunks.getMedical.rejected, (state, action) => {
        state.getMedical = ApiResponse.error(action.payload);
      })
      // New medical
      .addCase(thunks.newMedical.pending, (state) => {
        state.newMedical = ApiResponse.loading();
      })
      .addCase(thunks.newMedical.fulfilled, (state, action) => {
        state.newMedical = ApiResponse.value(action.payload);
      })
      .addCase(thunks.newMedical.rejected, (state, action) => {
        state.newMedical = ApiResponse.error(action.payload);
      })
      // Update medical
      .addCase(thunks.updateMedical.pending, (state) => {
        state.updateMedical = ApiResponse.loading();
      })
      .addCase(thunks.updateMedical.fulfilled, (state, action) => {
        state.updateMedical = ApiResponse.value(action.payload);
      })
      .addCase(thunks.updateMedical.rejected, (state, action) => {
        state.updateMedical = ApiResponse.error(action.payload);
      })
      // Ward movement
      .addCase(thunks.createWardMovement.pending, (state) => {
        state.createWardMovement = ApiResponse.loading();
      })
      .addCase(thunks.createWardMovement.fulfilled, (state, action) => {
        state.createWardMovement = ApiResponse.value(action.payload);
      })
      .addCase(thunks.createWardMovement.rejected, (state, action) => {
        state.createWardMovement = ApiResponse.error(action.payload);
      })
      // Get Medical Lots
      .addCase(thunks.getMedicalLots.pending, (state) => {
        state.medicalLots = ApiResponse.loading();
      })
      .addCase(thunks.getMedicalLots.fulfilled, (state, action) => {
        state.medicalLots = ApiResponse.value(action.payload);
      })
      .addCase(thunks.getMedicalLots.rejected, (state, action) => {
        state.medicalLots = ApiResponse.error(action.payload);
      })
      // Print pharmaceutical stock ward pdf report
      .addCase(thunks.printPharmaceuticalStockWardPdf.pending, (state) => {
        state.printPharmaceuticalStockWardPdf = ApiResponse.loading();
      })
      .addCase(
        thunks.printPharmaceuticalStockWardPdf.fulfilled,
        (state, action) => {
          if (action.payload instanceof Blob) {
            state.printPharmaceuticalStockWardPdf = ApiResponse.value(
              action.payload
            );
          } else {
            state.printPharmaceuticalStockWardPdf = ApiResponse.error(
              action.payload
            );
          }
        }
      )
      .addCase(
        thunks.printPharmaceuticalStockWardPdf.rejected,
        (state, action) => {
          state.printPharmaceuticalStockWardPdf = ApiResponse.error(
            action.payload
          );
        }
      )
      // Print pharmaceutical stock pdf report
      .addCase(thunks.printPharmaceuticalStockPdf.pending, (state) => {
        state.printPharmaceuticalStockPdf = ApiResponse.loading();
      })
      .addCase(
        thunks.printPharmaceuticalStockPdf.fulfilled,
        (state, action) => {
          if (action.payload instanceof Blob) {
            state.printPharmaceuticalStockPdf = ApiResponse.value(
              action.payload
            );
          } else {
            state.printPharmaceuticalStockPdf = ApiResponse.error(
              action.payload
            );
          }
        }
      )
      .addCase(thunks.printPharmaceuticalStockPdf.rejected, (state, action) => {
        state.printPharmaceuticalStockPdf = ApiResponse.error(action.payload);
      })
      // Print pharmaceutical stock card pdf report
      .addCase(thunks.printPharmaceuticalStockCardPdf.pending, (state) => {
        state.printPharmaceuticalStockCardPdf = ApiResponse.loading();
      })
      .addCase(
        thunks.printPharmaceuticalStockCardPdf.fulfilled,
        (state, action) => {
          if (action.payload instanceof Blob) {
            state.printPharmaceuticalStockCardPdf = ApiResponse.value(
              action.payload
            );
          } else {
            state.printPharmaceuticalStockCardPdf = ApiResponse.error(
              action.payload
            );
          }
        }
      )
      .addCase(
        thunks.printPharmaceuticalStockCardPdf.rejected,
        (state, action) => {
          state.printPharmaceuticalStockCardPdf = ApiResponse.error(
            action.payload
          );
        }
      )
      // Print pharmaceutical order pdf report
      .addCase(thunks.printPharmaceuticalOrderPdf.pending, (state) => {
        state.printPharmaceuticalOrderPdf = ApiResponse.loading();
      })
      .addCase(thunks.printPharmaceuticalOrderPdf.fulfilled, (state, action) => {
        state.printPharmaceuticalOrderPdf = ApiResponse.value(action.payload as Blob);
      })
      .addCase(thunks.printPharmaceuticalOrderPdf.rejected, (state, action) => {
        state.printPharmaceuticalOrderPdf = ApiResponse.error(action.payload);
      })
      // Print pharmaceutical AMC pdf report
      .addCase(thunks.printPharmaceuticalAMCPdf.pending, (state) => {
        state.printPharmaceuticalAMCPdf = ApiResponse.loading();
      })
      .addCase(thunks.printPharmaceuticalAMCPdf.fulfilled, (state, action) => {
        if (action.payload instanceof Blob) {
          state.printPharmaceuticalAMCPdf = ApiResponse.value(action.payload);
        } else {
          state.printPharmaceuticalAMCPdf = ApiResponse.error(action.payload);
        }
      })
      .addCase(thunks.printPharmaceuticalAMCPdf.rejected, (state, action) => {
        state.printPharmaceuticalAMCPdf = ApiResponse.error(action.payload);
      })
      // Print pharmaceutical stock ward excel report
      .addCase(thunks.printPharmaceuticalStockWardExcel.pending, (state) => {
        state.printPharmaceuticalStockWardExcel = ApiResponse.loading();
      })
      .addCase(
        thunks.printPharmaceuticalStockWardExcel.fulfilled,
        (state, action) => {
          if (action.payload instanceof Blob) {
            state.printPharmaceuticalStockWardExcel = ApiResponse.value(
              action.payload
            );
          } else {
            state.printPharmaceuticalStockWardExcel = ApiResponse.error(
              action.payload
            );
          }
        }
      )
      .addCase(
        thunks.printPharmaceuticalStockWardExcel.rejected,
        (state, action) => {
          state.printPharmaceuticalStockWardExcel = ApiResponse.error(
            action.payload
          );
        }
      )
      // Print pharmaceutical expiration report
      .addCase(thunks.printPharmaceuticalExpirationPdf.pending, (state) => {
        state.printPharmaceuticalExpirationPdf = ApiResponse.loading();
      })
      .addCase(
        thunks.printPharmaceuticalExpirationPdf.fulfilled,
        (state, action) => {
          if (action.payload instanceof Blob) {
            state.printPharmaceuticalExpirationPdf = ApiResponse.value(
              action.payload
            );
          } else {
            state.printPharmaceuticalExpirationPdf = ApiResponse.error(
              action.payload
            );
          }
        }
      )
      .addCase(
        thunks.printPharmaceuticalExpirationPdf.rejected,
        (state, action) => {
          state.printPharmaceuticalExpirationPdf = ApiResponse.error(
            action.payload
          );
        }
      );
  },
});

export const {
  createMovementReset,
  updateMovementReset,
  deleteMovementReset,
  resetWardMovements,
  resetWardMedicals,
  updateWardStockFIilter,
  resetWardStockFilter,
  resetChargeMovements,
  resetMovementTypes,
  resetDischargeMovements,
  resetMedicals,
  resetMedicalTypes,
  resetGetMedical,
  resetNewMedical,
  resetUpdateMedical,
  resetCreateWardMovement,
  resetPrintPharmaceuticalStockWardPdf,
  resetPrintPharmaceuticalStockPdf,
  resetPrintPharmaceuticalStockCardPdf,
  resetPrintPharmaceuticalAMCPdf,
  resetPrintPharmaceuticalStockWardExcel,
  resetPrintPharmaceuticalExpirationPdf,
} = pharmacySlice.actions;
