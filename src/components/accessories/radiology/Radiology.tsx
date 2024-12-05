import { useAppDispatch } from "libraries/hooks/redux";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";

export const Radiology = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const infoBoxRef = useRef<HTMLDivElement>(null);

  return (
    <div className="radiology">
      <span>Radiology section</span>
      <Outlet />
    </div>
  );
};
