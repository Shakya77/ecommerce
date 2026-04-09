import { Atom } from "react-loading-indicators";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-9999 flex h-screen w-screen items-center justify-center bg-black/50 backdrop-blur-[8px]">
      <Atom color="#474947" size="medium" text="" textColor="" />
    </div>
  );
}
