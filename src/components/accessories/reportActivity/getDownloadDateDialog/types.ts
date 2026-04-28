export interface IProps {
  option: ReportOptions;
  isOpen: boolean;
  title: string;
  isPrincipalStock?: boolean;
  primaryButtonLabel: string;
  secondaryButtonLabel?: string;
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
  filename: string;
  option: "date-range" | "month-year";
}

export const reports: IReport[] = [
  {
    key: "reports.oh009_inpatient",
    code: "OH009",
    filename: "rpt_stat/OH009_InPatientReport.jasper",
    option: "date-range",
  },
  {
    key: "reports.moh705a_under5",
    code: "MOH 705A",
    filename: "rpt_extra/MOH705A_Under_5_Years_Daily_Outpatient_Morbidity_Summary_Sheet.jasper",
    option: "month-year",
  },
  {
    key: "reports.oh011b_pending",
    code: "OH011B",
    filename: "rpt_stat/BillsReportPending.jasper",
    option: "date-range",
  },
  {
    key: "reports.moh717_page1",
    code: "MOH 717",
    filename: "rpt_extra/MOH717_Monthly_Workload_Report_for_Hospitals_page1.jasper",
    option: "month-year",
  },
  {
    key: "reports.hmis108_referrals",
    code: "HMIS 108",
    filename: "rpt_extra/hmis108_referrals.jasper",
    option: "month-year",
  },
  {
    key: "reports.oh010_outpatient",
    code: "OH010",
    filename: "rpt_stat/OH010_OutPatientReport.jasper",
    option: "date-range",
  },
  {
    key: "reports.oh011d_monthly_ward",
    code: "OH011D",
    filename: "rpt_stat/BillsReportMonthlyWard.jasper",
    option: "date-range",
  },
  {
    key: "reports.hmis33b_weekly",
    code: "HMIS 33b",
    filename: "rpt_extra/hmis033_weekly_epid_surv.jasper",
    option: "date-range",
  },
  {
    key: "reports.oh002_provenance",
    code: "OH002",
    filename: "rpt_stat/OH002_RegisteredPatientsByProvenance.jasper",
    option: "date-range",
  },
  {
    key: "reports.hmis108_operations",
    code: "HMIS 108",
    filename: "rpt_extra/hmis108_operations.jasper",
    option: "month-year",
  },
  {
    key: "reports.oh001_registered",
    code: "OH001",
    filename: "rpt_stat/OH001_RegisteredPatients.jasper",
    option: "date-range",
  },
  {
    key: "reports.oh005_age_sex",
    code: "OH005",
    filename: "rpt_stat/OH005_opd_count_monthly_report.jasper",
    option: "month-year",
  },
  {
    key: "reports.hmis105_diagnosis",
    code: "HMIS 105",
    filename: "rpt_extra/hmis105_opd_by_diagnosis.jasper",
    option: "month-year",
  },
  {
    key: "reports.oh011c_monthly",
    code: "OH011C",
    filename: "rpt_stat/BillsReportMonthly.jasper",
    option: "date-range",
  },
  {
    key: "reports.hmis105_attendance",
    code: "HMIS 105",
    filename: "rpt_extra/hmis105_opd_attendance.jasper",
    option: "month-year",
  },
  {
    key: "reports.hmis105_referrals",
    code: "HMIS 105",
    filename: "rpt_extra/hmis105_opd_referrals.jasper",
    option: "month-year",
  },
  {
    key: "reports.hmis55b_lab",
    code: "HMIS 55b",
    filename: "rpt_extra/hmis055b_lab_monthly_formatted.jasper",
    option: "month-year",
  },
  {
    key: "reports.oh007_lab_monthly",
    code: "OH007",
    filename: "rpt_stat/OH007_lab_monthly_report.jasper",
    option: "month-year",
  },
  {
    key: "reports.oh007_lab_results",
    code: "OH007",
    filename: "rpt_stat/OH007_lab_result_report.jasper",
    option: "date-range",
  },
  {
    key: "reports.oh003_age_sex",
    code: "OH003",
    filename: "rpt_stat/OH003_RegisteredPatientsByAgeAndSex.jasper",
    option: "date-range",
  },
  {
    key: "reports.oh004_price_codes",
    code: "OH004",
    filename: "rpt_stat/OH004_IncomesAllByPriceCodes.jasper",
    option: "date-range",
  },
  {
    key: "reports.oh006_diagnosis",
    code: "OH006",
    filename: "rpt_stat/OH006_opd_dis_monthly_report.jasper",
    option: "month-year",
  },
  {
    key: "reports.oh008_lab_opd",
    code: "OH008",
    filename: "rpt_stat/OH008_lab_summary_for_opd.jasper",
    option: "month-year",
  },
  {
    key: "reports.oh011a_all",
    code: "OH011A",
    filename: "rpt_stat/BillsReport.jasper",
    option: "date-range",
  },
  {
    key: "reports.hmis33b_weekly_over5",
    code: "HMIS 33b",
    filename: "rpt_extra/hmis033_weekly_epid_surv_under_5.jasper",
    option: "date-range",
  },
  {
    key: "reports.hmis108_inpatient_diagnosis_out",
    code: "HMIS 108",
    filename: "rpt_extra/hmis108_adm_by_diagnosisOut.jasper",
    option: "month-year",
  },
  {
    key: "reports.hmis108_inpatient_diagnosis_in",
    code: "HMIS 108",
    filename: "rpt_extra/hmis108_adm_by_diagnosisIn.jasper",
    option: "month-year",
  },
  {
    key: "reports.moh705b_over5",
    code: "MOH 705B",
    filename: "rpt_extra/MOH705B_Over_5_Years_Daily_Outpatient_Morbidity_Summary_Sheet.jasper",
    option: "month-year",
  },
  {
    key: "reports.hmis108_inpatient_monthly",
    code: "HMIS 108",
    filename: "rpt_extra/hmis108_cover.jasper",
    option: "date-range",
  },
  {
    key: "reports.moh717_page2",
    code: "MOH 717",
    filename: "rpt_extra/MOH717_Monthly_Workload_Report_for_Hospitals_page2.jasper",
    option: "month-year",
  },
  {
    key: "reports.moh717_page2b",
    code: "MOH 717",
    filename: "rpt_extra/MOH717_Monthly_Workload_Report_for_Hospitals_page2b.jasper",
    option: "month-year",
  },
];

export interface IReportDownload {
  option: ReportOptions;
  filename: string;
  title: string;
}


export type ReportOptions = "date-range" | "month-year";