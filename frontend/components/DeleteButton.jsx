import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DeleteButton({
  isDeleting: controlledDeleting,
  onDelete,
  confirm = false,
  size = "icon",
  className = "",
}) {
  const [internalDeleting, setInternalDeleting] = useState(false);

  const isDeleting =
    controlledDeleting !== undefined ? controlledDeleting : internalDeleting;

  const handleDelete = async () => {
    if (confirm) {
      const ok = window.confirm("Are you sure you want to delete?");
      if (!ok) return;
    }

    try {
      if (controlledDeleting === undefined) {
        setInternalDeleting(true);
      }

      await onDelete?.();
    } finally {
      if (controlledDeleting === undefined) {
        setInternalDeleting(false);
      }
    }
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleDelete}
      disabled={isDeleting}
      className={`hover:bg-red-50 hover:text-red-600 transition-all duration-300 h-12 w-12 ${className}`}
    >
      {isDeleting ? (
        <span className="text-xs">...</span> // or spinner
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </Button>
  );
}
