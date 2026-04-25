import { createAsyncThunk } from "@reduxjs/toolkit";
import { wrapper } from "libraries/apiUtils/wrapper";
import { concat, firstValueFrom, of } from "rxjs";
import { catchError, map, toArray } from "rxjs/operators";
import {
  AdmissionsApi,
  EncounterApi,
  ExaminationsApi,
  LaboratoriesApi,
  OpdsApi,
  OperationsApi,
  TherapiesApi,
  VisitApi,
} from "../../generated";
import { customConfiguration } from "../../libraries/apiUtils/configuration";
import { convertToSummaryData } from "../../libraries/reduxUtils/convert";
import { SummaryField } from "./consts";

const therapiesApi = new TherapiesApi(customConfiguration());

const operationsApi = new OperationsApi(customConfiguration());
const admissionsApi = new AdmissionsApi(customConfiguration());
const opdControllerrApi = new OpdsApi(customConfiguration());
const visitControllerrApi = new VisitApi(customConfiguration());

const examinationsApi = new ExaminationsApi(customConfiguration());

const laboratoriesApi = new LaboratoriesApi(customConfiguration());
const encounterApi = new EncounterApi(customConfiguration());

const parseDate = (value?: string | number | null) => {
  if (!value) return NaN;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? NaN : date.getTime();
};

const getEncounterWindow = (encounter: { performedAt?: string; closedAt?: string }) => {
  const start = parseDate(encounter.performedAt);
  const end = parseDate(encounter.closedAt);
  return {
    start,
    end: Number.isNaN(end) ? Number.POSITIVE_INFINITY : end,
  };
};

const isDateInEncounter = (
  date?: string | number,
  encounter?: { performedAt?: string; closedAt?: string }
) => {
  if (!encounter) return false;
  const time = parseDate(date);
  if (Number.isNaN(time)) return false;
  const { start, end } = getEncounterWindow(encounter);
  return time >= start && time <= end;
};

const isTherapyInEncounter = (
  therapy: { startDate?: string; endDate?: string },
  encounter: { performedAt?: string; closedAt?: string }
) => {
  const start = parseDate(therapy.startDate);
  if (Number.isNaN(start)) return false;
  const end = parseDate(therapy.endDate);
  const therapyEnd = Number.isNaN(end) ? Number.POSITIVE_INFINITY : end;
  const { start: encounterStart, end: encounterEnd } = getEncounterWindow(encounter);
  return therapyEnd >= encounterStart && start <= encounterEnd;
};

const isOperationInEncounter = (
  operation: any,
  encounter: { performedAt?: string; closedAt?: string }
) => {
  if (isDateInEncounter(operation.opDate, encounter)) return true;
  if (operation.opd?.date && isDateInEncounter(operation.opd.date, encounter)) return true;
  if (operation.admission?.admDate && isDateInEncounter(operation.admission.admDate, encounter)) return true;
  return false;
};

export const loadSummaryData = createAsyncThunk(
  "summary/loadSummaryData",
  async (code: number, thunkApi) =>
    firstValueFrom(
      concat(
        wrapper(() => examinationsApi.getByPatientId({ patId: code })).pipe(
          map((res) => convertToSummaryData(res, SummaryField.triage)),
          catchError(() => of([]))
        ),
        wrapper(() => opdControllerrApi.getOpdByPatient({ pcode: code })).pipe(
          map((res) =>
            convertToSummaryData(
              res.map((e) => e.opdDTO),
              SummaryField.opd
            )
          ),
          catchError(() => of([]))
        ),
        wrapper(() => laboratoriesApi.getLaboratory1({ patId: code })).pipe(
          map((res) =>
            convertToSummaryData(
              res.map((e) => {
                if (e.laboratoryDTO?.exam?.procedure === 2) {
                  e.laboratoryDTO.result = e.laboratoryRowList?.join(", ");
                  return e.laboratoryDTO;
                } else {
                  return e.laboratoryDTO;
                }
              }),
              SummaryField.exam
            )
          ),
          catchError(() => of([]))
        ),
        wrapper(() => admissionsApi.getAdmissions1({ patientCode: code })).pipe(
          map((res) => convertToSummaryData(res, SummaryField.admission)),
          catchError(() => of([]))
        ),
        wrapper(() => visitControllerrApi.getVisit({ patID: code })).pipe(
          map((res) => convertToSummaryData(res, SummaryField.visit)),
          catchError(() => of([]))
        ),
        wrapper(() =>
          operationsApi.getOperationRowsByPatient({ patientCode: code })
        ).pipe(
          map((res) => convertToSummaryData(res, SummaryField.operation)),
          catchError(() => of([]))
        ),
        wrapper(() => therapiesApi.getTherapyRows({ codePatient: code })).pipe(
          map((res) => convertToSummaryData(res, SummaryField.therapy)),
          catchError(() => of([]))
        )
      ).pipe(toArray())
    )
      .then(
        ([triages, opds, exams, admissions, visits, operations, therapies]) => [
          ...triages,
          ...opds,
          ...exams,
          ...admissions,
          ...visits,
          ...operations,
          ...therapies,
        ]
      )
      .catch((error) => thunkApi.rejectWithValue(error))
);

