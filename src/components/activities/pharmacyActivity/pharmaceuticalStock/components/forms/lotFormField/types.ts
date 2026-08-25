import { LotDTO, MedicalDTO } from "generated";
import { Control, Path } from "react-hook-form";

export type LotFormValue = Omit<
  LotDTO,
  "preparationDate" | "dueDate"
> & {
  preparationDate: Date | undefined;
  dueDate: Date | undefined;
};

export type LotFormFieldProps<T extends Record<string, any>> = {
  medical: MedicalDTO;
  control: Control<T>;
  name: Path<T>;
  showNewLotOption?: boolean;
  showMainStoreQuantity?: boolean;
  showWardTotalQuantity?: boolean;
  hideQty?: boolean;
  onLotChange?: (lot: LotFormValue) => void;
};
