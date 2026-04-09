"use client";

import {
  Combobox,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxChip,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import React, { useState, useEffect } from "react";
import api from "@/lib/api";

export default function ComboBoxPopupComponent() {
  const anchor = useComboboxAnchor();

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState([]);

  // Fetch options from backend
  const fetchOptions = async (query = "") => {
    try {
      const response = await api.get("/category/list", {
        params: { search: query },
      });
      setOptions(response.data); // assuming array of { id, name, code, value, label, continent }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchOptions();
  }, []);

  // Search debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchOptions(searchTerm);
    }, 300);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  return (
    <Combobox
      multiple
      items={options}
      value={selectedCategories.map((c) => c.id)} // store ids
      onValueChange={(vals) => {
        // map ids back to full objects
        const selected = options.filter((o) => vals.includes(o.id));
        setSelectedCategories(selected);
      }}
    >
      <ComboboxChips ref={anchor} className="w-full">
        <ComboboxValue>
          {() => (
            <>
              {selectedCategories.map((cat) => (
                <ComboboxChip key={cat.id}>{cat.name}</ComboboxChip>
              ))}
              <ComboboxChipsInput
                onChange={(e) => setSearchTerm(e.target.value)}
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
