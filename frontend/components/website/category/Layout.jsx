import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { fetcher } from "@/constants";
import useSWR from "swr";
import CategoryCheckbox from "./CategoryCheckbox";

export default function Layout() {
  const [checked, setChecked] = useState([]);
  const query = `/categories`;

  const { data, isLoading, error } = useSWR(query, fetcher);

  const handleCheck = (id, value) => {
    setChecked((prev) => {
      if (value) {
        return [...prev, id];
      } else {
        return prev.filter((item) => item !== id); // remove
      }
    });
  };

  useEffect(() => {
    console.log(checked);
  }, [checked]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="grid grid-cols-5 gap-3">
      {data.map((category) => (
        <CategoryCheckbox
          key={category.id}
          id={category.id}
          name={category.name}
          checked={checked.includes(category.id)}
          onChange={handleCheck}
        />
      ))}
    </div>
  );
}
