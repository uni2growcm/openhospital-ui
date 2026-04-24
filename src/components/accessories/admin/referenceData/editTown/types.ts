import { TownDTO } from "generated";

export interface IProps {
  initialValues: TownDTO;
  isLoading: boolean;
  hasSucceeded: boolean;
  hasFailed: boolean;
  error: any;
  onSubmit: (town: TownDTO) => void;
  title?: string;
  successTitle: string;
  successInfo: string;
  onSuccess?: () => void;
}