import { CommuneDTO } from "generated";
import { ReactNode } from "react";

export interface IProps {
  headerActions?: ReactNode;
  onEdit?: (commune: CommuneDTO) => void;
}