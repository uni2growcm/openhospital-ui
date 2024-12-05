import { useAppDispatch } from "libraries/hooks/redux";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";

export const Radiology = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const infoBoxRef = useRef<HTMLDivElement>(null);

  return <div className="radiology">Radiology section</div>;
};
