import { useCallback } from "react";

export const useViewMore = (level: "study" | "series" | "instance") => {
  const handleViewMore = useCallback(
    (row: any) => () => {
      window.open(
        `${process.env.REACT_APP_ORTHANC_EXPLORER}#${level}?uuid=${row.id}`,
        "_blank"
      );
    },
    [level]
  );

  return handleViewMore;
};
