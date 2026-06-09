import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { admissionSlice } from "./admissions";
import { billSlice } from "./bills";
import { careSlice } from "./care";
import { conditioningSlice } from "./conditionings";
import { dashboardSlice } from "./dashboard";
import { diseaseSlice } from "./diseases";
import { encounterSlice } from "./encounter";
import { ethnicSlice } from "./ethnic";
import { examinationSlice } from "./examinations";
import { examSlice } from "./exams";
import { hospitalSlice } from "./hospital";
import { hospitalisationconsultationSlice } from "./hospitalisationconsultation";
import { laboratorySlice } from "./laboratories";
import { layoutSlice } from "./layouts";
import { mainSlice } from "./main";
import { medicalHistorySlice } from "./medicalhistory";
import { medicalSlice } from "./medicals";
import { municipalitySlice } from "./municipality";
import { occupationSlice } from "./occupation";
import { opdSlice } from "./opds";
import { operationSlice } from "./operations";
import { patientSlice } from "./patients";
import { permissionSlice } from "./permissions";
import { priceSlice } from "./prices";
import { radiologySlice } from "./radiology";
import { settingsSlice } from "./settings";
import { summaryByEncounterSlice, summarySlice } from "./summary";
import { supplierSlice } from "./suppliers";
import { therapySlice } from "./therapies";
import { townSlice } from "./town";
import { diseaseTypeSlice } from "./types/diseases";
import { examTypeSlice } from "./types/exams";
import typesReducer from "./types/slice";
import { userGroupSlice } from "./usergroups";
import { userSlice } from "./users";
import { vaccineSlice } from "./vaccines";
import { visitSlice } from "./visits";
import { wardSlice } from "./ward";

const reducer = combineReducers({
  main: mainSlice.reducer,
  patients: patientSlice.reducer,
  examinations: examinationSlice.reducer,
  therapies: therapySlice.reducer,
  summary: summarySlice.reducer,
  summaryByEncounter: summaryByEncounterSlice.reducer,
  opds: opdSlice.reducer,
  diseases: diseaseSlice.reducer,
  medicals: medicalSlice.reducer,
  admissions: admissionSlice.reducer,
  wards: wardSlice.reducer,
  laboratories: laboratorySlice.reducer,
  exams: examSlice.reducer,
  bills: billSlice.reducer,
  prices: priceSlice.reducer,
  permissions: permissionSlice.reducer,
  visits: visitSlice.reducer,
  operations: operationSlice.reducer,
  diseaseTypes: diseaseTypeSlice.reducer,
  examTypes: examTypeSlice.reducer,
  hospital: hospitalSlice.reducer,
  layouts: layoutSlice.reducer,
  dashboard: dashboardSlice.reducer,
  users: userSlice.reducer,
  usergroups: userGroupSlice.reducer,
  vaccines: vaccineSlice.reducer,
  types: typesReducer,
  suppliers: supplierSlice.reducer,
  settings: settingsSlice.reducer,
  radiology: radiologySlice.reducer,
  encounters: encounterSlice.reducer,
  conditioning: conditioningSlice.reducer,
  medicalhistory: medicalHistorySlice.reducer,
  care: careSlice.reducer,
  towns: townSlice.reducer,
  occupations: occupationSlice.reducer,
  ethnics: ethnicSlice.reducer,
  communes: municipalitySlice.reducer,
  hospitalisationconsultations: hospitalisationconsultationSlice.reducer,
});

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
