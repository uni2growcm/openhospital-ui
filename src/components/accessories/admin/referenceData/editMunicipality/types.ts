import { MunicipalityDTO } from "generated";

export interface IProps {
  initialValues: MunicipalityDTO;
  isLoading: boolean;
  hasSucceeded: boolean;
  hasFailed: boolean;
  error: any;
  onSubmit: (municipality: MunicipalityDTO) => void;
  successTitle: string;
  successInfo: string;
  onSuccess?: () => void;
}