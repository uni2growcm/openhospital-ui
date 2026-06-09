import { CommuneDTO } from "generated";

export interface IProps {
  initialValues: CommuneDTO;
  isLoading: boolean;
  hasSucceeded: boolean;
  hasFailed: boolean;
  error: any;
  onSubmit: (commune: CommuneDTO) => void;
  successTitle: string;
  successInfo: string;
  onSuccess?: () => void;
}