export interface IUpdatePasswordFormValues {
  username: string;
  oldPasswd: string;
  newPasswd: string;
  confirmPasswd: string;
}

export interface IUpdatePasswordProps {
  username: string;
  isLoading: boolean;
  hasSucceeded: boolean;
  hasFailed: boolean;
  error: any;
  onSubmit: (values: IUpdatePasswordFormValues) => void;
}
