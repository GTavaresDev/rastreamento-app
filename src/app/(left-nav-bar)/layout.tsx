import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import {
  HeaderBackButton,
  HeaderPageTitle,
} from "@/components/layout/HeaderBackButton";
import { HeaderTrackingSearch } from "@/components/layout/HeaderTrackingSearch";
import { TrackingSearchProvider } from "@/components/layout/TrackingSearchContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <TrackingSearchProvider>
        <div className="flex flex-1 flex-col min-w-0">
          {/* Fixed Top Header */}
          <header className="sticky top-0 z-30 grid h-16 w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3 justify-self-start">
              <SidebarTrigger className="md:hidden" />
              <HeaderBackButton />
            </div>
            <div className="min-w-0 px-3 text-center">
              <HeaderPageTitle />
              <HeaderTrackingSearch />
            </div>
            <p className="hidden justify-self-end text-xs font-semibold uppercase tracking-wider text-slate-400 lg:block">
              Consulta de encomendas por CPF
            </p>
          </header>

          {/* Page Content */}
          <main className="w-full flex-1 p-0">
            {children}
          </main>
        </div>
      </TrackingSearchProvider>
    </SidebarProvider>
  );
}
