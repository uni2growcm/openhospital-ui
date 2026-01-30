import React from "react";
import "./styles.scss";

export interface MedicalItemCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  dataCy?: string;
}

export function MedicalItemCard({
  title,
  value,
  icon,
  dataCy,
}: MedicalItemCardProps) {
  return (
    <div className="medicalItemCard" data-cy={dataCy}>
      <div className="medicalItemCard__header">
        <h3 className="medicalItemCard__title">{title}</h3>
        {icon && <div className="medicalItemCard__icon">{icon}</div>}
      </div>
      <div className="medicalItemCard__value">{value}</div>
    </div>
  );
}
