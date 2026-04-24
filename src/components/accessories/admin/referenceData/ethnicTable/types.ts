import { EthnicDTO } from "generated";
import { ReactNode } from "react";

export interface IProps {
  headerActions?: ReactNode;
  onEdit?: (ethnic: EthnicDTO) => void;
}