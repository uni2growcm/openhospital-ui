import { Control, Path } from "react-hook-form";
import { MedicalDTO } from "~/generated";

export type LotFormFieldProps<T extends Record<string, any>> = {
  medical: MedicalDTO;
  control: Control<T>;
  name: Path<T>;
  showNewLotOption?: boolean;
  showMainStoreQuantity?: boolean;
  showWardTotalQuantity?: boolean;
  hideQty?: boolean;
};
