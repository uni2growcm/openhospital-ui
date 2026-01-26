import { MedicalWardDTO } from "generated";

export type WardStockItem = {
  code: number;
  description: string;
  wardCode: string;
  quantity: number;
  inqty: number;
  outqty: number;
  lots?: {
    code: string;
  }[];
};

export type RectifyQuantityModalProps = {
  open: boolean;
  onClose: () => void;
  pharmaceutical: MedicalWardDTO | undefined;
  loading?: boolean;
};
