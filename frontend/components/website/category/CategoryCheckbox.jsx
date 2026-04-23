import { Checkbox } from "@/components/ui/checkbox";

export default function CategoryCheckbox({ id, name, checked, onChange }) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 text-sm font-normal">
      <Checkbox
        id={id}
        name={name}
        checked={checked}
        onCheckedChange={(value) => onChange(id, value)}
      />
      <span className="lowercase">{name}</span>
    </label>
  );
}
