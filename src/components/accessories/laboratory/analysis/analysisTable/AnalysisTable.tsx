import { type FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import { renderDateTime } from "../../../../../libraries/formatUtils/dataFormatting";
import Table from "../../../table/Table";
import { analysisDTO, AnalysisDTO, AnalysisItemDTO } from "~/mocks/fixtures/analysisDTO";
interface IOwnProps {
  handlePrint: (row: any) => void;
}

const AnalysisTable: FunctionComponent<IOwnProps> = ({ handlePrint }) => {
  const { t } = useTranslation();
  const [data, setData] = useState<AnalysisDTO>(analysisDTO);

  const header = ["id_rec","date_prescr"];
  const dateFields = ["date_prescr"];

  const label = {
    id_rec: t("analysis.id_rec"),
    type_rec: t("analysis.type_rec"),
    date_prescr: t("analysis.date_prescr"),
    analysis: t("analysis.analysis"),
    rec_num: t("analysis.rec_num"),
    variable: t("analysis.variable"),
    result: t("analysis.result"),
  };
  const order = ["id_rec", "date_prescr"];

  const formatDataToDisplay = (data: AnalysisItemDTO[]) => {
    return data.map((item) => {
      return {
        id_rec: item.id_rec ?? 0,
        type_rec: item.type_rec ?? "",
        date_prescr: item.date_prescr ? renderDateTime(item.date_prescr) : "",
        analysis: item.analysis ?? "",
        rec_num: item.rec_num ?? "",
        variable: item.variable ?? "",
        result: item.result ?? "",
      };
    });
  };

  return (
    <div className="patientAnalysisTable">
      <h5>{t("analysis.previousentries")}</h5>
        <Table
          rowData={formatDataToDisplay(data.analyzes)}
          dateFields={dateFields}
          tableHeader={header}
          labelData={label}
          columnsOrder={order}
          rowsPerPage={5}
          isCollapsabile={true}
          onPrint={handlePrint}
          initialOrderBy="disDate"
          showEmptyCell={false}
        />
    </div>
  );
};

export default AnalysisTable;
