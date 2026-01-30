export interface PharmacyCardItem {
  title: string;
  value: string | number;
}

export interface PharmacyDataItem {
  title: string;
  value: number;
  icon?: "up" | "down";
  removeIcon?: boolean;
}

export interface WardDataItem {
  title: string;
  value: number;
}
