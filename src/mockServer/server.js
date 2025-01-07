import XHRAdapter from "@pollyjs/adapter-xhr";
import { Polly } from "@pollyjs/core";
import { BASE_PATH } from "../generated/runtime";
import { admissionTypesRoutes } from "./routes/admissionTypes";
import { admissionRoutes } from "./routes/admissions";
import { ageTypeRoutes } from "./routes/ageTypes";
import { authRoutes } from "./routes/auth";
import { billRoutes } from "./routes/bill";
import { deliveryResultTypeRoutes } from "./routes/deliveryResultType";
import { deliveryTypesRoutes } from "./routes/deliveryTypes";
import { dischargeTypesRoutes } from "./routes/dischargeTypes";
import { diseaseTypeRoutes } from "./routes/diseaseTypes";
import { diseasesRoutes } from "./routes/diseases";
import { examRoutes } from "./routes/exam";
import { examRowRoutes } from "./routes/examRow";
import { examTypesRoutes } from "./routes/examTypes";
import { examinationsRoutes } from "./routes/examinations";
import { hospitalRoutes } from "./routes/hospital";
import { labRoutes } from "./routes/lab";
import { labExamRequestRoutes } from "./routes/labExamRequest";
import { medicalTypesRoutes } from "./routes/medicalTypes";
import { medicalRoutes } from "./routes/medicals";
import { opdRoutes } from "./routes/opd";
import { operationTypeRoutes } from "./routes/operationTypes";
import { operationRoutes } from "./routes/operations";
import { patientRoutes } from "./routes/patients";
import { permissionRoutes } from "./routes/permission";
import { pregnantTreatmentTypeRoutes } from "./routes/pregnantTreatmentType";
import { pricesRoutes } from "./routes/prices";
import { radiologyRoutes } from "./routes/radiology";
import { suppliersRoutes } from "./routes/suppliers";
import { therapyRoutes } from "./routes/therapies";
import { userGroupRoutes } from "./routes/userGroups";
import { userRoutes } from "./routes/users";
import { vaccineRoutes } from "./routes/vaccine";
import { vaccineTypesRoutes } from "./routes/vaccineTypes";
import { visitRoutes } from "./routes/visits";
import { wardsRoutes } from "./routes/wards";

export function makeServer() {
  Polly.register(XHRAdapter);
  const polly = new Polly("api-mocking", {
    adapters: ["xhr"],
    mode: "passthrough",
    logging: true,
  });
  const { server } = polly;
  server.host(BASE_PATH, () => {
    userRoutes(server);
    userGroupRoutes(server);
    authRoutes(server);
    patientRoutes(server);
    visitRoutes(server);
    examinationsRoutes(server);
    therapyRoutes(server);
    opdRoutes(server);
    diseasesRoutes(server);
    medicalRoutes(server);
    admissionRoutes(server);
    admissionTypesRoutes(server);
    dischargeTypesRoutes(server);
    wardsRoutes(server);
    examTypesRoutes(server);
    examRoutes(server);
    labRoutes(server);
    examRowRoutes(server);
    labRoutes(server);
    pricesRoutes(server);
    billRoutes(server);
    operationRoutes(server);
    diseaseTypeRoutes(server);
    ageTypeRoutes(server);
    hospitalRoutes(server);
    operationTypeRoutes(server);
    vaccineRoutes(server);
    vaccineTypesRoutes(server);
    suppliersRoutes(server);
    deliveryTypesRoutes(server);
    medicalTypesRoutes(server);
    pregnantTreatmentTypeRoutes(server);
    deliveryResultTypeRoutes(server);
    permissionRoutes(server);
    labExamRequestRoutes(server);
    radiologyRoutes(server);
  });
  return server;
}
