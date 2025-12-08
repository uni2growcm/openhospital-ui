import { createAsyncThunk } from "@reduxjs/toolkit";
import { isValid, parseISO } from "date-fns";
import {
  GetMedicalRequest,
  GetMovementWardRequest,
  MedicalStockMovementTypeApi,
  MedicalStockWardApi,
  MedicalTypesApi,
  MedicalsApi,
  MovementDTO,
  NewMedicalRequest,
  NewMultipleChargingMovementsRequest,
  NewMultipleDischargingMovementsRequest,
  PrintPharmaceuticalAMCRequest,
  PrintPharmaceuticalStockCardPdfRequest,
  PrintPharmaceuticalStockPdfRequest,
  PrintPharmaceuticalStockWardPdfRequest,
  ReportsApi,
  StockMovementsApi,
  UpdateMedicalRequest,
} from "generated";
import { customConfiguration } from "libraries/apiUtils/configuration";
import { wrapper } from "libraries/apiUtils/wrapper";
import { firstValueFrom } from "rxjs";

const api = new StockMovementsApi(customConfiguration());
const apiReport = new ReportsApi(customConfiguration());
const movementTypeApi = new MedicalStockMovementTypeApi(customConfiguration());
const wardStockApi = new MedicalStockWardApi(customConfiguration());
const medicalApi = new MedicalsApi(customConfiguration());
const medicalTypeApi = new MedicalTypesApi(customConfiguration());

export const getMovements = createAsyncThunk(
  "pharmacy/getMovements",
  async (_, thunkApi) => {
    try {
      const result = await firstValueFrom(wrapper(() => api.getMovements()));
      return result;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response);
    }
  }
);

export const getMovementTypes = createAsyncThunk(
  "pharmacy/movementTypes",
  async (_, thunkApi) => {
    try {
      const result = await firstValueFrom(
        wrapper(() => movementTypeApi.getMedicalDsrStockMovementType())
      );
      return result;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response);
    }
  }
);

export const getWardMovements = createAsyncThunk(
  "pharmacy/getWardMovements",
  async (payload: { wardCode: string; from?: Date; to?: Date }, thunkApi) => {
    try {
      const result = await firstValueFrom(
        wrapper(() =>
          wardStockApi.getMovementWard({
            ...payload,
            from: payload.to ?? new Date("2010-12-25T10:30:00Z"),
            to: payload.from ?? new Date(),
          } as any as GetMovementWardRequest)
        )
      );
      return result;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response);
    }
  }
);

export const getWardMedicals = createAsyncThunk(
  "pharmacy/getWardMedicals",
  async ({ wardCode }: { wardCode: string }, thunkApi) => {
    try {
      const result = await firstValueFrom(
        wrapper(() =>
          wardStockApi.getMedicalsWard({
            wardCode,
          })
        )
      );
      return result;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response);
    }
  }
);

export const chargeMovements = createAsyncThunk(
  "pharmacy/chargeMovements",
  async (payload: NewMultipleChargingMovementsRequest, thunkApi) => {
    try {
      const result = await firstValueFrom(
        wrapper(() => api.newMultipleChargingMovements(payload))
      );
      return result;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response);
    }
  }
);

export const getMedicals = createAsyncThunk(
  "pharmacy/getMedicals",
  async (_, thunkApi) => {
    try {
      const result = await firstValueFrom(
        wrapper(() => medicalApi.getMedicals({}))
      );
      return result;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response);
    }
  }
);

export const getMedicalTypes = createAsyncThunk(
  "pharmacy/getMedicalTypes",
  async (_, thunkApi) => {
    try {
      const result = await firstValueFrom(
        wrapper(() => medicalTypeApi.getMedicalTypes({}))
      );
      return result;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response);
    }
  }
);

export const getMedical = createAsyncThunk(
  "pharmacy/getMedical",
  async (payload: GetMedicalRequest, thunkApi) => {
    try {
      const result = await firstValueFrom(
        wrapper(() => medicalApi.getMedical(payload))
      );
      return result;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response);
    }
  }
);

