import { EthnicDTO } from "generated";
import { ApiResponse } from "state/types";

export type IEthnicState = {
  ethnicList: ApiResponse<Array<EthnicDTO>>;
  getById: ApiResponse<EthnicDTO>;
  create: ApiResponse<EthnicDTO>;
  update: ApiResponse<EthnicDTO>;
  delete: ApiResponse<EthnicDTO>;
};