import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import LoadingBar from "@/components/layout/loading-bar";
import { UserContextProvider } from "@/contexts/user.context";
import { LoadingContextProvider } from "@/contexts/loading.context";
import { TouchDetectorContextProvider } from "@/contexts/touch-detector.context";
import { SidebarProvider } from "@/components/ui/sidebar";
import { StSidebar } from "@/components/layout/st-sidebar";
import { sidebarWidth } from "@/constants/app.constants";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="body-wrapper">
            <LoadingContextProvider>
                <LoadingBar>
                    <UserContextProvider>
                        <TouchDetectorContextProvider>
                            <Header />

                            <SidebarProvider
                                style={
                                    {
                                        "--sidebar-width": sidebarWidth,
                                        "--sidebar-width-mobile": sidebarWidth,
                                    } as React.CSSProperties
                                }
                            >
                                <StSidebar />

                                <main className="main-content">
                                    {children}

                                    <Footer />
                                </main>
                            </SidebarProvider>
                        </TouchDetectorContextProvider>
                    </UserContextProvider>
                </LoadingBar>
            </LoadingContextProvider>
        </div>
    );
}
