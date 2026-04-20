"use client";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import api from "@/lib/api";
import { useEffect, useMemo, useState } from "react";

export default function ComboBoxPopupComponent({ value = [], onChange }) {
  const anchor = useComboboxAnchor();
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const selectedIds = useMemo(() => value.map((id) => Number(id)), [value]);

  const fetchOptions = async (query = "") => {
    try {
      const response = await api.get("/category/list", {
        params: { search: query },
      });
      setOptions(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchOptions(searchTerm);
    }, 300);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  useEffect(() => {
    setSelectedOptions((prev) => {
      const fromOptions = options.filter((item) =>
        selectedIds.includes(item.id),
      );
      const missing = prev.filter(
        (item) =>
          selectedIds.includes(item.id) &&
          !fromOptions.some((i) => i.id === item.id),
      );
      return [...fromOptions, ...missing];
    });
  }, [options, selectedIds]);

  return (
    <Combobox
      multiple
      items={options}
      value={selectedIds}
      onValueChange={(vals) => {
        const normalized = vals.map((id) => Number(id));
        const selectedFromList = options.filter((item) =>
          normalized.includes(item.id),
        );
        setSelectedOptions((prev) => {
          const missing = prev.filter(
            (item) =>
              normalized.includes(item.id) &&
              !selectedFromList.some((i) => i.id === item.id),
          );
          return [...selectedFromList, ...missing];
        });

        if (onChange) {
          console.log(normalized);
          onChange(normalized);
        }
      }}
    >
      <ComboboxChips ref={anchor} className="w-full">
        <ComboboxValue>
          {() => (
            <>
              {selectedOptions.map((cat) => (
                <ComboboxChip key={cat.id}>{cat.name}</ComboboxChip>
              ))}
              <ComboboxChipsInput
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search categories..."
              />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>

      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No categories found.</ComboboxEmpty>
        <ComboboxList>
          {options.map((item) => (
            <ComboboxItem key={item.id} value={item.id}>
              {item.name}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
