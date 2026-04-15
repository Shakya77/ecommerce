import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";

export default function CategoryCheckbox({ id, name, checked, onChange }) {
  return (
    <>
      <FieldLabel>
        <Field orientation="horizontal">
          <Checkbox
            id={id}
            name={name}
            checked={checked}
            onCheckedChange={(value) => onChange(id, value)}
          />
          <FieldContent>
            <FieldTitle>{name}</FieldTitle>
          </FieldContent>
        </Field>
      </FieldLabel>
    </>
  );
}
