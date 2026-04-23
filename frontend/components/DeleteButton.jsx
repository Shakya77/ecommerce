import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function DeleteButton({
  isDeleting = false,
  onDelete,
  confirm = false,
  confirmTitle = "Delete this item?",
  confirmDescription = "This action cannot be undone. The item will be removed.",
  confirmActionLabel = "Delete",
  size = "icon",
  className = "",
}) {
  const handleDelete = async () => {
    await onDelete?.();
  };

  const triggerButton = (
    <Button
      variant="ghost"
      size={size}
      disabled={isDeleting}
      className={`hover:bg-red-50 hover:text-red-600 transition-all duration-300 h-12 w-12 ${className}`}
    >
      {isDeleting ? (
        <span className="text-xs">...</span>
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </Button>
  );

  if (confirm) {
    return (
      <Dialog>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{confirmTitle}</DialogTitle>
            <DialogDescription>{confirmDescription}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isDeleting}>
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : confirmActionLabel}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleDelete}
      disabled={isDeleting}
      className={`hover:bg-red-50 hover:text-red-600 transition-all duration-300 h-12 w-12 ${className}`}
    >
      {isDeleting ? (
        <span className="text-xs">...</span>
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
    </Button>
  );
}
