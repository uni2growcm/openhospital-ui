export interface IProps {
  isOpen: boolean;
  title: string;
  isPrincipalStock?: boolean;
  isStockCard?: boolean;
  primaryButtonLabel: string;
  secondaryButtonLabel?: string;
  handlePrimaryButtonClick: (payload: PrintProperties) => void;
  handleSecondaryButtonClick: () => void;
}

export interface PrintProperties {
  date?: string;
  option?: string;
  dateTo?: string;
  dateFrom?: string;
  medCode?: number;
  wardCode?: string;
}
