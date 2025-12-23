export type PharmaceuticalExpiringDialogProps = {
  isOpen: boolean;
  handlePrimaryButtonClick: (period: string, month: string | null) => void;
  handleSecondaryButtonClick: () => void;
};

export enum ExperingPeriod {
  TODAY = "TODAY",
  THISMONTH = "THISMONTH",
  NEXTMONTH = "NEXTMONTH",
  NEXTTWOMONTHS = "NEXTTWOMONTHS",
  SPECIFICMONTH = "SPECIFICMONTH",
}

export enum ExpiringMonth {
  JANUARY = "JANUARY",
  FEBRUARY = "FEBRUARY",
  MARCH = "MARCH",
  APRIL = "APRIL",
  MAY = "MAY",
  JUNE = "JUNE",
  JULY = "JULY",
  AUGUST = "AUGUST",
  SEPTEMBER = "SEPTEMBER",
  OCTOBER = "OCTOBER",
  NOVEMBER = "NOVEMBER",
  DECEMBER = "DECEMBER",
}
