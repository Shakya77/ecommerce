import { NavigationBar } from "@/components/website/Navbar";
import WebsiteBreadcrumb from "@/components/website/WebsiteBreadcrumb";

export default function layout({ children }) {
  return (
    <>
      <NavigationBar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <WebsiteBreadcrumb />
        {children}
      </div>
    </>
  );
}
