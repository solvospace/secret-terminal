import Footer from "./_components/footer";
import Header from "./_components/header";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <main className="main-container">
            <Header />

            {children}

            <Footer />
        </main>
    );
}
