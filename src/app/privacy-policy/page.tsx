
import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="bg-[#050505] min-h-screen text-gray-300 py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
                <p className="text-sm text-gray-500">Last Updated: {new Date().toLocaleDateString()}</p>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-[#4ADE80]">1. Introduction</h2>
                    <p>
                        Welcome to TrueLine Dynamics. We respect your privacy and are committed to protecting your personal data.
                        This privacy policy will inform you as to how we look after your personal data when you visit our website
                        and tell you about your privacy rights and how the law protects you.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-[#4ADE80]">2. Data We Collect</h2>
                    <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Identity Data:</strong> first name, last name, username or similar identifier.</li>
                        <li><strong>Contact Data:</strong> billing address, delivery address, email address and telephone numbers.</li>
                        <li><strong>Transaction Data:</strong> details about payments to and from you and other details of products you have purchased from us.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-[#4ADE80]">3. How We Use Your Data</h2>
                    <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                        <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-[#4ADE80]">4. Contact Us</h2>
                    <p>If you have any questions about this privacy policy, please contact us at support@trueline-dynamics.com.</p>
                </section>
            </div>
        </div>
    );
}
