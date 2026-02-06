import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

// Schema Validation
const CartItemSchema = z.object({
    id: z.number(),
    quantity: z.number().min(1),
});

const CheckoutSchema = z.object({
    items: z.array(CartItemSchema),
    email: z.string().email(),
    userId: z.string().optional().nullable(),
});

export async function POST(request: Request) {
    try {
        // 1. Validate Request Body
        const body = await request.json();
        const validation = CheckoutSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: "Invalid request body", details: validation.error.format() },
                { status: 400 }
            );
        }

        const { items, email, userId } = validation.data;

        // 2. Fetch Prices from Database (Trust No One)
        const supabase = await createClient();
        const productIds = items.map((item) => item.id);

        const { data: products, error: dbError } = await supabase
            .from("products")
            .select("id, name, price, stock_count") // Select relevant fields
            .in("id", productIds);

        if (dbError || !products) {
            throw new Error("Failed to fetch product details from database.");
        }

        // 3. Calculate Total & Verify Stock
        let totalAmount = 0;
        const verifiedItems = [];

        for (const item of items) {
            const dbProduct = products.find((p) => p.id === item.id);

            if (!dbProduct) {
                throw new Error(`Product with ID ${item.id} not found.`);
            }

            // Inventory Check (Enterprise Requirement)
            if (
                dbProduct.stock_count !== null &&
                dbProduct.stock_count !== undefined &&
                dbProduct.stock_count < item.quantity
            ) {
                throw new Error(
                    `Insufficient stock for ${dbProduct.name}. Available: ${dbProduct.stock_count}`
                );
            }

            totalAmount += dbProduct.price * item.quantity;
            verifiedItems.push({
                id: dbProduct.id,
                name: dbProduct.name,
                quantity: item.quantity,
                price: dbProduct.price, // Store the verified price for metadata
            });
        }

        const amountInCents = totalAmount; // Already in cents from DB

        // 4. Initialize Paystack Transaction
        const response = await fetch(
            "https://api.paystack.co/transaction/initialize",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    amount: amountInCents,
                    currency: "ZAR",
                    callback_url: `${request.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success`,
                    metadata: {
                        user_id: userId,
                        cart_items: verifiedItems, // Send VERIFIED items back to webhook
                    },
                }),
            }
        );

        const data = await response.json();

        if (!data.status) {
            throw new Error(data.message || "Paystack initialization failed.");
        }

        return NextResponse.json({ url: data.data.authorization_url });
    } catch (err: any) {
        console.error("Checkout API Error:", err);
        return NextResponse.json(
            { error: err.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}