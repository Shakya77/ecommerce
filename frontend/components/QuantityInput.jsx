import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";

export function QuantityInput({ value, onChange, min = 1 }) {
  const increment = () => onChange(value + 1);

  const decrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleChange = (val) => {
    const num = Number(val);
    if (!isNaN(num) && num >= min) {
      onChange(num);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="icon" onClick={decrement}>
        <Minus className="h-4 w-4" />
      </Button>

      <Input
        type="number"
        min={min}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="w-16 text-center"
      />

      <Button variant="outline" size="icon" onClick={increment}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
