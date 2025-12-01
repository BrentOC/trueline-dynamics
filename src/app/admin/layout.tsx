// src/app/admin/layout.tsx
import { ensureAdmin } from '@/utils/supabase/admin';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // This runs before ANY admin page loads.
    await ensureAdmin();

    return (
        <>
            {children}
        </>
    );
}