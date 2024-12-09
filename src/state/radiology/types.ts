import {
  InstanceResponse,
  SeriesResponse,
  StudyResponse,
} from "../../generated";
import { ApiResponse } from "../types";

export type IRadiologyState = {
  studies: ApiResponse<StudyResponse[]>;
  series: ApiResponse<SeriesResponse[]>;
  instances: ApiResponse<InstanceResponse[]>;
  preview: ApiResponse<string>;
};
