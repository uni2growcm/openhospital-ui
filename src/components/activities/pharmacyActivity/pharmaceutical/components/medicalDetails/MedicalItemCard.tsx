import React from "react";
import "./styles.scss";

interface MedicalItemCardProps {
  label: string;
  value: string | number;
}

const MedicalItemCard: React.FC<MedicalItemCardProps> = ({ label, value }) => {
  return (
    <div className="medicalItemCard">
      <div className="medicalItemCard__label">{label}</div>
      <div className="medicalItemCard__value">{value}</div>
    </div>
  );
};

export default MedicalItemCard;
