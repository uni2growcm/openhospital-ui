import { ConditioningDTO } from "../../../generated";

export interface IStateProps {
  isLoading: boolean;
  hasSucceeded: boolean;
  hasFailed: boolean;
}

export interface IDispatchProps {
  newConditioning: (care: ConditioningDTO) => any;
  newConditioningReset: () => void;
}

export type TProps = IStateProps & IDispatchProps;

export type CareTransitionState = "IDLE" | "TO_RESET" | "FAIL";
