import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOrderConfirmationEmail = async (
    email: string,
    orderId: string,
    amount: number,
    items: any[]
) => {
    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is missing. Email skipped.");
        return;
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'TrueLine Dynamics <onboarding@resend.dev>', // Use 'onboarding' for dev testing
            to: [email],
            subject: `Order Confirmed: #${orderId}`,
            html: `
        <h1>Thank you for your order!</h1>
        <p>Your order <strong>#${orderId}</strong> has been confirmed.</p>
        <p>Total: <strong>R ${(amount).toFixed(2)}</strong></p>
        <hr />
        <h3>Items:</h3>
        <ul>
          ${items.map(item => `<li>${item.quantity}x ${item.name}</li>`).join('')}
        </ul>
        <br />
        <p>We will notify you when your order ships.</p>
      `,
        });

        if (error) {
            console.error("Resend Email Error:", error);
        } else {
            console.log("Email sent successfully:", data);
        }
    } catch (err) {
        console.error("Email Sending Exception:", err);
    }
};

interface ShippingAddress {
    full_address?: string;
    street?: string;
    city?: string;
    province?: string;
    postal_code?: string;
}

export const sendAdminOrderNotification = async (
    adminEmail: string,
    orderId: string,
    customerEmail: string,
    amount: number,
    items: any[],
    shippingAddress: ShippingAddress | null
) => {
    if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is missing. Admin notification skipped.");
        return;
    }

    const addressHtml = shippingAddress ? `
        <h3>Shipping Address:</h3>
        <p>${shippingAddress.full_address || 'N/A'}</p>
        <p>City: ${shippingAddress.city || 'N/A'} | Postal: ${shippingAddress.postal_code || 'N/A'}</p>
    ` : '<p><em>No shipping address provided</em></p>';

    try {
        const { data, error } = await resend.emails.send({
            from: 'TrueLine Dynamics <onboarding@resend.dev>',
            to: [adminEmail],
            subject: `🚀 NEW ORDER: #${orderId} - R ${amount.toFixed(2)}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h1 style="color: #4ADE80;">New Order Received!</h1>
            <p>A new order has been placed and paid.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="background: #f5f5f5;">
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Order ID</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">#${orderId}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Customer</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${customerEmail}</td>
                </tr>
                <tr style="background: #f5f5f5;">
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Total</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>R ${amount.toFixed(2)}</strong></td>
                </tr>
            </table>

            <h3>Items Ordered:</h3>
            <ul>
                ${items.map(item => `<li>${item.quantity}x ${item.name} - R ${((item.price * item.quantity) / 100).toFixed(2)}</li>`).join('')}
            </ul>

            ${addressHtml}

            <hr />
            <p style="color: #888; font-size: 12px;">
                This is an automated notification from TrueLine Dynamics.
            </p>
        </div>
      `,
        });

        if (error) {
            console.error("Admin Notification Email Error:", error);
        } else {
            console.log("Admin notification sent successfully:", data);
        }
    } catch (err) {
        console.error("Admin Email Sending Exception:", err);
    }
};
