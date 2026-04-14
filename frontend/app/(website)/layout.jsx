import { NavigationBar } from "@/components/website/Navbar";

export default function layout({ children }) {
  return (
    <>
      <NavigationBar />
      {children}
    </>
  );
}
