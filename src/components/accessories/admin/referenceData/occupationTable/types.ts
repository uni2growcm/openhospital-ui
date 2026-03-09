import { OccupationDTO } from "generated";
import { ReactNode } from "react";

export interface IProps {
  headerActions?: ReactNode;
  onEdit?: (occupation: OccupationDTO) => void;
}