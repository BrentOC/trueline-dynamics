
import React from 'react';

export default function TermsOfService() {
    return (
        <div className="bg-[#050505] min-h-screen text-gray-300 py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
                <p className="text-sm text-gray-500">Last Updated: {new Date().toLocaleDateString()}</p>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-[#4ADE80]">1. Agreement to Terms</h2>
                    <p>
                        By accessing or using the TrueLine Dynamics website, you agree to be bound by these Terms of Service and our Privacy Policy.
                        If you do not agree to these terms, please do not use our services.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-[#4ADE80]">2. Intellectual Property</h2>
                    <p>
                        The content, organization, graphics, design, compilation, magnetic translation, digital conversion and other matters related to the Site are protected under applicable copyrights, trademarks and other proprietary (including but not limited to intellectual property) rights.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-[#4ADE80]">3. Purchases</h2>
                    <p>
                        If you wish to purchase any product or service made available through the Service ("Purchase"), you may be asked to supply certain information relevant to your Purchase including, without limitation, your credit card number, the expiration date of your credit card, your billing address, and your shipping information.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-[#4ADE80]">4. Limitation of Liability</h2>
                    <p>
                        In no event shall TrueLine Dynamics, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                    </p>
                </section>
            </div>
        </div>
    );
}
