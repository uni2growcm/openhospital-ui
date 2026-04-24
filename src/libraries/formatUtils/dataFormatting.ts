import moment from "moment";
import { DiseaseDTO, WardDTO } from "../../generated";
import { parseDate } from "../formDataHandling/functions";

export const opdDataFormatter = (
  data: Record<string, any>,
  diseases: DiseaseDTO[] | undefined
) => {
  /**
   * get entire disease object from code
   */
  data.disease = diseases?.find((el) => el.code === data.disease);
  data.disease2 =
    diseases &&
    data.disease2 !== "" &&
    diseases?.find((el) => el.code === data.disease2);
  data.disease3 =
    diseases && data.disease3 !== ""
      ? diseases.find((el) => el.code === data.disease3)
      : null;
  data.date = parseDate(data.date);
  return data;
};

export const visitDataFormatter = (
  data: Record<string, any>,
  wards: WardDTO[] | undefined
) => {
  /**
   * get entire disease object from code
   */
  data.ward = wards?.find((el) => el.code === data.ward);
  data.date = parseDate(data.date);
  return data;
};

export const renderDate = (date: string) => {
  return moment(date).isValid()
    ? moment(date).format("DD/MM/YYYY HH:mm:ss")
    : "";
};

export const renderDateTime = (date: string) => {
  return moment(date).isValid()
    ? moment(date).format("DD/MM/YYYY HH:mm:ss")
    : "";
};

export const unformatRenderDate = (value: string) => {
  return moment(value, "DD/MM/YYYY").isValid()
    ? moment(value, "DD/MM/YYYY").toDate()
    : undefined;
};

export const combineData: any = (data: any) => {
  return Object.entries(data).reduce(
    (r, [k, v]) => ({
      ...r,
      [k]: v,
    }),
    {}
  );
};

export const sortAndSlice: any = (data: any) => {
  return Object.entries(data)
    .sort(([, a], [, b]) => (b as number) - +(a as number))
    .slice(0, 10)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
};

export function getLocalISOString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const ms = String(date.getMilliseconds()).padStart(3, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${ms}Z`;
}
