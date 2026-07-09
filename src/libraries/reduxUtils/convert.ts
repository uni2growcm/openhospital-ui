import { MedicalDTO } from "../../generated";
import { renderDateTime } from "../formatUtils/dataFormatting";
import { SummaryFieldType } from "./SummaryFieldType";

export const convertToSummaryData = (
  data: Array<any>,
  field: SummaryFieldType
) => {
  const res = data.map(({ ...rest }) => ({
    ...rest,
    type: field.type,
    date: rest[field.dateField],
  }));
  return res;
};

export const renderSummary = (
  data: any[],
  dateFields: string[],
  labels: any,
  medicals: MedicalDTO[] = []
) => {
  const itemRender = (item: any) => {
    const obj: any = {};
    Object.keys(labels).forEach((field: string) => {
      const value = item[field];
      if (Array.isArray(value)) {
        obj[field] = value.join(", ");
      } else if (typeof value === "object" && value !== null) {
        obj[field] = value?.description ?? "";
      } else if (dateFields.includes(field) && value) {
        obj[field] = renderDateTime(value);
      } else if (field === "medicalId" && value) {
        obj[field] =
          medicals.find((medoc) => medoc.code === value)?.description ??
          value;
      } else if (typeof value === "boolean") {
        obj[field] = value ? "Yes" : "No";
      } else if (value) {
        obj[field] = value;
      }
      return obj[field];
    });
    if (item["type"] === "OPD") {
      obj["opdDate"] = item["date"];
    }
    if (item["type"] === "VISIT") {
      obj["visitDate"] = item["date"];
    }
    return obj;
  };
  return data.map((item: any) => {
    return itemRender(item);
  });
};
