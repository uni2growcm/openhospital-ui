import { Download } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { downloadBlob } from "libraries/downloadUtils/downloadUtils";
import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import { debounce } from "lodash";
import React, { FC, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  printAdmissionReport,
  printDeathReport,
  printDischargesReport,
  printPathologiesByAgeGenderReport,
  printPathologiesReport,
} from "state/statistics";
import { PATHS } from "../../../consts";
import { Permission } from "../../../libraries/permissionUtils/Permission";
import AppHeader from "../../accessories/appHeader/AppHeader";
import Footer from "../../accessories/footer/Footer";
import InfoBox from "../infoBox/InfoBox";
import GetDownloadDateDialog from "./getDownloadDateDialog/GetDownloadDateDialog";
import {
  IReportDownload,
  PrintProperties,
  reports,
} from "./getDownloadDateDialog/types";
import "./styles.scss";

const ReportActivity: FC = () => {
  const { t } = useTranslation();
  const breadcrumbMap = useMemo(() => {
    return {
      [t("nav.statistics")]: PATHS.statistics,
    };
  }, [t]);

  const dispatch = useAppDispatch();

  const userCredentials = useAppSelector(
    (state) => state.main.authentication.data
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const updateDebouncedSearchTerm = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearchTerm(value);
      }, 250),
    []
  );

  useEffect(() => {
    return () => {
      updateDebouncedSearchTerm.cancel();
    };
  }, [updateDebouncedSearchTerm]);

  const filteredReports = useMemo(() => {
    const search = debouncedSearchTerm.trim().toLowerCase();
    if (!search) {
      return reports;
    }
    return reports.filter((report) =>
      [report.code, t(report.key)].join(" ").toLowerCase().includes(search)
    );
  }, [debouncedSearchTerm, t]);

  const [selectedReport, setSelectedReport] = useState<IReportDownload | null>(
    null
  );
  const [isDownloading, setIsDownloading] = useState(false);

  const getReportThunk = (report: IReportDownload) => {
    switch (report.code) {
      case "001":
        return printAdmissionReport;
      case "002":
        return printPathologiesReport;
      case "003":
        return printPathologiesByAgeGenderReport;
      case "004":
        return printDischargesReport;
      case "005":
        return printDeathReport;
      default:
        return null;
    }
  };

  const getDownloadFilename = (report: IReportDownload) => {
    const cleanTitle = report.title
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase();
    return `${cleanTitle}-${new Date().getTime()}.pdf`;
  };

  const isDateRangePayload = (
    payload: PrintProperties
  ): payload is { date: string; dateFrom: string; dateTo: string } => {
    return "dateFrom" in payload && "dateTo" in payload;
  };

  const handleDownloadDialogConfirm = (payload: PrintProperties) => {
    if (!selectedReport) {
      return;
    }

    const thunk = getReportThunk(selectedReport);
    if (!thunk) {
      console.warn("No report thunk available for", selectedReport.code);
      setSelectedReport(null);
      return;
    }

    if (!isDateRangePayload(payload)) {
      console.warn("Unsupported report payload:", payload);
      setSelectedReport(null);
      return;
    }

    const thunkPayload = {
      fromDate: payload.dateFrom,
      toDate: payload.dateTo,
    };

    console.log(thunkPayload);

    setIsDownloading(true);
    dispatch(thunk(thunkPayload))
      .unwrap()
      .then((result) => {
        if (result instanceof Blob) {
          downloadBlob(result, getDownloadFilename(selectedReport));
        }
      })
      .finally(() => {
        setIsDownloading(false);
        setSelectedReport(null);
      });
  };

  return (
    <div className="reports">
      <AppHeader
        userCredentials={userCredentials}
        breadcrumbMap={breadcrumbMap}
      />
      <div className="reports__container">
        <div className="reports__content">
          <div className="reports__header">
            <div className="reports__title">{t("reports.title")}</div>
          </div>
          <Permission require="statistics.access">
            <div className="reports__accordion">
              <TextField
                label={t("reports.selectReport")}
                value={searchTerm}
                onChange={(event) => {
                  const value = event.target.value;
                  setSearchTerm(value);
                  updateDebouncedSearchTerm(value);
                }}
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {searchTerm && (
                        <IconButton
                          aria-label="clear search"
                          edge="end"
                          size="small"
                          onClick={() => {
                            setSearchTerm("");
                            updateDebouncedSearchTerm("");
                          }}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
              <div className="reports__list">
                {filteredReports.length > 0 ? (
                  filteredReports.map((report, index) => (
                    <div key={index} className="reports__item">
                      <div className="reports__item-name">{report.code}</div>
                      <div className="reports__item-description">
                        {t(report.key)}
                      </div>
                      <div className="reports__item-actions">
                        <IconButton
                          size="small"
                          color="primary"
                          type="button"
                          disabled={isDownloading}
                          onClick={() => {
                            setSelectedReport({
                              code: report.code,
                              title: `${report.code} - ${t(report.key)}`,
                              option: report.option,
                            });
                          }}
                        >
                          <Download fontSize="small" />
                        </IconButton>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>
                    <InfoBox type="info" message={t("common.noreportsfound")} />
                  </div>
                )}
              </div>
            </div>
          </Permission>
        </div>
      </div>
      <GetDownloadDateDialog
        option={selectedReport ? selectedReport.option : "date-range"}
        title={t("reports.downloadReport")}
        primaryButtonLabel={t("reports.download")}
        secondaryButtonLabel={t("common.close")}
        handlePrimaryButtonClick={handleDownloadDialogConfirm}
        handleSecondaryButtonClick={() => setSelectedReport(null)}
        loading={isDownloading}
        isOpen={!!selectedReport}
      />
      <Footer />
    </div>
  );
};

export default ReportActivity;
