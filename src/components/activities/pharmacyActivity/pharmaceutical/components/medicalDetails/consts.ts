import { MedicalItemData } from "./types";

export const getPharmacyData = (medical: any): MedicalItemData[] => [
  {
    title: "pharmacy.medicalDetails.pharmaceuticalStock",
    value: medical?.initialqty ?? 0,
  },
  {
    title: "pharmacy.medicalDetails.lotsExpiringThisMonth",
    value: medical?.lots?.length ?? 0,
  },
  {
    title: "pharmacy.medicalDetails.criticalLevel",
    value: medical?.minqty ?? 0,
    removeIcon: true,
  },
  {
    title: "pharmacy.medicalDetails.amc",
    value: medical?.outqty ?? 0,
    icon: "up",
  },
];

export const getWardsData = (medical: any): MedicalItemData[] => [
  {
    title: "pharmacy.medicalDetails.stockInInternalMedicine",
    value: Math.floor((medical?.inqty ?? 0) * 0.3),
  },
  {
    title: "pharmacy.medicalDetails.stockInMaternity",
    value: Math.floor((medical?.inqty ?? 0) * 0.25),
  },
  {
    title: "pharmacy.medicalDetails.stockInNursery",
    value: Math.floor((medical?.inqty ?? 0) * 0.2),
  },
  {
    title: "pharmacy.medicalDetails.stockInSurgery",
    value: Math.floor((medical?.inqty ?? 0) * 0.25),
  },
];
