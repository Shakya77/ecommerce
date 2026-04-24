import { Atom } from "react-loading-indicators";
import { cn } from "@/lib/utils";

export default function Loader({
  fullScreen = true,
  className = "",
  size = "medium",
  color = "#474947",
}) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center backdrop-blur-sm">
        <Atom color={color} size={size} text="" textColor="" />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Atom color={color} size={size} text="" textColor="" />
    </div>
  );
}
