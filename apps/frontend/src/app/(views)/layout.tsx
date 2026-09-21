import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import LoadingBar from "@/components/layout/loading-bar";
import { UserContextProvider } from "@/contexts/user.context";
import { LoadingContextProvider } from "@/contexts/loading.context";
import { TouchDetectorContextProvider } from "@/contexts/touch-detector.context";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";

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
                                        "--sidebar-width": "220px",
                                        "--sidebar-width-mobile": "220px",
                                    } as React.CSSProperties
                                }
                            >
                                <AppSidebar />

                                <main className="main-content">
                                    <div className="container">{children}</div>

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
