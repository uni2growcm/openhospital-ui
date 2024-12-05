import {
  InstanceResponse,
  SeriesResponse,
  StudyResponse,
} from "../../generated";
import { ApiResponse } from "../types";

export type IHospitalState = {
  studies: ApiResponse<StudyResponse[]>;
  series: ApiResponse<SeriesResponse[]>;
  instances: ApiResponse<InstanceResponse[]>;
};