export const loadSummaryDataGroupedByEncounter = createAsyncThunk(
  "summary/loadSummaryDataGroupedByEncounter",
  async (code: number, thunkApi) => {
    try {
      const [encounters, visits, operations, therapies] = await Promise.all([
        firstValueFrom(
          wrapper(() => encounterApi.getEncountersByPatient({ patientId: code })).pipe(
            catchError(() => of([]))
          )
        ),
        firstValueFrom(
          wrapper(() => visitControllerrApi.getVisit({ patID: code })).pipe(
            catchError(() => of([]))
          )
        ),
        firstValueFrom(
          wrapper(() => operationsApi.getOperationRowsByPatient({ patientCode: code })).pipe(
            catchError(() => of([]))
          )
        ),
        firstValueFrom(
          wrapper(() => therapiesApi.getTherapyRows({ codePatient: code })).pipe(
            catchError(() => of([]))
          )
        ),
      ]);

      if (!Array.isArray(encounters) || encounters.length === 0) {
        return [];
      }

      const sortedEncounters = [...encounters].sort((a: any, b: any) => {
        const aTime = parseDate(a?.performedAt);
        const bTime = parseDate(b?.performedAt);
        if (Number.isNaN(aTime) || Number.isNaN(bTime)) return 0;
        return aTime - bTime;
      });

      const encounterSummary = await Promise.all(
        sortedEncounters.map(async (encounter: any) => {
          const encounterVisits = Array.isArray(visits)
            ? visits.filter((visit: any) => isDateInEncounter(visit.date, encounter))
            : [];

          const encounterOperations = Array.isArray(operations)
            ? operations.filter((operation: any) => isOperationInEncounter(operation, encounter))
            : [];

          const encounterTherapies = Array.isArray(therapies)
            ? therapies.filter((therapy: any) => isTherapyInEncounter(therapy, encounter))
            : [];

          const summarySections = await firstValueFrom(
            concat(
              wrapper(() =>
                encounterApi.getPatientExaminationsByEncounter({ code: encounter.code })
              ).pipe(
                map((res) => convertToSummaryData(res, SummaryField.triage)),
                catchError(() => of([]))
              ),
              wrapper(() => encounterApi.getOPDByEncounter({ code: encounter.code })).pipe(
                map((res) =>
                  convertToSummaryData(
                    Array.isArray(res) ? res.map((e: any) => e.opdDTO) : [],
                    SummaryField.opd
                  )
                ),
                catchError(() => of([]))
              ),
              wrapper(() => encounterApi.getLaboratoryByEncounter({ code: encounter.code })).pipe(
                map((res) => convertToSummaryData(res, SummaryField.exam)),
                catchError(() => of([]))
              ),
              wrapper(() => encounterApi.getAdmissionsByEncounter({ code: encounter.code })).pipe(
                map((res) => convertToSummaryData(res, SummaryField.admission)),
                catchError(() => of([]))
              ),
              of(convertToSummaryData(encounterVisits, SummaryField.visit)),
              of(convertToSummaryData(encounterOperations, SummaryField.operation)),
              of(convertToSummaryData(encounterTherapies, SummaryField.therapy))
            ).pipe(toArray())
          );

          return {
            encounter,
            summaryData: summarySections.flat(),
          };
        })
      );

      return encounterSummary;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);