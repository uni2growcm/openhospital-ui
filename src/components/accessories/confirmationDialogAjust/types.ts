export interface IAjustProps {
  isOpen: boolean;
  title: string;
  icon: string;
  control: any;
  info: string;
  primaryButtonLabel: string;
  secondaryButtonLabel?: string;
  handlePrimaryButtonClick: () => void;
  handleSecondaryButtonClick: () => void;
  lastQuantity?: number;
  ajustQuantity?: boolean;
}
