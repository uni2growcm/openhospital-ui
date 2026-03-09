import { EthnicDTO } from "generated";

export interface IProps {
  initialValues: EthnicDTO;
  isLoading: boolean;
  hasSucceeded: boolean;
  hasFailed: boolean;
  error: any;
  onSubmit: (ethnic: EthnicDTO) => void;
  title?: string;
  successTitle: string;
  successInfo: string;
  onSuccess?: () => void;
}