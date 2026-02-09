import { MedicalDTO } from "generated";
import { MedicalItemDataprops } from "./types";

export const getPharmacyData = (
  medical: MedicalDTO
): MedicalItemDataprops[] => [
  {
    title: "pharmacy.medicalDetails.pharmaceuticalStock",
    value: medical?.inqty ?? 0,
  },
  {
    title: "pharmacy.medicalDetails.lotsExpiringThisMonth",
    value:
      medical?.lots?.filter((lot) => {
        if (!lot.dueDate) return false;
        const dueDate = new Date(lot.dueDate);
        const now = new Date();
        return (
          dueDate.getFullYear() === now.getFullYear() &&
          dueDate.getMonth() === now.getMonth()
        );
      }).length ?? 0,
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
