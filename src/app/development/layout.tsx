import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { AppBackground } from "@/components/AppBackground";
import { MobileNavProvider } from "@/components/MobileNav";

export default function DevelopmentLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <MobileNavProvider>
      <div className="flex min-h-screen">
        <AppBackground />
        <Sidebar section="development" />
        <div className="flex-1 min-w-0 flex flex-col">
          <Topbar section="development" />
          <main className="flex-1 px-4 py-5 sm:p-6 md:p-8 max-w-[1280px] w-full mx-auto">{children}</main>
        </div>
      </div>
    </MobileNavProvider>
  );
}
