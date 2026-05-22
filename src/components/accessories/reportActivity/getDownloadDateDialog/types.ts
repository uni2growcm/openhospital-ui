export interface IProps {
  option: ReportOptions;
  isOpen: boolean;
  title: string;
  isPrincipalStock?: boolean;
  primaryButtonLabel: string;
  secondaryButtonLabel?: string;
  loading?: boolean;
  handlePrimaryButtonClick: (payload: PrintProperties) => void;
  handleSecondaryButtonClick: () => void;
}

export type PrintProperties =
  | {
      date: string;
      month: string;
      year: string;
    }
  | {
      date: string;
      dateFrom: string;
      dateTo: string;
    };

interface IReport {
  key: string;
  code: string;
  option: "date-range" | "month-year";
}

export const reports: IReport[] = [
  {
    key: "reports.admissionReport",
    code: "001",
    option: "date-range",
  },
  {
    key: "reports.pathologyReport",
    code: "002",
    option: "date-range",
  },
  {
    key: "reports.pathologyByAgeGenderReport",
    code: "004",
    option: "date-range",
  },
  {
    key: "reports.dischargeReport",
    code: "004",
    option: "date-range",
  },
  {
    key: "reports.deathReport",
    code: "005",
    option: "date-range",
  },
];

export interface IReportDownload {
  code: string;
  option: ReportOptions;
  title: string;
}


export type ReportOptions = "date-range" | "month-year";