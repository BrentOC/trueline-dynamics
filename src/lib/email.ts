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
