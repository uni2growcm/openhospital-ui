import { TownDTO } from "../../generated";
import { ApiResponse } from "../types";

export type ITownState = {
  townList: ApiResponse<Array<TownDTO>>;
  getById: ApiResponse<TownDTO>;
  create: ApiResponse<TownDTO>;
  update: ApiResponse<TownDTO>;
  delete: ApiResponse<void>;
};