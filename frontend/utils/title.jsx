"use client";

import { useEffect } from "react";

export const TitleChange = ({ actualTitle = "Ecommerce" }) => {
  useEffect(() => {
    document.title = actualTitle;
  }, [actualTitle]);

  return null;
};
