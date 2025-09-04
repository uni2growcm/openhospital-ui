import { ConditioningDTO } from "generated";
import { useAppDispatch, useAppSelector } from "libraries/hooks/redux";
import React, { FunctionComponent, useEffect, useState } from "react";
import { updateConditioning } from "state/conditionings";
import { IState } from "types";
import { CurrentConditioningData } from "./currentConditioningData/CurrentConditioningData";
import "./styles.scss";
import { IOwnProps } from "./types";

export const CurrentConditioning: FunctionComponent<IOwnProps> = ({
  onEditChange,
  onEditConditioning,
}) => {
  const dispatch = useAppDispatch();
  const [editionMode, setEditionMode] = useState(false);

  const currentConditioning = useAppSelector(
    (state: IState) => state.conditioning.getLastConditioningByPatientCode?.data
  );

  const handleEdit = () => {
    onEditConditioning && onEditConditioning(currentConditioning);
  };

  const handleDiscard = () => {
    setEditionMode(false);
  };

  const onSubmit = (cond: ConditioningDTO) => {
    let conditioningToSave: ConditioningDTO = {
      ...currentConditioning,
      ...cond,
    };

    if (conditioningToSave.id) {
      dispatch(
        updateConditioning({
          id: conditioningToSave.id,
          body: conditioningToSave,
        })
      );
    } else {
      console.error("No ID found for conditioning update");
    }
  };

  useEffect(() => {
    if (onEditChange) {
      onEditChange(editionMode);
    }
  }, [editionMode, onEditChange]);

  return (
    <div className="currentConditioning">
      {currentConditioning && !editionMode && (
        <CurrentConditioningData
          onEdit={onEditChange ? handleEdit : undefined}
          conditioning={currentConditioning}
        />
      )}
      {/* {currentConditioning && editionMode && (
        <CurrentConditioningForm
          fields={initialFields(currentConditioning)}
          onSubmit={onSubmit}
          onDiscard={handleDiscard}
        />
      )} */}
    </div>
  );
};