export const newMedical = createAsyncThunk(
  "pharmacy/newMedical",
  async (payload: NewMedicalRequest, thunkApi) => {
    try {
      const result = await firstValueFrom(
        wrapper(() => medicalApi.newMedical(payload))
      );
      return result;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response);
    }
  }
);

export const updateMedical = createAsyncThunk(
  "pharmacy/updateMedical",
  async (payload: UpdateMedicalRequest, thunkApi) => {
    try {
      const result = await firstValueFrom(
        wrapper(() => medicalApi.updateMedical(payload))
      );
      return result;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response);
    }
  }
);

// export const dischargeMovements = createAsyncThunk(
//   "pharmacy/dischargeMovements",
//   async (payload: NewMultipleDischargingMovementsRequest, thunkApi) => {
//     try {
//       const result = await firstValueFrom(
//         wrapper(() => api.newMultipleDischargingMovements(payload))
//       );
//       return result;
//     } catch (error: any) {
//       return thunkApi.rejectWithValue(error.response);
//     }
//   }
// );

export const dischargeMovements = createAsyncThunk<
  boolean, // type du retour
  { ref: string; movementDTO: MovementDTO[] }, // payload attendu
  { rejectValue: any }
>("pharmacy/dischargeMovements", async (payload, thunkApi) => {
  try {
    const request: NewMultipleDischargingMovementsRequest = {
      ref: payload.ref,
      movementDTO: payload.movementDTO,
    };

    const result = await firstValueFrom(
      wrapper(() => api.newMultipleDischargingMovements(request))
    );
    return result;
  } catch (error: any) {
    return thunkApi.rejectWithValue(error.response);
  }
});

export const printPharmaceuticalStockWardPdf = createAsyncThunk(
  "pharmacy/getPharmaceuticalStockWardPdfReport",
  async (payload: PrintPharmaceuticalStockWardPdfRequest, thunkApi) => {
    try {
      const date = payload.date ? parseISO(payload.date) : payload.date;
      const result = await firstValueFrom(
        wrapper(() =>
          apiReport.printPharmaceuticalStockWardPdf({
            ...payload,
            date: isValid(date) ? date : new Date(),
          } as PrintPharmaceuticalStockWardPdfRequest)
        )
      );
      return result;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response);
    }
  }
);

export const printPharmaceuticalStockPdf = createAsyncThunk(
  "pharmacy/getPharmaceuticalStockPdfReport",
  async (payload: PrintPharmaceuticalStockPdfRequest, thunkApi) => {
    try {
      const date = payload.date ? parseISO(payload.date) : payload.date;
      const result = await firstValueFrom(
        wrapper(() =>
          apiReport.printPharmaceuticalStockPdf({
            ...payload,
            date: isValid(date) ? date : new Date(),
          } as PrintPharmaceuticalStockPdfRequest)
        )
      );
      return result;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response);
    }
  }
);

export const printPharmaceuticalStockCardPdf = createAsyncThunk(
  "pharmacy/getPharmaceuticalStockCardPdfReport",
  async (payload: PrintPharmaceuticalStockCardPdfRequest, thunkApi) => {
    try {
      const dateTo = payload.dateTo ? parseISO(payload.dateTo) : payload.dateTo;
      const dateFrom = payload.dateFrom
        ? parseISO(payload.dateFrom)
        : payload.dateFrom;

      const result = await firstValueFrom(
        wrapper(() =>
          apiReport.printPharmaceuticalStockCardPdf({
            ...payload,
            dateTo: isValid(dateTo) ? dateTo : new Date(),
            dateFrom: isValid(dateFrom) ? dateFrom : new Date(),
          } as PrintPharmaceuticalStockCardPdfRequest)
        )
      );
      return result;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response);
    }
  }
);

export const printPharmaceuticalAMCPdf = createAsyncThunk(
  "pharmacy/getPharmaceuticalAMCPdfReport",
  async (payload: PrintPharmaceuticalAMCRequest, thunkApi) => {
    try {
      const date = payload.date ? parseISO(payload.date) : payload.date;
      const result = await firstValueFrom(
        wrapper(() =>
          apiReport.printPharmaceuticalAMC({
            date: isValid(date) ? date : new Date(),
          } as PrintPharmaceuticalAMCRequest)
        )
      );
      return result;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.response);
    }
  }
);
