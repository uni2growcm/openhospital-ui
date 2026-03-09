import { OccupationDTO } from "generated";

export interface IProps {
  initialValues: OccupationDTO;
  isLoading: boolean;
  hasSucceeded: boolean;
  hasFailed: boolean;
  error: any;
  onSubmit: (occupation: OccupationDTO) => void;
  title?: string;
  successTitle: string;
  successInfo: string;
  onSuccess?: () => void;
}