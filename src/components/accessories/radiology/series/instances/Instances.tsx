import Table from "components/accessories/table/Table";
import { InstanceResponse } from "generated";
import { useAppDispatch } from "libraries/hooks/redux";
import moment from "moment";
import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router";
import "./styles.scss";

interface IOwnProps {
  data: InstanceResponse[];
}

export const Instances = ({ data }: IOwnProps) => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams();

  const { state: study } = useLocation();

  const header = ["title", "date", "time"];

  const label = {
    title: t("radiology.instances.title"),
    date: t("radiology.instances.date"),
    time: t("radiology.instances.time"),
  };

  const order = ["title", "date", "time"];

  const formatDataToDisplay = (data: InstanceResponse[]) => {
    return data.map((instance) => {
      return {
        id: instance.id ?? "",
        title: t("radiology.instances.title", {
          number: instance.instance?.instanceNumber ?? "",
        }),
        date: instance.instance?.creationDate
          ? moment(instance.instance.creationDate, "YYYYMMDD")
              .locale(i18n.language)
              .format("L")
          : "",
        time: instance.instance?.creationTime
          ? moment(instance.instance?.creationTime, "HHmmss")
              .locale(i18n.language)
              .format("LTS")
          : "",
        fileUid: instance.fileUuid ?? "",
      };
    });
  };

  return (
    <div className="instances">
      <Table
        columnsOrder={order}
        rowData={formatDataToDisplay(data)}
        tableHeader={header}
        labelData={label}
        rowsPerPage={data.length}
        isCollapsabile={false}
        renderCustomActions={(row) => <></>}
        hideHeader={true}
        hidePaginator={true}
      />
    </div>
  );
};
