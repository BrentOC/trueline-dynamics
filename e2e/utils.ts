import { createClient } from '@supabase/supabase-js';
import { loadEnvConfig } from '@next/env';

// Load environment variables from .env.local
loadEnvConfig(process.cwd());

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables in .env.local');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function seedProduct() {
    const { data: existing } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('name', 'E2E Test Product')
        .single();

    if (existing) {
        // Ensure stock is sufficient
        const { error: updateError } = await supabaseAdmin
            .from('products')
            .update({ stock_quantity: 100000, stock_count: 100000 })
            .eq('id', existing.id);

        if (updateError) console.error("Error resetting stock:", updateError);
        return { ...existing, stock_quantity: 100000 };
    }

    const { data, error } = await supabaseAdmin
        .from('products')
        .insert({
            name: 'E2E Test Product',
            price: 9999,
            description: 'Created by E2E tests',
            category: 'End Mills',
            stock_quantity: 100,
            stock_count: 100,
            specifications: {
                cut_diameter: '10mm',
                shank_diameter: '10mm',
                flutes: 4,
                coating: 'TiAlN'
            }
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function seedOrder(userId: string, email: string) {
    const product = await seedProduct();

    // Create unique reference
    const reference = `TEST_REF_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const { data, error } = await supabaseAdmin.rpc('fulfill_order', {
        p_payment_ref: reference,
        p_user_id: userId,
        p_user_email: email,
        p_amount: (product.price / 100) * 1, // 1 item
        p_items: [{
            id: product.id,
            name: product.name,
            quantity: 1,
            price: product.price
        }]
    });

    if (error) {
        console.error("Error seeding order:", error);
        throw error;
    }

    if (data && data.status !== 'SUCCESS') {
        console.error("RPC returned non-success status:", data);
        throw new Error(`fufill_order RPC failed with status: ${data.status}`);
    }

    return data; // Should return the Order ID or status
}

export async function makeUserAdmin(userId: string) {
    // 1. Ensure profile exists (handle potential trigger delay)
    let retries = 5;
    while (retries > 0) {
        const { data } = await supabaseAdmin.from('profiles').select('id').eq('id', userId).single();
        if (data) break;
        await new Promise(r => setTimeout(r, 500));
        retries--;
    }

    // 2. Update role
    const { error } = await supabaseAdmin
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', userId);

    if (error) {
        console.error("Error making user admin:", error);
        throw error;
    }

    // 3. Verify
    const { data: verify } = await supabaseAdmin.from('profiles').select('role').eq('id', userId).single();
    if (verify?.role !== 'admin') {
        // Force insert if update failed (e.g. if profile still didn't exist)
        const { error: insertError } = await supabaseAdmin.from('profiles').upsert({ id: userId, role: 'admin' });
        if (insertError) throw new Error(`Failed to force admin role: ${insertError.message}`);
    }
}

export async function findUser(email: string) {
    // List up to 1000 users to find the new one.
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    if (error) throw error;
    return data.users.find(u => u.email === email);
}

export async function seedUser(email: string, password: string) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: 'Seeded Tester' }
    });
    if (error) throw error;
    return data.user;
}

export async function deleteTestUser(email: string) {
    const user = await findUser(email);
    if (user) {
        const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);
        if (error) console.error('Error deleting test user:', error);
    }
}
