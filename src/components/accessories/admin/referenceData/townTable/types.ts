
import { TownDTO } from "generated";
import { ReactNode } from "react";

export interface IProps {
  headerActions?: ReactNode;
  onEdit?: (town: TownDTO) => void;
}