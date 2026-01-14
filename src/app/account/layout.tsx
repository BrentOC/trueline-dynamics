
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// We want our account pages to have the header and footer, 
// which they will inherit from root layout. 
// But if we want a specific layout for account area (sidebar etc), we can add it here.
// For now, we will just pass children through.

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-[#0a0a0a]">
            {children}
        </div>
    );
}
